---
title: "TypeHandler 深入详解与静态持有者模式"
slug: "02-数据库-typehandler深入详解与静态持有者模式"
summary: "TypeHandler 工作原理、静态持有者模式、多线程安全性"
date: "2026-03-02"
tags:
  - "实习经历"
  - "数据库"
source: "02-数据库/TypeHandler深入详解与静态持有者模式.md"
---
**项目**: cqql-mp-platform-cqjlp-api
**学习时间**: 2026-03-02 下午
**核心问题**: TypeHandler 工作原理、静态持有者模式、多线程安全性

---

## 一、TypeHandler 本质

### 1.1 什么是 TypeHandler？

```
TypeHandler = MyBatis 的"数据转换中间件"

作用：
  ├─ 写入数据库前：自动转换（如加密）
  ├─ 读取数据库后：自动转换（如解密）
  └─ 对业务代码透明
```

### 1.2 BaseTypeHandler 的四个方法

```java
public abstract class BaseTypeHandler<T> {
    // 1. 写入数据库（只有1个方法）
    void setNonNullParameter(PreparedStatement ps, int i, T parameter, JdbcType jdbcType);

    // 2. 从数据库读取（有3个重载方法）
    T getNullableResult(ResultSet rs, String columnName);
    T getNullableResult(ResultSet rs, int columnIndex);
    T getNullableResult(CallableStatement cs, int columnIndex);
}
```

| 方法 | 调用场景 | 参数说明 |
|------|---------|---------|
| `setNonNullParameter` | INSERT / UPDATE | ps: SQL执行对象, i: 第几个?, parameter: 业务传的值 |
| `getNullableResult(列名)` | SELECT 通过列名获取 | columnName: 数据库列名 |
| `getNullableResult(索引)` | SELECT 通过索引获取 | columnIndex: 第几列（从1开始） |
| `getNullableResult(CallableStatement)` | 调用存储过程 | cs: 存储过程对象 |

---

## 二、静态持有者模式

### 2.1 核心矛盾

```
┌─────────────────────────────────────────────────────────────────┐
│                   Spring vs MyBatis 容器冲突                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  【Spring 容器】                  【MyBatis 容器】               │
│   ├─ @Component                    ├─ TypeHandler              │
│   ├- @Autowired                    ├─ 反射创建                  │
│   ├─ 依赖注入                      ├─ 无依赖注入                │
│   └─ 单例 Bean                    └─ 不是 Spring Bean         │
│                                                                 │
│   问题：TypeHandler 需要 Spring Bean，但拿不到！               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 为什么 TypeHandler 不是 Spring Bean？

```java
// MyBatis 内部创建 TypeHandler 的方式（简化）
public class TypeHandlerRegistry {
    public void register(Class<?> javaType, Class<? extends TypeHandler<?>> handlerClass) {
        // ❌ MyBatis 用反射直接创建，不是从 Spring 容器拿！
        TypeHandler<?> handler = handlerClass.newInstance();  // 反射创建
        typeHandlerMap.put(javaType, handler);
    }
}
```

**原因**：
- MyBatis 不想依赖 Spring，保持独立性
- 可以在任何环境使用（不一定是 Spring）

### 2.3 静态持有者模式的原理

```java
// Spring 管理的桥接类
@Component
public class SansecCryptoServiceHolder {
    public static ISansecCryptoService instance;  // ← static 变量

    @Autowired
    public SansecCryptoServiceHolder(ISansecCryptoService cryptoService) {
        SansecCryptoServiceHolder.instance = cryptoService;  // ← 赋值给 static
    }
}

// TypeHandler 使用
public class SansecTypeHandler extends BaseTypeHandler<String> {
    private ISansecCryptoService getCryptoService() {
        return SansecCryptoServiceHolder.instance;  // ← 直接访问 static
    }
}
```

```
┌─────────────────────────────────────────────────────────────────┐
│                   静态持有者模式的工作原理                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  【阶段1：Spring 启动】                                          │
│  ────────────────────────────────────────────────────────────  │
│  1. 扫描 @Component                                            │
│  2. 找到 ISansecCryptoService 的实现类                           │
│  3. 调用构造函数：new Holder(sansecService)                     │
│  4. 构造函数内部：instance = sansecService                      │
│  5. ✅ static 变量被赋值                                        │
│                                                                 │
│  【阶段2：MyBatis 初始化】                                       │
│  ────────────────────────────────────────────────────────────  │
│  1. 读取 @TableField(typeHandler = SansecTypeHandler.class)     │
│  2. 创建 TypeHandler 实例（反射，无参构造）                      │
│  3. ✅ TypeHandler 准备就绪                                     │
│                                                                 │
│  【阶段3：业务运行】                                             │
│  ────────────────────────────────────────────────────────────  │
│  1. 业务代码：userMapper.insert(user)                           │
│  2. 调用：handler.setNonNullParameter()                         │
│  3. Handler 内部：Holder.instance → 拿到 Spring Bean           │
│  4. ✅ 调用加密服务                                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.4 为什么不能用成员变量？

| 方案 | 代码 | 能工作吗？ |
|------|------|-----------|
| 成员变量 | `holder.cryptoService` | ❌ 拿不到 Holder 实例 |
| static 变量 | `Holder.instance` | ✅ 直接访问类名 |

**原因**：
- 成员变量需要对象实例才能访问
- TypeHandler 不是 Spring Bean，拿不到 Holder 的实例
- static 变量不需要对象，直接用类名就能访问

---

## 三、多线程安全性

### 3.1 问题

```java
// 100 个请求同时到达
public void setNonNullParameter(...) {
    getCryptoService().symmetricEncrypt(parameter);  // ← 多个线程同时访问
}
```

### 3.2 答案

| 分析 | 说明 |
|------|------|
| **写入时机** | instance 只在 Spring 启动时赋值一次 |
| **读取操作** | 业务代码只读取，不写入 |
| **结论** | 只读操作是线程安全的，不需要 synchronized |

### 3.3 volatile 的作用

```java
public static volatile ISansecCryptoService instance;
```

| 作用 | 说明 |
|------|------|
| **可见性** | 写入立即刷新到主内存，读取从主内存获取 |
| **禁止重排序** | 保证赋值操作不会被优化重排 |

```
┌─────────────────────────────────────────────────────────────────┐
│                   volatile 的内存语义                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  没有 volatile：                                                │
│  ────────────────────────────────────────────────────────────  │
│  线程A写入 → CPU缓存 → 可能不同步到主内存 ⚠️                     │
│  线程B读取 → CPU缓存 → 可能读到旧值（null）⚠️                     │
│                                                                 │
│  有 volatile：                                                 │
│  ────────────────────────────────────────────────────────────  │
│  线程A写入 → 立即刷新到主内存 ✅                                │
│  线程B读取 → 直接从主内存读取 ✅                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 四、decryptSafely 的风险

### 4.1 当前实现

```java
private String decryptSafely(String val, String columnHint) {
    if (StringUtils.isBlank(val)) {
        return val;
    }
    try {
        return getCryptoService().symmetricDecrypt(val);
    } catch (Exception e) {
        log.warn("字段 {} 解密失败，返回原值: {}", columnHint, val);
        return val;  // ⚠️ 返回原值
    }
}
```

### 4.2 风险分析

| 场景 | 结果 | 风险 |
|------|------|------|
| 数据库是密文，正常解密 | ✅ 返回明文 | 无 |
| 数据库是明文（历史数据） | ⚠️ 解密失败，返回明文 | **不知道哪些是明文** |
| 数据库是乱码/损坏 | ⚠️ 返回乱码 | 前端显示异常 |

### 4.3 改进建议

```java
// 方案1：严格模式（推荐）
if (解密失败) {
    log.error("发现明文数据或损坏数据");
    throw new BizException("数据完整性校验失败");
}

// 方案2：标记模式
if (解密失败) {
    log.warn("字段 {} 可能是明文", columnHint);
    return "***加密数据异常***";
}
```

---

## 五、加解密方案对比

### 5.1 四种主流方案

| 方案 | 技术栈 | 优点 | 缺点 | 使用场景 |
|------|--------|------|------|---------|
| **TypeHandler** | MyBatis | 透明、配置灵活 | 性能开销、绑定 MyBatis | 中小项目、政务系统 |
| **数据库加密** | MySQL 函数 | 应用无感知、支持索引 | 绑定数据库、密钥管理复杂 | 金融、医疗 |
| **AOP 拦截** | Spring AOP | 不绑定 ORM | 性能开销大（反射） | 通用框架开发 |
| **ShardingSphere** | 中间件 | 不侵入代码、配置化 | 学习成本高 | 大中型项目 |

### 5.2 大厂做法

```java
// ShardingSphere 配置方式
spring.shardingsphere.rules.encrypt.tables:
  t_user:
    columns:
      phone:
        cipherColumn: phone_cipher        # 密文列
        encryptor: sm4_encryptor          # 加密器
        plainColumn: phone                # 明文列（用于查询）
```

---

## 六、常见面试题

### Q: 为什么不能用 @Autowired？

**A**: TypeHandler 由 MyBatis 创建，不是 Spring Bean，@Autowired 只对 Spring Bean 生效。

### Q: static 变量多线程安全吗？

**A**: instance 只赋值一次，之后都是只读，只读操作是线程安全的。加上 volatile 保证内存可见性更安全。

### Q: TypeHandler 加密有什么性能问题？

**A**:
- 全表查询：每行都要解密，CPU 密集
- WHERE 条件：用不了索引
- 大厂通常用密文列 + 明文列的方案

---

## 七、代码位置

| 功能 | 位置 |
|------|------|
| **SM4 TypeHandler** | `core/handler/SM4TypeHandler.java` |
| **三未 TypeHandler** | `core/handler/SansecTypeHandler.java` |
| **静态持有者** | `core/handler/SansecCryptoServiceHolder.java` |

---

## 八、核心认知总结

| 要点 | 理解 |
|------|------|
| **TypeHandler 本质** | MyBatis 的数据转换中间件 |
| **四个方法** | setNonNullParameter（写入）+ 3个 getNullableResult（读取） |
| **静态持有者** | 通过 static 变量桥接 Spring 和 MyBatis |
| **多线程安全** | 只读操作安全，volatile 保证可见性 |
| **方案对比** | TypeHandler 适合 MyBatis 项目，大厂用 ShardingSphere |
