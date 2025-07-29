# 🗓️ 大小周休息日助手 (uTools版)

[![uTools](https://img.shields.io/badge/uTools-Plugin-blue)](https://u.tools/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

一个专为职场人士设计的 uTools 插件，帮助您轻松管理和查看大小周休息日安排。无论您的公司采用何种大小周制度，这个插件都能帮您清晰地了解每周的休息安排。

## ✨ 功能特性

- 📅 **智能日历显示** - 清晰标注单休周和双休周
- 🔄 **自定义配置** - 支持设置任意起始日期的大小周循环  
- 🌙 **农历显示** - 同时显示公历和农历日期
- 💾 **数据持久化** - 设置自动保存到 uTools 本地数据库
- 🎨 **美观界面** - 现代化设计，操作简单直观
- ⌨️ **快捷键支持** - 方便的键盘操作
- 📤 **配置导入导出** - 支持配置备份和恢复
- 🚀 **快速呼出** - 通过关键词快速打开

## 🚀 安装方法

### 方式一：从 uTools 应用市场安装（推荐）
1. 打开 uTools（`Alt + Space`）
2. 搜索"大小周"或"休息日助手"
3. 点击安装即可

### 方式二：开发者模式安装
1. **下载插件**
   ```bash
   git clone git@github.com:tommyrunner/alternatingWeekends-uTools.git
   cd alternatingWeekends-utools
   ```

2. **安装到 uTools**
   - 打开 uTools 设置
   - 进入"插件应用"页面
   - 点击"安装本地插件"
   - 选择插件文件夹

## 📖 使用说明

### 快速启动
- 🔍 **呼出插件**：`Alt + Space` 后输入"大小周"、"休息日"、"工作日"或"日历"
- ⚡ **快捷启动**：设置为常用插件后直接 `Alt + Space` 即可

### 首次配置
1. **设置基准日期**
   - 点击⚙️"配置设置"展开设置面板
   - 在日期输入框中选择您公司第一个单休周的周一日期
   - 点击"保存设置"完成配置

### 界面说明
- **🧡 橙色**：单休周的休息日（仅周日休息）
- **💚 绿色**：双休周的休息日（周六日休息）  
- **🔵 蓝色**：今天
- **📅 日历导航**：使用左右箭头或键盘方向键切换月份
- **🌙 农历显示**：点击任意日期查看对应农历信息

### 快捷键操作
- `←/→`：切换上/下个月
- `Home`：回到今天
- `Esc`：关闭插件窗口

### 配置管理
- **📤 导出配置**：将当前设置导出为JSON文件
- **📥 导入配置**：从JSON文件导入设置
- **🔄 重置设置**：恢复为默认配置

## 🔧 配置示例

### 什么是大小周？
大小周是中国许多公司采用的工作制度：
- **单休周（小周）**：周一到周六工作，周日休息（6天工作制）
- **双休周（大周）**：周一到周五工作，周六日休息（5天工作制）

两种工作制度按周轮替，形成"大小周"工作模式。

### 如何确定起始日期？
1. 询问HR或查看公司制度文档
2. 找到最近一个单休周的周一日期
3. 在插件中设置该日期即可

例如：如果2024年12月16日（周一）是单休周的开始，那么：
- 2024.12.16-12.22：单休周（只有周日休息）
- 2024.12.23-12.29：双休周（周六日都休息）
- 2024.12.30-2025.01.05：单休周（只有周日休息）

## 🔄 数据管理

### 本地存储
- 所有配置数据存储在 uTools 本地数据库中
- 支持跨设备同步（如果 uTools 账户已登录）
- 数据安全可靠，不会丢失

### 备份策略
- 定期导出配置文件作为备份
- 重要设置变更后及时导出
- 可在不同设备间通过导入导出同步配置

## 🎯 技术特性

### 核心算法
- 基于周数差值计算大小周循环
- 精确的农历转换算法
- 高效的日历渲染引擎

### 性能优化
- 响应式界面设计
- 流畅的动画效果
- 内存占用优化

### 兼容性
- 支持 Windows、macOS、Linux
- 兼容 uTools 最新版本
- 现代浏览器内核支持

## ❓ 常见问题

**Q: 如何确定我公司的大小周起始日期？**  
A: 询问 HR 或查看公司制度，找到最近一个单休周的周一日期即可。

**Q: 农历显示不准确怎么办？**  
A: 插件使用简化算法，可能存在 1-2 天误差，仅供参考。精确农历请参考专业农历应用。

**Q: 设置保存失败怎么办？**  
A: 检查日期格式是否正确，重启 uTools 后重试，或使用导入导出功能恢复设置。

**Q: 能否支持其他工作制度？**  
A: 目前专注于标准大小周制度，如有特殊需求可以通过 GitHub Issues 反馈。

**Q: 插件无法打开怎么办？**  
A: 确保 uTools 版本为最新版，重启 uTools 或重新安装插件。

## 🔗 相关链接

- 🏠 **项目主页**：[GitHub Repository](https://github.com/tommyrunner/alternatingWeekends-utools)
- 🐛 **问题反馈**：[GitHub Issues](https://github.com/tommyrunner/alternatingWeekends-utools/issues)
- 💬 **功能建议**：[GitHub Discussions](https://github.com/tommyrunner/alternatingWeekends-utools/discussions)
- 📚 **uTools 官网**：[https://u.tools/](https://u.tools/)

## 📄 许可证

本项目采用 [MIT 许可证](https://opensource.org/licenses/MIT) - 查看 LICENSE 文件了解详情。

## 🙏 致谢

- 感谢 [uTools](https://u.tools/) 提供优秀的插件平台
- 感谢所有用户的反馈和建议
- 特别感谢测试用户的支持

## 📞 联系作者

- GitHub: [@tommyrunner](https://github.com/tommyrunner)
- 项目地址: [https://github.com/tommyrunner/alternatingWeekends-utools](https://github.com/tommyrunner/alternatingWeekends-utools)

---

如果这个插件对您有帮助，请给个 ⭐ Star 支持一下！

## 🔄 更新日志

### v1.0.0 (2024-12-XX)
- ✨ 首次发布
- 📅 完整的大小周日历功能
- 🌙 农历日期显示
- ⚙️ 配置管理系统
- 🎨 现代化用户界面
- ⌨️ 快捷键支持
- 📤 配置导入导出功能 