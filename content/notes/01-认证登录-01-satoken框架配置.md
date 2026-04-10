---
title: "SaToken 框架配置详解"
slug: "01-认证登录-01-satoken框架配置"
summary: "SaToken 配置、拦截器、权限接口、白名单、登录防刷"
date: "2026-03-01"
tags:
  - "实习经历"
  - "认证登录"
source: "01-认证登录/01-SaToken框架配置.md"
---
**项目**: cqql-mp-platform-cqjlp-api
**学习时间**: 2026-03-01
**核心问题**: SaToken 配置、拦截器、权限接口、白名单、登录防刷

---

## 一、核心组件架构

```
┌─────────────────────────────────────────────────────────────┐
│                    认证与权限架构                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  请求 → 拦截器 → 验证登录 → 获取权限 → 业务逻辑                │
│   │        │         │          │          │                 │
│   │        ▼         ▼          ▼          ▼                 │
│   │   SaToken   StpUtil   StpInterface  UserContext          │
│   │   拦截器    checkLogin   权限接口     用户上下文           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.1 组件职责

| 组件 | 文件 | 职责 |
|------|------|------|
| **SaTokenConfigure** | `core/auth/SaTokenConfigure.java` | SaToken 配置、拦截器注册 |
| **AuthConfig** | `core/auth/AuthConfig.java` | 白名单配置 |
| **StpInterfaceImpl** | `core/auth/StpInterfaceImpl.java` | 权限接口实现（角色、权限） |
| **UserContext** | `core/auth/UserContext.java` | 用户上下文工具类 |
| **UserToken** | `core/domain/dto/UserToken.java` | 用户信息 DTO |

---

## 二、SaTokenConfigure - 拦截器配置

### 2.1 核心代码

```java
@Configuration
public class SaTokenConfigure implements WebMvcConfigurer {

    public static final String USER_TOKEN_KEY = "userToken";
    public static final String JWT_USERNAME_KEY = "username";

    @Bean
    public StpLogic getStpLogicJwt() {
        return new StpLogicJwtForSimple();  // 使用 JWT 模式
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SaInterceptor(handle -> StpUtil.checkLogin()))
                .addPathPatterns("/**")  // 拦截所有请求
                .excludePathPatterns(authConfig.getExcludeUrls())  // 排除白名单
                .excludePathPatterns("/favicon.ico")
                .excludePathPatterns("/ai/forward");
    }
}
```

### 2.2 配置说明

| 配置 | 作用 |
|------|------|
| **StpLogicJwtForSimple** | 使用 JWT 简单模式（无状态） |
| **SaInterceptor** | SaToken 的拦截器 |
| **StpUtil.checkLogin()** | 检查是否登录 |
| **addPathPatterns("/**")** | 拦截所有请求 |
| **excludePathPatterns** | 排除不需要登录的 URL |

---

## 三、AuthConfig - 白名单配置

### 3.1 配置类

```java
@Data
@Configuration
@ConfigurationProperties(prefix = "system.auth")
public class AuthConfig {
    private List<String> excludeUrls;  // 不需要登录的URL
}
```

### 3.2 配置文件

```yaml
system:
  auth:
    exclude-urls:
      - /doc.html              # Swagger 文档
      - /webjars/**            # Swagger 静态资源
      - /sys/auth/**           # 登录接口
      - /file/preview/**       # 文件预览
      - /biz/screen/**         # 公开业务接口
      - /clue/warning/count    # 告警统计（公开）
```

### 3.3 白名单的作用与风险

| 接口类型 | 示例 | 原因 |
|---------|------|------|
| **登录接口** | `/sys/auth/**` | 登录本身不能拦截 |
| **文档接口** | `/doc.html` | 开发时需要访问 |
| **公开业务** | `/biz/screen/**` | 首页展示不需要登录 |

**潜在风险**：
- ❌ 如果配置错误，把需要权限的接口放进了白名单 → 敏感接口暴露
- ❌ 攻击者可以直接访问这些接口，无需登录

---

## 四、StpInterfaceImpl - 权限接口实现

### 4.1 代码实现

```java
@Component
public class StpInterfaceImpl implements StpInterface {

    @Override
    public List<String> getPermissionList(Object loginId, String loginType) {
        return UserContext.getUserToken().getPermissionCodes();
    }

    @Override
    public List<String> getRoleList(Object loginId, String loginType) {
        return UserContext.getUserToken().getRoleCodes();
    }
}
```

### 4.2 权限验证流程

```
业务代码：@SaCheckPermission("user:delete")
    │
    ▼
SaToken 调用：StpInterfaceImpl.getPermissionList()
    │
    ▼
从 UserContext 获取权限列表
    │
    ▼
检查 "user:delete" 是否在列表中
    │
    ▼
返回：允许 / 拒绝
```

**关键点**：
- 权限数据从 `UserContext` 获取（不是实时查询数据库）
- 权限存在 Session（Redis）中
- 可以动态更新权限

---

## 五、UserContext - 用户上下文

### 5.1 核心方法

```java
public class UserContext {

    // 获取用户ID
    public static String getUserId() {
        return StpUtil.getLoginIdAsString();
    }

    // 获取完整用户信息（含权限）
    public static UserToken getUserToken() {
        return getSession().getModel(SaTokenConfigure.USER_TOKEN_KEY, UserToken.class);
    }

    // 登录时设置用户信息
    public static void setUserToken(UserToken userToken) {
        getSession().set(SaTokenConfigure.USER_TOKEN_KEY, userToken);
    }

    // 忽略异常获取用户ID
    public static String getUserIdIgnoreEx() {
        try {
            return StpUtil.getLoginIdAsString();
        } catch (NotWebContextException | NotLoginException ex) {
            log.info("未登录，获取用户id失败");
        }
        return null;
    }

    // 动态更新权限
    public static void updateUserTokenRoleAndPermissionByLoginId(
        String loginId, List<String> roles, List<String> permissions
    ) {
        if (StpUtil.isLogin(loginId)) {
            SaSession session = StpUtil.getSessionByLoginId(loginId);
            UserToken userToken = session.getModel(USER_TOKEN_KEY, UserToken.class);
            userToken.setRoleCodes(roles);
            userToken.setPermissionCodes(permissions);
            session.set(USER_TOKEN_KEY, userToken);
        }
    }
}
```

### 5.2 UserToken 数据结构

```java
@Data
public class UserToken {
    // 基本信息
    private String userId;
    private String username;
    private String password;
    private String realName;
    private String phone;
    private String subjectName;

    // 权限信息
    private List<String> roleCodes;        // 角色：["ADMIN", "USER"]
    private List<String> permissionCodes;  // 权限：["user:add", "user:delete"]

    // 认证信息
    private AuthTypeEnum authType;
    private Boolean auth;  // 是否实名认证
}
```

### 5.3 动态更新权限的场景

**场景1：管理员修改用户权限**
```java
// 管理员给用户分配新角色
systemService.updateUserRoles(userId, Arrays.asList("ADMIN", "USER"));

// 实时更新在线用户的权限
UserContext.updateUserTokenRoleAndPermissionByLoginId(
    userId,
    Arrays.asList("ADMIN", "USER"),
    newPermissions
);

// 用户下次请求时，权限立即生效，无需重新登录
```

**场景2：角色权限变更**
```java
// 修改角色的权限列表
roleService.updateRolePermissions(roleId, newPermissions);

// 更新所有拥有该角色的在线用户
List<String> userIds = getOnlineUsersByRole(roleId);
userIds.forEach(userId -> {
    UserContext.updateUserTokenRoleAndPermissionByLoginId(userId, roles, newPermissions);
});
```

**关键点**：
- ✅ 修改 Session 中的 UserToken，直接更新到 Redis
- ✅ 已登录用户的权限**立即生效**，无需重新登录
- ✅ 如果有多台服务器，通过 Redis 同步

---

## 六、登录接口的防刷机制

### 6.1 当前项目的情况

**答案：当前项目在应用层没有实现防刷机制。**

搜索代码后，没有找到：
- ❌ 限流注解（@RateLimit）
- ❌ 验证码
- ❌ 登录失败次数限制
- ❌ IP 黑名单

### 6.2 现有保护措施

| 层级 | 措施 | 说明 |
|------|------|------|
| **应用层** | ❌ 无 | 这是问题所在 |
| **框架层** | ✅ BCrypt 加密 | 密码加密存储 |
| **网络层** | ❓ 未知 | 可能在 Nginx/网关层有配置 |

### 6.3 潜在风险

**攻击场景1：暴力破解密码**
```
攻击者：
  └─ 无限次调用 POST /sys/auth/login
  └─ 尝试常见密码：123456, password, admin123

结果：
  └─ 没有限制，可以一直尝试
  └─ 如果密码弱，可能被破解
```

**攻击场景2：账号枚举**
```
攻击者：
  └─ 尝试不同的用户名
  └─ 根据"用户不存在"vs"密码错误"判断用户名是否存在

结果：
  └─ 收集有效用户名，用于后续攻击
```

**攻击场景3：DDOS 攻击**
```
攻击者：
  └─ 大量请求拖垮服务器

结果：
  └─ 服务器资源耗尽
  └─ 正常用户无法访问
```

### 6.4 为什么可能没有实现？

**政务场景的特殊性**：
- 政务专网，外部攻击者无法访问
- 用户群体固定（公务员），不是公网用户
- 网络层可能有访问控制（IP 白名单、防火墙）

**但这不代表安全**：
- 内部人员可能恶意攻击
- 如果将来暴露到公网，风险很大

### 6.5 理论优化方案（仅供参考）

**方案1：登录失败次数限制**
```java
// Redis 记录失败次数
String key = "login:fail:" + username;
Long count = redisTemplate.opsForValue().increment(key);

if (count >= 5) {
    throw new BizException("登录失败次数过多，请1小时后再试");
}

// 成功登录后清除
redisTemplate.delete(key);
```

**方案2：验证码**
```java
// 登录前先获取验证码
@PostMapping("/captcha")
public R<String> getCaptcha() {
    // 生成验证码，存入 Redis
    return R.ok(captchaImage);
}

@PostMapping("/login")
public R<LoginTokenVO> login(@RequestBody LoginDTO dto) {
    // 验证验证码
    if (!validateCaptcha(dto.getCaptcha())) {
        throw new BizException("验证码错误");
    }
    // ...
}
```

**方案3：IP 限流**
```java
// 限制单个 IP 的请求频率
@RateLimit(value = 5, key = "#request.remoteAddr")
@PostMapping("/login")
public R<LoginTokenVO> login(HttpServletRequest request, @RequestBody LoginDTO dto) {
    // ...
}
```

---

## 七、常见面试题

### Q1: excludeUrls 配置错误会有什么风险？

**A**:
- 如果把需要权限的接口放进了白名单
- 外部调用将不再被拦截
- 用户信息可能泄露
- 服务器容易遭受攻击

### Q2: 动态更新权限后，已登录用户需要重新登录吗？

**A**:
- 不需要重新登录
- `updateUserTokenRoleAndPermissionByLoginId` 直接修改 Session 中的 UserToken
- UserToken 存在 Redis 中，修改后下次请求立即生效
- 如果有多台服务器，通过 Redis 同步

### Q3: 登录接口的防刷在哪里？

**A**:
- 当前项目在应用层**没有实现防刷机制**
- 可能依赖网络层的防护（Nginx/网关）

---

## 八、总结

### 核心认知

| 要点 | 理解 |
|------|------|
| **拦截器配置** | SaInterceptor 拦截所有请求，白名单排除 |
| **权限获取** | 从 UserContext 获取（Session 中），不是实时查询数据库 |
| **动态更新权限** | 修改 Session 中的 UserToken，立即生效 |
| **白名单风险** | 配置错误会导致敏感接口暴露 |
| **登录防刷** | 当前项目没有实现（依赖网络层） |

### 代码位置

| 功能 | 位置 |
|------|------|
| SaToken 配置 | `core/auth/SaTokenConfigure.java` |
| 权限接口实现 | `core/auth/StpInterfaceImpl.java` |
| 用户上下文 | `core/auth/UserContext.java` |
| 白名单配置 | `core/auth/AuthConfig.java` |
| 用户信息 DTO | `core/domain/dto/UserToken.java` |
| 登录接口 | `system/controller/AuthController.java` |
