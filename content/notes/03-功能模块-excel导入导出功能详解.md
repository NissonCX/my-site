---
title: "Excel导入导出功能详解"
slug: "03-功能模块-excel导入导出功能详解"
summary: "项目使用 EasyExcel（com.alibaba.excel）实现Excel导入导出功能。"
date: "2026-03-11"
tags:
  - "实习经历"
  - "功能模块"
source: "03-功能模块/Excel导入导出功能详解.md"
---
## 一、技术栈

项目使用 **EasyExcel**（`com.alibaba.excel`）实现Excel导入导出功能。

### 1.1 依赖冲突问题（重要）

**历史背景**：项目曾经同时引入 `fastexcel` 和 `easyexcel` 两个库，导致严重的依赖冲突。

```
easyexcel 3.3.4
    └── poi-ooxml-schemas 4.1.2
        └── xmlbeans 3.1.0  ← 缺少 Factory 字段

fastexcel 1.3.0
    └── poi-ooxml 5.4.1
        └── xmlbeans 5.3.0  ← 有 Factory 字段
```

**冲突现象**：调用导出接口时报错 `NoSuchFieldError: Factory`

**解决方案**：Mentor 在 `pom.xml` 中注释掉 `fastexcel` 依赖，统一使用 `easyexcel`：

```xml
<!--        <dependency>-->
<!--            <groupId>cn.idev.excel</groupId>-->
<!--            <artifactId>fastexcel</artifactId>-->
<!--            <version>${fastexcel.version}</version>-->
<!--        </dependency>-->
```

**提交记录**：`aa8cb23 fix excel修改` (2026-03-05)

---

## 二、Mentor 导入功能实现思路

### 2.1 设计理念

Mentor 的导入实现非常优雅，核心思路：

1. **分离关注点**：ReaderDTO只负责读取，Listener只负责收集，Service负责业务逻辑
2. **一次性校验**：先查出所有已存在数据，避免N+1查询
3. **双重去重**：同时校验数据库重复和Excel内重复
4. **友好错误提示**：收集所有错误后统一抛出，告诉用户具体哪行什么问题

### 2.2 校验逻辑详解

```java
// 1. 一次性查询已存在数据（性能优化）
List<SysPost> existingPosts = baseMapper.selectList(
    new LambdaQueryWrapper<SysPost>()
        .eq(SysPost::getDeptId, dto.getDeptId())
        .select(SysPost::getPostCode, SysPost::getPostName)
);

// 2. 转为Set方便快速查找
Set<String> existingPostCodes = existingPosts.stream()
        .map(SysPost::getPostCode)
        .filter(Objects::nonNull)
        .collect(Collectors.toSet());

// 3. Excel内重复校验用临时Set
Set<String> excelPostCodes = new HashSet<>();

// 4. 遍历校验
for (int i = 0; i < list.size(); i++) {
    // 数据库重复校验
    if (existingPostCodes.contains(bo.getPostCode())) {
        rowErrors.add("编码已存在");
    }
    // Excel内重复校验（Set.add()返回false表示已存在）
    else if (!excelPostCodes.add(bo.getPostCode())) {
        rowErrors.add("Excel内编码重复");
    }

    // 校验通过后插入，并更新Set（防止后续行重复）
    if (rowErrors.isEmpty()) {
        insertPost(bo);
        existingPostCodes.add(bo.getPostCode());
    }
}
```

### 2.3 为什么这样设计？

| 设计点 | 好处 |
|-------|------|
| 一次性查询已存在数据 | 避免循环查数据库，性能O(1)查找 |
| 使用Set集合 | `contains()` 和 `add()` 都是O(1)时间复杂度 |
| 收集所有错误后统一抛出 | 用户可以一次性看到所有问题，不用反复修改 |
| 插入后更新Set | 防止Excel内后面的行与前面行重复 |

---

## 三、核心注解

| 注解 | 包名 | 作用 |
|-----|------|------|
| `@ExcelProperty` | `com.alibaba.excel.annotation` | 指定Excel列名 |
| `@ExcelIgnore` | `com.alibaba.excel.annotation` | 忽略该字段（不导出） |

---

## 三、导出功能

### 3.1 Vo类注解配置

```java
import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;

@Data
public class SysUseUnitVo {

    @ExcelIgnore  // 不导出
    private String id;

    @ExcelProperty(value = "单位名称")
    private String unitName;

    @ExcelProperty(value = "单位编码")
    private String unitCode;

    @ExcelProperty(value = "状态")
    private String status;

    @ExcelIgnore  // 不导出
    private LocalDateTime createTime;
}
```

### 3.2 Service层导出实现

```java
import com.alibaba.excel.EasyExcel;
import com.alibaba.excel.util.FileUtils;
import cn.cqchain.mp.util.ExcelExportUtil;

@Override
public void exportUseUnit(SysUseUnitBo bo, HttpServletResponse response) {
    // 1. 查询数据
    List<SysUseUnitVo> list = selectUseUnitList(bo);

    // 2. 创建临时文件
    File file = FileUtils.createTmpFile("使用单位.xlsx");

    // 3. 写入Excel
    EasyExcel.write(file, SysUseUnitVo.class)
            .sheet()
            .doWrite(list);

    // 4. 下载文件
    ExcelExportUtil.setDownLoad(file, response);
}
```

### 3.3 Controller层

```java
@PostMapping("/export")
@Operation(summary = "导出使用单位")
public void export(SysUseUnitBo bo, HttpServletResponse response) {
    useUnitService.exportUseUnit(bo, response);
}
```

---

## 四、导入功能

### 4.1 创建ReaderDTO

ReaderDTO 是用于读取Excel的简单DTO类，**不需要添加 `@ExcelProperty` 注解**，字段名与Excel列名自动匹配。

```java
@Data
public class SysUseUnitReaderDTO {

    private String unitName;

    private String unitCode;

    private String contactPerson;

    private String contactPhone;

    private String address;

    private String status;

    private String remark;
}
```

**字段匹配规则**：Excel列名会自动转换为驼峰命名匹配字段。

| Excel列名 | 字段名 |
|----------|--------|
| 单位名称 | unitName |
| 单位编码 | unitCode |
| 联系人 | contactPerson |

### 4.2 创建ReaderListener

```java
import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.read.listener.ReadListener;

@Slf4j
public class UseUnitReaderListener implements ReadListener<SysUseUnitReaderDTO> {

    private final List<SysUseUnitReaderDTO> list = new ArrayList<>();

    @Override
    public void invoke(SysUseUnitReaderDTO dto, AnalysisContext context) {
        list.add(dto);
    }

    @Override
    public void doAfterAllAnalysed(AnalysisContext context) {
        log.info("Excel解析完成，有效数据:{} 条", list.size());
    }

    public List<SysUseUnitReaderDTO> getList() {
        return list;
    }
}
```

### 4.3 Service层导入实现

```java
@Override
@Transactional(rollbackFor = Exception.class)
public void importUseUnit(MultipartFile file) {
    // 1. 读取Excel
    UseUnitReaderListener listener = new UseUnitReaderListener();
    try (InputStream inputStream = file.getInputStream()) {
        EasyExcel.read(inputStream, SysUseUnitReaderDTO.class, listener)
                .sheet()
                .doRead();
    } catch (Exception e) {
        throw new BizException("Excel解析失败：" + e.getMessage());
    }

    // 2. 获取数据
    List<SysUseUnitReaderDTO> list = listener.getList();
    if (CollectionUtils.isEmpty(list)) {
        throw new BizException("导入数据不能为空");
    }

    // 3. 查询已存在的数据（用于重复校验）
    List<SysUseUnit> existingUnits = baseMapper.selectList(
        new LambdaQueryWrapper<SysUseUnit>()
            .select(SysUseUnit::getUnitCode, SysUseUnit::getUnitName)
    );

    Set<String> existingCodes = existingUnits.stream()
            .map(SysUseUnit::getUnitCode)
            .filter(Objects::nonNull)
            .collect(Collectors.toSet());

    Set<String> existingNames = existingUnits.stream()
            .map(SysUseUnit::getUnitName)
            .filter(Objects::nonNull)
            .collect(Collectors.toSet());

    // 4. 校验用临时集合
    Set<String> excelCodes = new HashSet<>();
    Set<String> excelNames = new HashSet<>();
    List<String> errorMsgList = new ArrayList<>();

    // 5. 遍历处理
    for (int i = 0; i < list.size(); i++) {
        SysUseUnitReaderDTO dto = list.get(i);
        int rowNum = i + 2;  // Excel行号（从第2行开始，第1行是表头）

        List<String> rowErrors = new ArrayList<>();

        // 校验单位名称
        if (StringUtils.isBlank(dto.getUnitName())) {
            rowErrors.add("单位名称不能为空");
        } else if (existingNames.contains(dto.getUnitName())) {
            rowErrors.add("单位名称已存在");
        } else if (!excelNames.add(dto.getUnitName())) {
            rowErrors.add("Excel内单位名称重复");
        }

        // 校验单位编码
        if (StringUtils.isBlank(dto.getUnitCode())) {
            rowErrors.add("单位编码不能为空");
        } else if (existingCodes.contains(dto.getUnitCode())) {
            rowErrors.add("单位编码已存在");
        } else if (!excelCodes.add(dto.getUnitCode())) {
            rowErrors.add("Excel内单位编码重复");
        }

        // 如果有错误，记录
        if (!rowErrors.isEmpty()) {
            errorMsgList.add(String.format("第%d行【%s】：%s",
                    rowNum, dto.getUnitName(), String.join("; ", rowErrors)));
        } else {
            // 插入数据
            SysUseUnit entity = new SysUseUnit();
            entity.setUnitName(dto.getUnitName());
            entity.setUnitCode(dto.getUnitCode());
            // ... 设置其他字段
            save(entity);

            // 添加到已存在集合（防止后续行重复）
            existingCodes.add(dto.getUnitCode());
            existingNames.add(dto.getUnitName());
        }
    }

    // 6. 统一抛出错误
    if (!errorMsgList.isEmpty()) {
        throw new BizException("导入失败：" + String.join("", errorMsgList));
    }
}
```

### 4.4 Controller层

```java
@PostMapping(value = "/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
@Operation(summary = "导入使用单位")
public R<Void> importExcel(@RequestPart("file") MultipartFile file) {
    useUnitService.importUseUnit(file);
    return R.ok();
}
```

---

## 五、文件结构规范

```
app/
├── domain/
│   ├── dto/
│   │   ├── SysUseUnitBo.java        # 业务对象（增删改查入参）
│   │   └── SysUseUnitReaderDTO.java # 导入读取DTO
│   └── vo/
│       └── SysUseUnitVo.java        # 视图对象（查询出参、导出）
├── listener/
│   └── UseUnitReaderListener.java   # 导入监听器
├── service/
│   ├── ISysUseUnitService.java
│   └── impl/
│       └── SysUseUnitServiceImpl.java
└── controller/
    └── SysUseUnitController.java
```

---

## 六、完整流程图

### 导出流程

```
Controller.export(bo, response)
        ↓
Service.exportUseUnit(bo, response)
        ↓
selectUseUnitList(bo) → List<Vo>
        ↓
FileUtils.createTmpFile("xxx.xlsx")
        ↓
EasyExcel.write(file, Vo.class).sheet().doWrite(list)
        ↓
ExcelExportUtil.setDownLoad(file, response)
        ↓
浏览器下载文件
```

### 导入流程

```
Controller.importExcel(file)
        ↓
Service.importUseUnit(file)
        ↓
EasyExcel.read(inputStream, ReaderDTO.class, listener).sheet().doRead()
        ↓
Listener.invoke() → 收集数据
        ↓
校验：空值、数据库重复、Excel内重复
        ↓
save(entity) 逐条插入
        ↓
返回 R.ok()
```

---

## 七、常见问题

### 7.1 NoSuchFieldError: Factory

**原因**：`fastexcel` 和 `easyexcel` 的 POI 版本冲突

**解决**：确保 `pom.xml` 中 `fastexcel` 已被注释，只使用 `easyexcel`

### 7.2 找不到 @ExcelProperty 注解

**原因**：导入了错误的包

**解决**：使用 `com.alibaba.excel.annotation.ExcelProperty`，不是 `cn.idev.excel.annotation`

### 7.3 导入时字段匹配不上

**原因**：Excel列名与DTO字段名不匹配

**解决**：
- Excel列名会自动转换为驼峰
- 或者在 ReaderDTO 中使用 `@ExcelProperty(value = "列名")` 指定

---

## 八、状态值转换处理

### 8.1 问题描述

数据库中 `status` 等字段定义为 `VARCHAR(1)`，只能存储单个字符（如 `0` 或 `1`），但用户在Excel中可能填入：
- `正常`、`停用`
- `0正常`、`1停用`
- 或其他描述性文字

直接保存会导致数据库报错：`对于可变字符类型来说，值太长了(1)`

### 8.2 解决方案

在 Service 层添加状态值转换方法：

```java
/**
 * 状态值转换
 * 支持：0/1、正常/停用、0正常/1停用 等格式
 */
private String convertStatus(String status) {
    if (StringUtils.isBlank(status)) {
        return "0";
    }
    status = status.trim();
    if ("0".equals(status) || status.startsWith("0") || "正常".equals(status)) {
        return "0";
    }
    if ("1".equals(status) || status.startsWith("1") || "停用".equals(status)) {
        return "1";
    }
    return "0";
}
```

### 8.3 转换规则

| Excel中的值 | 转换结果 |
|------------|---------|
| `0`、`0正常`、`正常` | `0` |
| `1`、`1停用`、`停用` | `1` |
| 空或其他值 | `0`（默认） |

### 8.4 使用示例

```java
entity.setStatus(convertStatus(dto.getStatus()));
entity.setAdminStatus(convertStatus(dto.getAdminStatus()));
```

---

## 九、参考代码位置

| 功能 | 位置 |
|------|------|
| 岗位导出 | `app/service/impl/SysPostServiceImpl.java:206-213` |
| 岗位导入 | `app/service/impl/SysPostServiceImpl.java:215-296` |
| 导出工具 | `cn.cqchain.mp.util.ExcelExportUtil` |
| 导入监听器 | `app/listener/PostReaderListener.java` |
| 导入DTO | `app/domain/dto/SysPostReaderDTO.java` |

---

## 十、Git提交记录

### 10.1 Excel依赖冲突修复

**提交**：`aa8cb23 fix excel修改` (2026-03-05 13:38)

**修改内容**：
- 注释掉 `fastexcel` 依赖，解决POI版本冲突
- 修改 `ExcelUtil.java`，统一使用 `easyexcel`
- 修改所有Vo类的注解包名

### 10.2 岗位导入功能完善

**提交**：`df2f609 fix 岗位` (2026-03-05 16:39)

**修改内容**：
- 完善 `PostReaderListener`，添加 `getList()` 方法
- 实现 `importExcel()` 完整导入逻辑
- 添加数据库重复校验和Excel内重复校验

---

## 十二、Git工作流程

### 12.1 分支说明

| 分支 | 用途 | 说明 |
|------|------|------|
| `v3.2.0` | 开发分支 | 日常开发在此分支进行 |
| `dev` | 测试环境 | 合并后自动部署到测试环境 |
| `master` | 生产环境 | 正式发布版本 |

### 12.2 开发到测试流程

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   开发分支    │     │   测试分支    │     │   生产分支    │
│   v3.2.0    │ ──► │     dev     │ ──► │   master    │
│             │     │             │     │             │
│  日常开发    │     │  测试验证    │     │  正式发布    │
└─────────────┘     └─────────────┘     └─────────────┘
```

### 12.3 常用命令

**开发阶段**：
```bash
# 查看状态
git status

# 添加文件
git add <files>

# 提交
git commit -m "feat 功能描述"

# 推送到开发分支
git push origin v3.2.0
```

**合并到测试环境**：
```bash
# 1. 切换到测试分支
git checkout dev

# 2. 拉取最新代码
git pull origin dev

# 3. 合并开发分支
git merge v3.2.0

# 4. 推送测试分支
git push origin dev

# 5. 切回开发分支继续开发
git checkout v3.2.0
```

### 12.4 Commit规范

参考Mentor的提交风格：

| 前缀 | 用途 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat 使用单位管理模块` |
| `fix` | 修复bug | `fix 岗位导入校验问题` |
| `refactor` | 重构 | `refactor 优化Excel导出逻辑` |

### 12.5 用户配置

```bash
# 配置全局用户信息
git config --global user.name "caoxu"
git config --global user.email "caoxu@hyperchain.cn"
```

### Mentor的代码风格要点

1. **接口简洁**：删除接口从 `@PathVariable` 改为普通参数，更易用
2. **分离关注点**：ReaderDTO、Listener、Service各司其职
3. **性能优化**：一次性查询已存在数据，用Set快速查找
4. **用户体验**：收集所有错误后统一提示，不用反复修改
5. **代码健壮**：插入后更新Set，防止后续行重复
