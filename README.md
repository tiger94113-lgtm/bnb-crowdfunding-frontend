# BNB众筹静态前端页面

这是一个安全的BNB众筹静态前端页面，实现了以下功能：

## 核心功能
- 显示众筹活动信息，包括目标金额、已筹金额、剩余名额等
- 集成BNB钱包连接功能，支持主流钱包（MetaMask、Trust Wallet、TokenPocket等）
- 实现地址唯一性验证机制，确保每个钱包地址只能参与一次
- 设置固定众筹金额范围：0.5-1枚BNB
- 限制总参与人数为1000个独立地址

## 安全要求
- 纯静态前端实现，通过GitHub Pages部署
- 去中心化的地址验证机制
- 智能合约交互安全
- 交易前的金额验证和地址验证
- 防XSS和CSRF的前端安全措施
- 交易确认机制

## 技术实现
- 使用Web3.js库实现与区块链的交互
- 本地存储（localStorage）辅助验证
- 响应式设计，适配不同设备屏幕尺寸

## 部署方式
1. 克隆仓库：`git clone https://github.com/tiger94113-lgtm/bnb-crowdfunding-frontend.git`
2. 进入项目目录：`cd bnb-crowdfunding-frontend`
3. 打开 `index.html` 文件即可运行
4. 通过GitHub Pages部署：在仓库设置中开启GitHub Pages功能

## 安全注意事项
- 请确保连接的是您本人的钱包
- 验证收款地址是否正确
- 确认交易金额在0.5-1 BNB范围内
- 每个钱包地址只能参与一次
- 如遇异常，请停止操作并联系客服

## 贡献
欢迎提交Issue和Pull Request来改进这个项目。

## 许可证
MIT License