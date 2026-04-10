---
title: "JWT 与 Session 分工详解"
slug: "01-认证登录-02-jwt与session分工"
summary: "项目使用 StpLogicJwtForSimple，这是 SaToken 的 JWT 简单模式。"
date: "2026-04-10"
tags:
  - "实习经历"
  - "认证登录"
source: "01-认证登录/02-JWT与Session分工.md"
---
**项目**: cqql-mp-platform-cqjlp-api
**框架**: SaToken (国产认证框架)
**模式**: JWT + Session 混合

---

## 一、JWT 与 Session 的分工

```
┌─────────────────────────────────────────────────────────────┐
│                      认证架构                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   JWT (轻量)              Session (重量)                      │
│      │                        │                             │
│      ├─ userId                ├─ UserToken                  │
│      ├─ 签名                  ├─ username                   │
│      ├─ 过期时间              ├─ roleCodes (角色)          │
│      └─ (就这些)              ├─ permissionCodes (权限)    │
│                               ├─ phone                      │
│                               └─ realName                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

| JWT | Session |
|-----|---------|
| 身份验证 | 存储用户信息 |
| 无状态 | 有状态 |
| 跨服务传递 | 动态更新 |
| 客户端存储 | Redis 存储 |

---

## 二、为什么使用 JWT + Session 混合模式？

### 2.1 纯 JWT 的优缺点

| 优点 | 缺点 |
|------|------|
| 无状态，服务端不存储 | 无法动态更新权限 |
| 跨服务传递方便 | 无法踢人下线 |
| 性能好（不查 Redis） | payload 大小受限 |

### 2.2 纯 Session 的优缺点

| 优点 | 缺点 |
|------|------|
| 可动态更新权限 | 有状态，服务端存储 |
| 可踢人下线 | 跨服务传递需要共享 Session |
| 可存储大量数据 | 每次请求要查 Redis |

### 2.3 混合模式的优势

```
┌─────────────────────────────────────────────────────────────┐
│                    混合模式优势                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  JWT 负责：                                                 │
│     ├─ 身份验证（userId）                                   │
│     ├─ 跨服务传递                                          │
│     └─ 无状态校验                                          │
│                                                             │
│  Session 负责：                                             │
│     ├─ 存储完整用户信息                                     │
│     ├─ 动态更新权限                                        │
│     └─ 踢人下线                                            │
│                                                             │
│  类比：                                                    │
│     JWT = 身份证（轻量，随身携带）                          │
│     Session = 钱包（重量，放在家里/银行）                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 三、StpLogicJwtForSimple 模式

### 3.1 模式说明

项目使用 `StpLogicJwtForSimple`，这是 SaToken 的 **JWT 简单模式**。

```java
@Bean
public StpLogic getStpLogicJwt() {
    return new StpLogicJwtForSimple();  // 使用 JWT 模式
}
```

**特点**：
- JWT 里包含过期时间（exp 字段）
- Session 存在 Redis 中，也有过期时间
- 两者都由 `timeout` 配置控制
- **理论上是一致的**

### 3.2 配置

```yaml
sa-token:
  token-name: Authorization     # 请求头字段名
  token-prefix: Bearer          # JWT前缀
  jwt-secret-key: 'd0!doc15415B0*4G0`'
  is-print: false
  is-log: false
  isReadCookie: false
  isReadBody: false
  timeout: 86400                # 24小时（秒）
```

---

## 四、JWT 与 Session 过期时间的关系

### 4.1 过期时间同步机制

**重要结论**：在 `StpLogicJwtForSimple` 模式下，JWT 和 Session 的过期时间是**同步的**。

```
登录时（T+0）：
  1. StpUtil.login(userId)
  2. 生成 JWT（exp 字段 = T + 86400秒）
  3. 创建 Session（过期时间 = 86400秒）
  4. 存入 Redis

结果：
  - JWT 过期时间 = 24小时后
  - Session 过期时间 = 24小时后
  - 两者同步
```

### 4.2 过期场景分析

| 场景 | JWT 状态 | Session 状态 | 结果 |
|------|---------|-------------|------|
| **T+23小时** | ✅ 有效 | ✅ 有效 | 正常访问 |
| **T+24小时** | ❌ 过期 | ❌ 过期 | 访问被拦截 → 401 |

**不会出现的情况**：
- ❌ JWT 过期，Session 还在
- ❌ Session 过期，JWT 还在

**原因**：SaToken 用同一个 `timeout` 配置生成 JWT 和 Session，保证同步。

### 4.3 特殊场景：Session 过期查询

如果代码逻辑有问题，导致 Session 被提前删除：

```java
UserToken token = UserContext.getUserToken();
// 如果 Session 过期被删除
token = null;  // 返回 null
```

**结果**：
- `getUserId()` 能正常获取（从 JWT 提取）
- `getUserToken()` 返回 `null`（Session 不存在）
- 后续代码可能抛出 `NullPointerException`

**预防措施**：
```java
UserToken token = UserContext.getUserToken();
if (token == null) {
    // Session 过期，需要重新登录
    throw new BizException("Session已过期，请重新登录");
}
```

---

## 五、Session 过期会"重建"吗？

### 5.1 问题分析

**疑惑**：如果 JWT 还没过期，但 Session 过期了，Session 会重建吗？

**答案**：不会重建，会返回 `null`。需要在代码中判空处理。

### 5.2 为什么不重建？

```
┌─────────────────────────────────────────────────────────────┐
│                  Session 不重建的原因                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 数据丢失风险                                            │
│     ├─ 重建 Session = 数据清空                              │
│     ├─ 用户权限信息丢失                                     │
│     └─ 用户被当成"新用户"                                   │
│                                                             │
│  2. 安全考虑                                                │
│     ├─ Session 过期 = 用户长时间未活跃                       │
│     ├─ 强制重新登录更安全                                   │
│     └─ 避免长时间未活跃的用户仍能访问                        │
│                                                             │
│  3. SaToken 设计                                            │
│     ├─ Session 过期后直接删除                               │
│     ├─ 不自动重建                                          │
│     └─ 开发者需要显式处理                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 六、常见面试题

### Q1: 为什么使用 JWT 模式（StpLogicJwtForSimple）？

**A**:
- JWT 只存储基本信息（userId、过期时间）
- 校验通过后，从 Session 中获取完整的用户信息（UserToken）
- JWT = 身份证（轻量），Session = 钱包（重量）
- 这种混合模式结合了 JWT 的无状态和 Session 的数据存储能力

### Q2: JWT 过期和 Session 过期有关系吗？

**A**:
- 在 `StpLogicJwtForSimple` 模式下，两者是同步的
- 都由 `timeout` 配置控制
- 不会出现"一个过期一个没过期"的情况

### Q3: 如果 Session 过期了，getUserToken() 会怎样？

**A**:
- 返回 `null`
- 如果代码没有判空处理，会抛出 `NullPointerException`
- 建议使用 `getUserIdIgnoreEx()` 或者判空处理

### Q4: 为什么 Session 过期不自动重建？

**A**:
- 重建 Session = 数据清空，用户权限信息丢失
- Session 过期代表用户长时间未活跃，强制重新登录更安全
- SaToken 设计为不自动重建，开发者需要显式处理

---

## 七、总结

### 核心认知

| 要点 | 理解 |
|------|------|
| **JWT vs Session** | JWT 只存 userId，Session 存完整用户信息 |
| **混合模式** | 结合 JWT 无状态和 Session 数据存储的优势 |
| **过期时间** | 两者同步，都由 timeout 配置控制 |
| **Session 过期** | 不重建，返回 null，需要判空处理 |

### 一句话总结

> **JWT 用于身份验证（轻量），Session 用于存储用户信息（重量），两者过期时间同步，Session 过期不重建。**
