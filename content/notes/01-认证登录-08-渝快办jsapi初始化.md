---
title: "渝快办 JSAPI 初始化详解"
slug: "01-认证登录-08-渝快办jsapi初始化"
summary: "getExtends() 方法、jsapiToken 作用、JSAPI 初始化流程"
date: "2026-04-10"
tags:
  - "实习经历"
  - "认证登录"
source: "01-认证登录/08-渝快办JSAPI初始化.md"
---
**项目**: cqql-mp-platform-cqjlp-api
**平台**: 渝快办（YKB）
**核心问题**: getExtends() 方法、jsapiToken 作用、JSAPI 初始化流程

---

## 一、问题起源

### 1.1 发现的代码

```java
@Override
public Map<String, Object> getExtends() {
    String jsApiToken = getJsApiToken();
    return MapUtil.builder(new HashMap<String, Object>())
            .put("jsapiToken", jsApiToken)
            .put("appId", ykbConfig.getAppId())
            .put("forceScopes", ykbConfig.getScopes())
            .build();
}
```

### 1.2 初步疑问

- 这个方法是做什么的？
- 为什么返回 jsapiToken、appId、forceScopes？
- 这些参数是给谁用的？

---

## 二、调用链路分析

### 2.1 完整调用链

```
GET /sys/auth/ykb/jsapiToken
    │
    ▼
AuthController.getYkbJsapiToken()
    │
    ▼
AuthServiceFactory.getExtends(AuthTypeEnum.YKB)
    │
    ▼
YkbAuthServiceImpl.getExtends()
    │
    ├─ getJsApiToken() → 调用渝快办接口获取 Token
    ├─ ykbConfig.getAppId() → 读取配置
    ├─ ykbConfig.getScopes() → 读取配置
    │
    ▼
返回：{ jsapiToken, appId, forceScopes }
```

### 2.2 接口定义

```java
// IAuthService.java
Map<String, Object> getExtends();

// AbstractAuthTemplate.java（默认实现）
@Override
public Map<String, Object> getExtends() {
    return Collections.emptyMap();  // 默认返回空 Map
}

// YkbAuthServiceImpl.java（YKB 特有实现）
@Override
public Map<String, Object> getExtends() {
    // 返回 JSAPI 初始化所需配置
}
```

---

## 三、三参数详解

### 3.1 类比：银行办业务

| 银行办业务 | 渝快办登录 | 作用 |
|-----------|-----------|------|
| **当天授权信** | **jsapiToken** | 证明"此时有权限调用" |
| **身份证** | **appId** | 证明"你是哪个应用" |
| **业务申请表** | **forceScopes** | 说明"你要哪些权限" |

### 3.2 参数对比表

| 参数 | 来源 | 时效性 | 作用 | 安全考虑 |
|------|------|--------|------|---------|
| **jsapiToken** | 后端调用渝快办接口获取 | 2小时 | 临时调用凭证 | 防止泄露后被长期滥用 |
| **appId** | 后端配置文件 | 永久 | 应用身份标识 | 公开信息，用于标识 |
| **forceScopes** | 后端配置文件 | 永久 | 权限范围声明 | 限制应用获取的用户信息 |

### 3.3 配置示例

```yaml
# application-dev.yml
ykb:
  appId: ca7f1cfb-e115-4f86-88d1-e4d5b937f701
  appKey: NSoYaGNmScvXSIJ+ZahRMQ==
  appSecretKey: 2/z!2F_7
  scopes:
    - base     # 基础信息
    - user     # 用户信息
    - mobile   # 手机号
```

---

## 四、完整业务流程

### 4.1 时序图

```
前端                              后端                   渝快办
 │                                  │                       │
 │  【阶段1：应用启动初始化】           │                       │
 │                                  │                       │
 │  GET /ykb/jsapiToken              │                       │
 ├─────────────────────────────────>│                       │
 │                                  │  获取 jsapiToken      │
 │                                  ├──────────────────────>│
 │                                  │                       │
 │                                  │  返回 jsapiToken      │
 │                                  │<──────────────────────│
 │                                  │                       │
 │  返回 {                           │                       │
 │    jsapiToken: "abc123",          │                       │
 │    appId: "xxx",                  │                       │
 │    forceScopes: [...]             │                       │
 │  }                                │                       │
 │<─────────────────────────────────│                       │
 │                                  │                       │
 │  YKB.init({                       │                       │
 │    jsapiToken: "abc123",          │                       │
 │    appId: "xxx",                  │                       │
 │    scopes: [...]                  │                       │
 │  })                               │                       │
 │  ✅ JS-SDK 初始化完成              │                       │
 │                                  │                       │
 │  【阶段2：用户点击登录】            │                       │
 │                                  │                       │
 │  YKB.login()                      │                       │
 │  ├─ 用 jsapiToken 调用渝快办      │                       │
 │  ├─ 跳转授权页                     │                       │
 │  └─ 返回 code                     │                       │
 │                                  │                       │
 │  POST /app/login { code }         │                       │
 │ ├────────────────────────────────>│                       │
 │                                  │  用 code 换用户信息    │
 │                                  ├──────────────────────>│
 │                                  │                       │
 │                                  │  返回用户信息          │
 │                                  │<──────────────────────│
 │                                  │  生成 JWT              │
 │                                  │                       │
 │  返回 JWT                         │                       │
 │<─────────────────────────────────│                       │
 │                                  │                       │
 │  存储 JWT，后续请求携带             │                       │
```

### 4.2 为什么启动时获取 jsapiToken？

| 方案 | 用户体验 | 说明 |
|------|---------|------|
| **点击登录时获取** | ❌ 差 | 用户点击 → 等待 1-2 秒 → 才跳转 |
| **应用启动时获取** | ✅ 好 | 启动时后台获取 → 点击立即跳转 |

---

## 五、JSAPI 是什么？

### 5.1 定义

```
JSAPI = JavaScript Application Programming Interface
     = JavaScript 应用程序编程接口
```

### 5.2 渝快办 JS-SDK 的作用

| 功能 | 说明 |
|------|------|
| **跳转授权页** | YKB.login() |
| **获取用户信息** | YKB.getUserInfo() |
| **调用支付** | YKB.pay()（如果需要） |
| **其他功能** | 渝快办提供的各种能力 |

### 5.3 类比微信 JS-SDK

```javascript
// 微信小程序
wx.login()        ← 微信提供的 JSAPI
wx.getUserInfo()  ← 微信提供的 JSAPI

// 渝快办小程序
YKB.login()       ← 渝快办提供的 JSAPI
YKB.getUserInfo() ← 渝快办提供的 JSAPI
```

---

## 六、核心设计思想

### 6.1 为什么不是"前端写死配置"？

❌ **前端写死的隐患**：
- AppId 暴露在前端代码，容易被伪造
- jsapiToken 有时效性，写死会过期
- 无法动态切换环境（dev/test/prod）

✅ **后端返回的好处**：
- 敏感配置不暴露在前端
- Token 可动态刷新
- 环境配置统一管理

### 6.2 模板方法模式的扩展点

```
┌─────────────────────────────────────────────────────────────┐
│                    模板方法模式应用                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  IAuthService (接口)                                        │
│     │                                                       │
│     ├─ getExtends()  ← 扩展点：返回平台特定配置              │
│     │                                                       │
│  AbstractAuthTemplate (默认实现)                             │
│     ├─ getExtends() → 返回 emptyMap（大多数平台不需要）      │
│     │                                                       │
│  YkbAuthServiceImpl (YKB 特定实现)                           │
│     ├─ getExtends() → 返回 JSAPI 配置                        │
│     │                                                       │
│  YkzAuthServiceImpl (YKZ 特定实现)                           │
│     ├─ getExtends() → 返回 emptyMap（YKZ 不需要）            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.3 为什么返回 Map 而不是具体对象？

| 方案 | 优点 | 缺点 |
|------|------|------|
| **返回具体对象** | 类型安全 | 每个平台要定义不同的 DTO |
| **返回 Map** | 灵活，易扩展 | 无类型检查 |

选择 Map 的原因：
- 不同平台的扩展参数差异大
- YKB 需要 jsapiToken，YKZ 可能需要别的
- 避免频繁改接口定义

---

## 七、性能优化方案

### 7.1 当前实现

```
每次请求 /ykb/jsapiToken → 调用渝快办接口 → 获取 Token
```

### 7.2 高并发风险

```
每秒 1000 个请求 → 1000 次 HTTP 调用 → 可能触发限流
```

### 7.3 大厂优化方案

**方案1：Redis 缓存**
```java
@Cacheable(value = "ykb:jsapiToken", expire = 7200)
private String getJsApiToken() {
    // 原有逻辑
}
```

**方案2：本地缓存 + Redis 缓存**
```java
private String getJsApiToken() {
    // 一级缓存：本地（1分钟）
    String token = localCache.get("jsapiToken");
    if (token != null) return token;

    // 二级缓存：Redis（2小时）
    token = redisCache.get("ykb:jsapiToken");
    if (token != null) {
        localCache.put("jsapiToken", token, 60);
        return token;
    }

    // 调用渝快办接口
    token = requestFromYkb();
    redisCache.set("ykb:jsapiToken", token, 7200);
    localCache.put("jsapiToken", token, 60);
    return token;
}
```

**方案3：定时任务预刷新**
```java
@Scheduled(fixedRate = 3600000) // 每小时刷新
public void refreshJsApiToken() {
    String newToken = requestFromYkb();
    redisCache.set("ykb:jsapiToken", newToken, 7200);
}
```

---

## 八、常见面试题

### Q1: 为什么不能用静态配置代替 jsapiToken？

**A**:
- jsapiToken 有时效性（通常 2 小时）
- 必须通过接口动态获取
- 配置文件只能存 appId/appSecret

### Q2: getExtends() 为什么返回 Map？

**A**:
- 不同平台的扩展参数差异大
- YKB 需要 jsapiToken，YKZ 可能需要别的
- Map 更灵活，避免频繁改接口

### Q3: 如果 jsapiToken 在用户登录过程中过期了？

**A**:
- 前端调用 YKB.login() 失败
- 渝快办返回 "Token 已过期"
- 解决：前端捕获错误 → 自动重新获取 Token → 重试登录

### Q4: 为什么后端返回 appId 和 scopes？

**A**:
- **统一管理**：所有配置在后端，前端不需要关心
- **环境隔离**：dev/test/prod 用不同 appId，前端无感知
- **动态调整**：调整权限范围只需改后端配置

---

## 九、总结

### 核心认知

| 要点 | 理解 |
|------|------|
| **getExtends()** | 返回前端初始化所需参数 |
| **jsapiToken** | 前端的临时调用凭证，2小时时效 |
| **appId** | 应用身份标识 |
| **forceScopes** | 权限范围声明 |
| **设计合理性** | 模板方法模式的扩展点 |

### 一句话总结

> **jsapiToken = 前端的临时调用凭证**
> **appId = 应用的身份证**
> **forceScopes = 权限范围声明**
> **三者结合 = 前端可以安全地调用渝快办 JS-SDK**

---

## 十、代码位置

| 功能 | 文件 |
|------|------|
| 接口定义 | `system/service/IAuthService.java` |
| 默认实现 | `system/service/impl/AbstractAuthTemplate.java` |
| YKB 实现 | `system/service/impl/YkbAuthServiceImpl.java` |
| Controller | `system/controller/AuthController.java` |
| 配置类 | `core/config/YkbConfig.java` |
