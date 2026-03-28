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
- 防XSS和CSRF防护
- 交易确认机制

## 部署方式
1. 克隆仓库：`git clone https://github.com/tiger94113-lgtm/bnb-crowdfunding-frontend.git`
2. 进入项目目录：`cd bnb-crowdfunding-frontend`
3. 打开 `index.html` 文件即可运行
4. 通过GitHub Pages部署：
   - 进入仓库设置
   - 找到GitHub Pages选项
   - 选择main分支作为源
   - 点击保存，等待部署完成

## 使用方法
1. 打开部署后的页面
2. 点击"连接钱包"按钮，选择您的钱包（如MetaMask、Trust Wallet等）
3. 确保您的钱包已切换到BSC主网
4. 输入您要参与的金额（0.5-1 BNB），或选择预设金额
5. 点击"参与众筹"按钮
6. 仔细核对交易信息，包括收款地址和金额
7. 点击"确认交易"按钮，完成交易
8. 等待交易确认，可通过"查询状态"按钮查看交易进展

## 安全注意事项
- 请确保连接的是您本人的钱包
- 验证收款地址是否正确（应为多签钱包地址）
- 确认交易金额在0.5-1 BNB范围内
- 每个钱包地址只能参与一次
- 如遇异常，请停止操作并联系客服
- 请勿在公共网络或不安全的设备上操作
- 定期更新您的钱包软件
- 确保您的私钥安全，不要向任何人泄露

## 技术架构
- **前端框架**：纯HTML5 + CSS3 + JavaScript
- **区块链交互**：Web3.js
- **响应式设计**：CSS Grid + Flexbox
- **安全措施**：
  - 输入验证和净化
  - CSRF防护
  - 交易确认机制
  - 地址验证

## 项目结构
```
├── index.html          # 主页面
├── styles.css          # 样式文件
├── script.js           # 核心逻辑
└── README.md           # 项目说明
```

## 配置信息
在 `script.js` 文件中，您可以修改以下配置：
- `RECIPIENT_ADDRESS`：收款地址（多签钱包）
- `MAX_PARTICIPANTS`：最大参与人数
- `MIN_AMOUNT`：最小参与金额
- `MAX_AMOUNT`：最大参与金额
- `NETWORK_ID`：网络ID（BSC主网为56）
- `RPC_URL`：RPC节点URL

## 浏览器兼容性
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 贡献
欢迎提交Issue和Pull Request来改进这个项目。

## 许可证
MIT License