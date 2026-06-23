# DEBUG 记录：iOS Safari 输入框自动缩放

## 日期

2026-06-23

## 问题描述

iPhone 浏览器打开应用后，主页面和设置页面可以双指缩放，但**添加/修改出入境记录的弹窗一旦点击输入框，页面自动放大；关闭键盘后无法自动缩小还原**，导致界面变形，需要手动双指缩小。

## 影响范围

- 所有 `<input>` 和 `<textarea>` 元素
- 仅 iOS Safari（含 Safari WebView、Chrome iOS 也受影响，因为 iOS 所有浏览器底层都是 WebKit）

## 根本原因

iOS Safari 有一个内置行为：**当点击的输入框 `font-size` 小于 16px 时，自动放大页面**以便用户看清输入内容。这是 Apple 的设计决策，目的是提升可用性。

但问题是：**它只放大不还原**。用户关掉键盘后，页面保持在放大状态，不会自动归位。

触发条件：

```
输入框 font-size < 16px
  ↓
iOS 自动 zoom-in
  ↓
用户关闭键盘
  ↓
页面不还原 → 用户困惑
```

## 排查过程

1. 检查页面是否设置了 `user-scalable=no`（index.html 的 meta viewport） → 没有，Apple 从 iOS 10 起**忽略此属性**
2. 检查备注 textarea → `font-size: 14px`，明确低于 16px 阈值 ← **确认元凶**
3. 检查设置页 input → 未设置 fontSize，使用系统默认（通常 13-14px）← **次要元凶**

## 解决方案

### 修复 1：全局 CSS 规则（根本修复）

在 `src/index.css` 中新增：

```css
/* 防止 iOS 聚焦输入框时自动缩放（font-size < 16px 会触发） */
input, textarea {
  font-size: 16px !important;
}
```

`!important` 确保覆盖 antd-mobile 组件库和行内样式中的任何默认值。

### 修复 2：行内样式兜底

在 `src/App.jsx` 中，所有已设 fontSize 的 input/textarea 统一改为 16px：

- 备注 textarea：`14px` → `16px`
- 设置页阈值 input：无 fontSize → `16px`
- 设置页名称 input：无 fontSize → `16px`
- 设置页 emoji input：无 fontSize → `16px`
- 设置页天数 input：无 fontSize → `16px`

## 知识要点

| 要点 | 说明 |
|------|------|
| iOS 缩放阈值 | **16px**，低于此值 iOS 自动放大 |
| `user-scalable=no` | iOS 10+ 已忽略，不可靠 |
| 替代 old 方案 | 用 CSS `transform: scale()` 缩小视觉尺寸，但保留 16px 让 iOS 不触发 |
| 影响浏览器 | Safari iOS、Safari WebView、Chrome iOS、所有 iOS 浏览器 |

## 相关参考

- Apple 官方文档：iOS Safari 输入缩放行为
- Stack Overflow: "iPhone Safari zoom on input" — 海量相同问题帖子，答案一致：font-size >= 16px

## 文件改动

| 文件 | 行 | 改动 |
|------|----|------|
| `src/index.css` | 107-109 | 新增全局 `input, textarea { font-size: 16px !important; }` |
| `src/App.jsx` | 415 | textarea fontSize 14 → 16 |
| `src/App.jsx` | 457, 471, 475 | input 加 fontSize: 16px |
