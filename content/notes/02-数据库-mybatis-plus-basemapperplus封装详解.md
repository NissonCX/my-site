---
title: "MyBatis-Plus BaseMapperPlus 封装详解"
slug: "02-数据库-mybatis-plus-basemapperplus封装详解"
summary: "BaseMapperPlus 的设计原理、Vo 查询方法、Mapper default 方法"
date: "2026-03-03"
tags:
  - "实习经历"
  - "数据库"
source: "02-数据库/MyBatis-Plus BaseMapperPlus封装详解.md"
---
**项目**: cqql-mp-platform-cqjlp-api
**学习时间**: 2026-03-03
**核心问题**: BaseMapperPlus 的设计原理、Vo 查询方法、Mapper default 方法

---

## 一、BaseMapperPlus 是什么？

### 1.1 问题背景

```java
// 普通 MyBatis-Plus 查询
User user = userMapper.selectById(1L);
UserVo vo = new UserVo();
vo.setId(user.getId());
vo.setName(user.getName());
// ... 手动赋值，很繁琐
```

每个查询都需要手动转换 Entity → Vo，代码重复且容易遗漏。

### 1.2 解决方案

```java
// 项目封装后
UserVo vo = userMapper.selectVoById(1L);  // 一行搞定！
```

### 1.3 接口定义

```java
/**
 * 自定义 Mapper 基类
 * @param <T> 实体类型
 * @param <V> Vo 类型
 */
public interface BaseMapperPlus<T, V> extends BaseMapper<T> {

    /**
     * 根据 ID 查询 Vo
     */
    V selectVoById(Serializable id);

    /**
     * 分页查询 Vo 列表
     */
    Page<V> selectVoPage(Page<T> page, Wrapper<T> wrapper);

    /**
     * 查询 Vo 列表
     */
    List<V> selectVoList(Wrapper<T> wrapper);
}
```

---

## 二、Vo 查询方法详解

### 2.1 selectVoById

```java
// 使用示例
SysUseUnitVo vo = baseMapper.selectVoById("1");
```

**内部原理**：
1. 调用 `selectById()` 查询 Entity
2. 使用 MapStruct 将 Entity 转换为 Vo
3. 返回 Vo 对象

### 2.2 selectVoPage

```java
// 使用示例
Page<SysUseUnitVo> page = baseMapper.selectVoPage(
    pageQuery.build(),      // 分页参数
    buildQueryWrapper(bo)   // 查询条件
);
```

**内部原理**：
1. 调用 `selectPage()` 分页查询 Entity
2. 遍历结果列表，逐个转换为 Vo
3. 封装为 `Page<Vo>` 返回

### 2.3 selectVoList

```java
// 使用示例
List<SysUseUnitVo> list = baseMapper.selectVoList(buildQueryWrapper(bo));
```

---

## 三、Mapper default 方法

### 3.1 什么是 default 方法？

Java 8 引入的接口默认方法，允许在接口中直接写方法实现。

```java
public interface SysUseUnitMapper extends BaseMapperPlus<SysUseUnit, SysUseUnitVo> {

    // default 方法：有实现体，不需要实现类
    default Page<SysUseUnitVo> selectPageUseUnitList(Page<SysUseUnit> page, Wrapper<SysUseUnit> wrapper) {
        return this.selectVoPage(page, wrapper);
    }
}
```

### 3.2 为什么要写 default 方法？

| 场景 | 说明 |
|------|------|
| **语义封装** | `selectPageUseUnitList` 比 `selectVoPage` 更语义化 |
| **扩展点** | 可以在方法中加入额外逻辑 |
| **兼容性** | 不影响现有的 Mapper XML |

### 3.3 default 方法 vs 抽象方法

| 对比 | abstract 方法 | default 方法 |
|------|--------------|-------------|
| **实现** | 必须由实现类实现 | 接口中直接实现 |
| **XML 映射** | 需要 XML 文件 | 不需要 XML |
| **适用场景** | 复杂 SQL | 简单封装 |

---

## 四、项目分层架构总结

### 4.1 三层结构

```
┌─────────────────────────────────────────────────────────────────┐
│                        Controller 层                             │
│  ────────────────────────────────────────────────────────────  │
│  职责：接收请求、参数校验、调用 Service、返回响应                 │
│  特点：不包含业务逻辑，只做转发                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                         Service 层                               │
│  ────────────────────────────────────────────────────────────  │
│  职责：业务逻辑处理、事务控制                                     │
│  特点：包含核心业务规则                                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                         Mapper 层                                │
│  ────────────────────────────────────────────────────────────  │
│  职责：数据库访问                                                │
│  特点：只关注 SQL 操作，不关心业务                                │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 DTO/VO/Entity 的区别

```
┌─────────────────────────────────────────────────────────────────┐
│                          数据流转图                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   前端请求 ─────→ Bo (DTO) ─────→ Entity ─────→ 数据库          │
│                 接收参数         业务对象        存储             │
│                                                                 │
│   前端响应 ←───── Vo           ←─ Entity ←───── 数据库          │
│                 返回数据         查询结果        查询             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| 类型 | 全称 | 作用 | 位置 |
|------|------|------|------|
| **Entity** | Entity | 映射数据库表 | domain/entity |
| **Bo** | Business Object | 接收前端参数 | domain/dto |
| **Vo** | View Object | 返回给前端 | domain/vo |

### 4.3 为什么要分 Bo 和 Vo？

| 问题 | Bo | Vo |
|------|----|----|
| **密码字段** | 创建时需要 | 返回时不能包含 |
| **创建时间** | 创建时不需要 | 返回时需要显示 |
| **敏感字段** | 用户可能篡改 | 服务端控制返回 |

---

## 五、MapStruct 对象转换

### 5.1 基本用法

```java
// Bo → Entity
SysUseUnit entity = MapstructUtils.convert(bo, SysUseUnit.class);

// Entity → Vo（自动通过 @AutoMapper 注解实现）
```

### 5.2 @AutoMapper 注解

```java
@Data
@AutoMapper(target = SysUseUnit.class)  // 自动生成转换代码
public class SysUseUnitVo {
    // ...
}
```

**原理**：
- 编译时生成实现类
- 按字段名自动映射
- 性能接近手写代码

### 5.3 MapStruct vs BeanUtils

| 对比 | MapStruct | BeanUtils |
|------|-----------|-----------|
| **原理** | 编译时生成代码 | 运行时反射 |
| **性能** | 高 | 低 |
| **类型安全** | 编译时检查 | 运行时异常 |
| **推荐场景** | 生产环境 | 测试环境 |

---

## 六、唯一性校验实现

### 6.1 校验逻辑

```java
@Override
public boolean checkUnitNameUnique(SysUseUnitBo bo) {
    boolean exist = baseMapper.exists(new LambdaQueryWrapper<SysUseUnit>()
            .eq(SysUseUnit::getUnitName, bo.getUnitName())
            .ne(ObjectUtil.isNotNull(bo.getId()), SysUseUnit::getId, bo.getId()));
    return !exist;
}
```

### 6.2 为什么要排除自身 ID？

```
场景：修改单位名称

如果用户没有改名称，只是改了联系人：
- 不排除 ID：查到自己，误判为重复
- 排除 ID：排除自己，正确判断

.ne(bo.getId() != null, SysUseUnit::getId, bo.getId())
   ↑ 新增时 bo.getId() 为 null，条件不生效
   ↑ 修改时 bo.getId() 不为 null，排除自己
```

---

## 七、Swagger 注解说明

### 7.1 常用注解

```java
@Tag(name = "使用单位管理")  // Controller 类上
@Operation(summary = "获取使用单位列表")  // 方法上
@Schema(description = "单位名称")  // 字段上
```

### 7.2 生成的 API 文档

- 访问 `/swagger-ui.html` 或 `/doc.html`
- 自动展示接口列表、参数说明、返回值结构
- 支持在线测试

---

## 八、常见面试题

### Q: BaseMapperPlus 和 BaseMapper 的区别？

**A**: BaseMapperPlus 继承 BaseMapper，额外提供了 Vo 查询方法，避免手动转换。

### Q: 为什么要用 Vo 而不是直接返回 Entity？

**A**:
1. Entity 可能包含敏感字段（密码等）
2. Entity 可能缺少前端需要的字段（关联数据）
3. 返回数据结构应该由后端控制，解耦数据库设计

### Q: default 方法能替代 XML 吗？

**A**: 简单查询可以，复杂 SQL（多表关联、子查询）还是需要 XML。

---

## 九、代码位置

| 功能 | 位置 |
|------|------|
| **BaseMapperPlus** | `app/core/BaseMapperPlus.java` |
| **MapstructUtils** | `app/core/MapstructUtils.java` |
| **示例 Mapper** | `app/mapper/SysUseUnitMapper.java` |
| **示例 Service** | `app/service/impl/SysUseUnitServiceImpl.java` |

---

## 十、核心认知总结

| 要点 | 理解 |
|------|------|
| **BaseMapperPlus** | 封装 Vo 查询方法，简化 Entity → Vo 转换 |
| **default 方法** | Java 8 接口默认方法，用于简单封装 |
| **分层架构** | Controller → Service → Mapper，职责分离 |
| **DTO/VO 分离** | Bo 接收参数，Vo 返回数据，安全可控 |
| **MapStruct** | 编译时对象转换，高性能、类型安全 |
| **唯一性校验** | exists() + 排除自身 ID，支持新增和修改 |

---

## 十一、设计巧妙之处（深入理解）

### 11.1 设计者视角：这个封装为什么巧妙？

这是项目 mentor 自定义的功能增强类，相比原生 BaseMapper 增加了三大能力：

| 功能 | BaseMapper | BaseMapperPlus |
|------|------------|----------------|
| 基础 CRUD | ✅ | ✅ |
| **自动 Entity → Vo 转换** | ❌ | ✅ |
| **批量插入/更新** | ❌ 需手动实现 | ✅ 内置方法 |
| **Vo 泛型支持** | ❌ | ✅ |

### 11.2 巧妙之处一：泛型双参数设计

```java
public interface BaseMapperPlus<T, V> extends BaseMapper<T>
// T = Entity, V = Vo
```

**巧妙点**：一个接口同时绑定实体类和视图类，自动关联，无需每次手动指定。

### 11.3 巧妙之处二：默认方法实现

所有增强方法都用 `default` 实现，子接口无需额外写代码，继承即用：

```java
default V selectVoById(Serializable id) {
    T obj = this.selectById(id);
    return MapstructUtils.convert(obj, this.currentVoClass());
}
```

**巧妙点**：
- 不需要实现类，接口自己完成逻辑
- 子 Mapper 只需继承，零代码获得功能

### 11.4 巧妙之处三：泛型反射自动获取类型

```java
default Class<V> currentVoClass() {
    return (Class<V>) GenericTypeUtils.resolveTypeArguments(
        this.getClass(), BaseMapperPlus.class)[1];
}
```

**巧妙点**：
- 通过反射从泛型参数中提取 Vo 类型
- 编译时不感知，运行时自动获取
- 实现"声明即绑定"的效果

### 11.5 使用对比

**传统做法**：
```java
// 每个 Mapper 都要写这样的方法
default SysUserVo selectVoById(Serializable id) {
    SysUser user = this.selectById(id);
    SysUserVo vo = new SysUserVo();
    BeanUtils.copyProperties(user, vo);
    return vo;
}
```

**使用 BaseMapperPlus**：
```java
// 只需继承，直接使用
public interface SysUserMapper extends BaseMapperPlus<SysUser, SysUserVo> {}

// Service 中直接调用
SysUserVo vo = userMapper.selectVoById(id);
```

### 11.6 批量操作方法

```java
// 批量插入
boolean insertBatch(Collection<T> entityList)

// 批量更新
boolean updateBatchById(Collection<T> entityList)

// 批量插入或更新
boolean insertOrUpdateBatch(Collection<T> entityList)
```

**巧妙点**：底层调用 `Db.saveBatch()`，避免循环单条插入，性能提升显著。

### 11.7 设计模式总结

| 设计思想 | 体现 |
|---------|------|
| **模板方法** | 定义查询模板，子类继承复用 |
| **泛型擦除补偿** | 运行时通过反射获取泛型类型 |
| **默认方法** | Java 8 特性，接口可直接实现逻辑 |
| **单一职责** | BaseMapper 负责 SQL，BaseMapperPlus 负责转换 |

### 11.8 学习启示

这个设计展示了：
1. **不重复造轮子，但要善于包装轮子** - 在 BaseMapper 基础上增强
2. **利用语言特性** - Java 8 default 方法、泛型反射
3. **约定优于配置** - 继承时指定泛型，自动绑定类型
4. **减少样板代码** - 一次封装，全局复用

---

## 十二、LambdaQueryWrapper 条件式查询详解

### 12.1 条件式方法签名

```java
.like(condition, column, value)
.eq(condition, column, value)
.between(condition, column, value1, value2)
```

**三参数含义**：

| 参数位置 | 类型 | 含义 |
|---------|------|------|
| `condition` | boolean | 是否添加此条件 |
| `column` | Lambda | 数据库字段（类型安全） |
| `value` | Object | 查询值 |

### 12.2 实际代码示例

```java
.like(StringUtils.isNotBlank(bo.getUnitCode()), SysUseUnit::getUnitCode, bo.getUnitCode())
```

**执行流程图**：

```
用户传入 bo.getUnitCode() = "ABC"
           ↓
StringUtils.isNotBlank("ABC") → true
           ↓
条件满足，拼接 SQL: unit_code LIKE '%ABC%'

───────────────────────────────

用户传入 bo.getUnitCode() = "" 或 null
           ↓
StringUtils.isNotBlank(null) → false
           ↓
条件不满足，跳过此条件，不拼接任何 SQL
```

### 12.3 buildQueryWrapper 方法详解

```java
private LambdaQueryWrapper<SysUseUnit> buildQueryWrapper(SysUseUnitBo bo) {
    Map<String, Object> params = bo.getParams();
    LambdaQueryWrapper<SysUseUnit> wrapper = new LambdaQueryWrapper<>();
    wrapper.like(StringUtils.isNotBlank(bo.getUnitName()), SysUseUnit::getUnitName, bo.getUnitName())
            .like(StringUtils.isNotBlank(bo.getUnitCode()), SysUseUnit::getUnitCode, bo.getUnitCode())
            .like(StringUtils.isNotBlank(bo.getContactPerson()), SysUseUnit::getContactPerson, bo.getContactPerson())
            .eq(StringUtils.isNotBlank(bo.getStatus()), SysUseUnit::getStatus, bo.getStatus())
            .between(params.get("beginTime") != null && params.get("endTime") != null,
                    SysUseUnit::getCreateTime, params.get("beginTime"), params.get("endTime"))
            .orderByDesc(SysUseUnit::getCreateTime);
    return wrapper;
}
```

### 12.4 条件类型对照表

| 方法 | 条件 | SQL 效果 | 使用场景 |
|------|------|----------|----------|
| `.like()` | 模糊匹配 | `LIKE '%xxx%'` | 名称搜索 |
| `.eq()` | 精确匹配 | `= 'xxx'` | 状态筛选 |
| `.ne()` | 不等于 | `!= 'xxx'` | 排除条件 |
| `.between()` | 区间查询 | `BETWEEN a AND b` | 时间范围 |
| `.in()` | 包含 | `IN (a, b, c)` | 多值匹配 |
| `.orderByDesc()` | 降序排序 | `ORDER BY xxx DESC` | 时间排序 |

### 12.5 生成的 SQL 示例

**输入参数**：
- unitName = "科技"
- status = "1"
- beginTime = "2026-01-01", endTime = "2026-03-04"

**生成 SQL**：
```sql
SELECT * FROM sys_use_unit
WHERE unit_name LIKE '%科技%'
  AND status = '1'
  AND create_time BETWEEN '2026-01-01' AND '2026-03-04'
ORDER BY create_time DESC
```

### 12.6 为什么这样设计？

**传统 MyBatis XML 写法**：
```xml
<if test="unitCode != null and unitCode != ''">
    AND unit_code LIKE CONCAT('%', #{unitCode}, '%')
</if>
```

**MyBatis-Plus 一行搞定**：
```java
.like(StringUtils.isNotBlank(bo.getUnitCode()), SysUseUnit::getUnitCode, bo.getUnitCode())
```

**优点**：
1. 代码简洁，减少模板代码
2. Lambda 表达式类型安全，编译期检查
3. 链式调用，可读性好
4. 动态条件拼接，无需 if-else

---

## 十三、selectVoList 内部原理

### 13.1 源码分析

```java
default List<V> selectVoList(Wrapper<T> wrapper) {
    return selectVoList(wrapper, this.currentVoClass());
}

default <C> List<C> selectVoList(Wrapper<T> wrapper, Class<C> voClass) {
    // 1. 调用父类 BaseMapper.selectList(wrapper) 查询数据库
    List<T> list = this.selectList(wrapper);  // ← 这里真正查数据库！

    // 2. 空判断
    if (CollUtil.isEmpty(list)) {
        return CollUtil.newArrayList();
    }

    // 3. 使用 MapStruct 将 Entity 转换为 Vo
    return MapstructUtils.convert(list, voClass);
}
```

### 13.2 完整流程图

```
baseMapper.selectVoList(buildQueryWrapper(bo))
                    ↓
        ┌──────────────────────────┐
        │ 1. selectList(wrapper)   │  ← MyBatis-Plus 原生方法
        │    生成 SQL:             │
        │    SELECT * FROM table   │
        │    WHERE ...             │
        │    执行 JDBC 查询数据库   │
        └──────────────────────────┘
                    ↓
        ┌──────────────────────────┐
        │ 2. 返回 List<Entity>     │  ← 实体对象列表
        └──────────────────────────┘
                    ↓
        ┌──────────────────────────┐
        │ 3. MapstructUtils.convert│  ← 对象转换
        │    Entity → Vo           │
        └──────────────────────────┘
                    ↓
        ┌──────────────────────────┐
        │ 返回 List<Vo>            │  ← VO 对象列表
        └──────────────────────────┘
```

### 13.3 为什么 selectVoById 只需要传 ID？

**selectVoById 源码**：
```java
default V selectVoById(Serializable id) {
    T obj = this.selectById(id);  // ← 只需要 id！
    if (ObjectUtil.isNull(obj)) {
        return null;
    }
    return MapstructUtils.convert(obj, this.currentVoClass());
}
```

**对比**：

| 方法 | 输入 | 生成的 SQL | 使用场景 |
|------|------|------------|----------|
| `selectVoById(id)` | 单个 ID | `WHERE id = ?` | 精确查单条 |
| `selectVoList(wrapper)` | 复杂条件 | `WHERE ... LIKE ... AND ...` | 条件查多条 |

**原因**：主键唯一，数据库能直接定位，不需要其他条件。

---

## 十四、完整继承关系图

```
┌─────────────────────────────────────────────────────────────┐
│                      BaseMapper<T>                          │
│  (MyBatis-Plus 原生接口)                                     │
│  - selectById(id)                                           │
│  - selectList(wrapper)                                      │
│  - insert(entity)                                           │
│  - updateById(entity)                                       │
│  - deleteById(id)                                           │
└──────────────────────────┬──────────────────────────────────┘
                           │ extends
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  BaseMapperPlus<T, V>                       │
│  (自定义扩展接口)                                            │
│  - selectVoById(id)      → 自动转换 T → V                   │
│  - selectVoList(wrapper) → 自动转换 List<T> → List<V>       │
│  - selectVoPage(...)     → 分页 + 自动转换                   │
│  - insertBatch()         → 批量插入                         │
│  - updateBatchById()     → 批量更新                         │
└──────────────────────────┬──────────────────────────────────┘
                           │ extends
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   SysUseUnitMapper                          │
│  extends BaseMapperPlus<SysUseUnit, SysUseUnitVo>           │
│                                                             │
│  T = SysUseUnit  (实体类，对应数据库表)                       │
│  V = SysUseUnitVo (VO类，返回给前端)                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 十五、核心认知总结（更新）

| 要点 | 理解 |
|------|------|
| **条件式拼接** | `.like(condition, column, value)`，condition 为 true 才拼接 |
| **Lambda 表达式** | `SysUseUnit::getUnitCode` 类型安全，避免字段名硬编码 |
| **动态查询** | 根据参数有无自动决定 SQL 条件，无需 if-else |
| **selectVoList** | 内部调用 selectList() 查数据库，再转换 Entity → Vo |
| **selectVoById** | 主键查询最简单，只需 ID 即可定位 |
| **BaseMapperPlus** | 封装 Vo 查询方法，简化 Entity → Vo 转换 |
| **MapStruct** | 编译时对象转换，高性能、类型安全 |

---

## 十六、BeanUtils 手动转换替代方案

### 16.1 问题背景

当 MapStruct 配置问题导致转换失败时，可以使用 `BeanUtils.copyProperties()` 手动转换。

**错误示例**：
```
cannot find converter from SysUseUnit to SysUseUnitVo
```

### 16.2 替代方案代码

**单条查询**：
```java
@Override
public SysUseUnitVo selectUseUnitById(String id) {
    // 1. 查询 Entity
    SysUseUnit entity = baseMapper.selectById(id);
    if (entity == null) {
        return null;
    }
    // 2. 手动转换为 Vo
    SysUseUnitVo vo = new SysUseUnitVo();
    BeanUtils.copyProperties(entity, vo);
    return vo;
}
```

**列表查询**：
```java
@Override
public List<SysUseUnitVo> selectUseUnitList(SysUseUnitBo bo) {
    // 1. 查询 Entity 列表
    List<SysUseUnit> list = baseMapper.selectList(buildQueryWrapper(bo));
    // 2. 手动转换为 Vo 列表
    return list.stream().map(entity -> {
        SysUseUnitVo vo = new SysUseUnitVo();
        BeanUtils.copyProperties(entity, vo);
        return vo;
    }).collect(Collectors.toList());
}
```

**Bo 转 Entity**：
```java
@Override
public int insertUseUnit(SysUseUnitBo bo) {
    SysUseUnit entity = new SysUseUnit();
    BeanUtils.copyProperties(bo, entity);
    return baseMapper.insert(entity);
}
```

### 16.3 BeanUtils vs MapStruct 对比

| 对比项 | MapStruct | BeanUtils |
|--------|-----------|-----------|
| **原理** | 编译时生成代码 | 运行时反射 |
| **性能** | 高 | 较低 |
| **类型安全** | 编译时检查 | 运行时异常 |
| **配置要求** | 需要 @AutoMapper 注解 | 无需配置 |
| **适用场景** | 生产环境（推荐） | 临时方案、测试环境 |

### 16.4 注意事项

1. **导入正确的包**：`org.springframework.beans.BeanUtils`
2. **字段名必须一致**：不同字段名不会自动映射
3. **类型必须兼容**：类型不匹配会忽略
4. **深拷贝问题**：只复制引用，不是深拷贝
