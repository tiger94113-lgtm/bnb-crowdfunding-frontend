// 配置信息
const CONFIG = {
    RECIPIENT_ADDRESS: '0x1234567890123456789012345678901234567890', // 多签钱包地址
    MAX_PARTICIPANTS: 1000,
    MIN_AMOUNT: 0.5,
    MAX_AMOUNT: 1,
    NETWORK_ID: 56, // BSC主网
    RPC_URL: 'https://bsc-dataseed.binance.org/'
};

// 全局变量
let web3 = null;
let currentAccount = null;
let isConnected = false;

// DOM元素
const elements = {
    connectWalletBtn: document.getElementById('connect-wallet'),
    walletStatus: document.getElementById('wallet-status'),
    participationSection: document.querySelector('.participation-section'),
    bnbAmountInput: document.getElementById('bnb-amount'),
    participateBtn: document.getElementById('participate-btn'),
    transactionConfirmSection: document.querySelector('.transaction-confirm'),
    recipientAddress: document.getElementById('recipient-address'),
    transactionAmount: document.getElementById('transaction-amount'),
    addressQr: document.getElementById('address-qr'),
    cancelTransactionBtn: document.getElementById('cancel-transaction'),
    confirmTransactionBtn: document.getElementById('confirm-transaction'),
    transactionStatusSection: document.querySelector('.transaction-status'),
    statusMessage: document.getElementById('status-message'),
    transactionHash: document.getElementById('transaction-hash'),
    checkStatusBtn: document.getElementById('check-status'),
    targetAmount: document.getElementById('target-amount'),
    raisedAmount: document.getElementById('raised-amount'),
    remainingSlots: document.getElementById('remaining-slots'),
    participantCount: document.getElementById('participant-count')
};

// 初始化
function init() {
    // 设置收款地址
    elements.recipientAddress.textContent = CONFIG.RECIPIENT_ADDRESS;
    // 生成二维码
    generateQRCode();
    // 事件监听
    setupEventListeners();
    // 检查是否已连接钱包
    checkWalletConnection();
}

// 生成收款地址二维码
function generateQRCode() {
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${CONFIG.RECIPIENT_ADDRESS}`;
    elements.addressQr.src = qrCodeUrl;
}

// 设置事件监听
function setupEventListeners() {
    // 连接钱包按钮
    elements.connectWalletBtn.addEventListener('click', connectWallet);
    
    // 预设金额按钮
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            elements.bnbAmountInput.value = btn.dataset.amount;
        });
    });
    
    // 参与众筹按钮
    elements.participateBtn.addEventListener('click', () => {
        const amount = parseFloat(elements.bnbAmountInput.value);
        if (validateAmount(amount)) {
            showTransactionConfirm(amount);
        }
    });
    
    // 取消交易按钮
    elements.cancelTransactionBtn.addEventListener('click', hideTransactionConfirm);
    
    // 确认交易按钮
    elements.confirmTransactionBtn.addEventListener('click', confirmTransaction);
    
    // 查询状态按钮
    elements.checkStatusBtn.addEventListener('click', checkTransactionStatus);
}

// 检查钱包连接状态
async function checkWalletConnection() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                currentAccount = accounts[0];
                isConnected = true;
                updateWalletStatus();
                showParticipationSection();
            }
        } catch (error) {
            console.error('检查钱包连接失败:', error);
        }
    }
}

// 连接钱包
async function connectWallet() {
    if (!window.ethereum) {
        showError('请安装MetaMask或其他Web3钱包');
        return;
    }

    try {
        // 请求连接
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        currentAccount = accounts[0];
        isConnected = true;
        
        // 初始化Web3
        web3 = new Web3(window.ethereum);
        
        // 检查网络
        const networkId = await web3.eth.net.getId();
        if (networkId !== CONFIG.NETWORK_ID) {
            showError('请切换到BSC主网');
            return;
        }
        
        // 检查地址是否已参与
        if (await hasParticipated(currentAccount)) {
            showError('该地址已参与众筹');
            return;
        }
        
        // 检查参与人数限制
        if (await checkParticipantLimit()) {
            showError('众筹名额已满');
            return;
        }
        
        updateWalletStatus();
        showParticipationSection();
    } catch (error) {
        console.error('连接钱包失败:', error);
        showError('连接钱包失败，请重试');
    }
}

// 更新钱包状态
function updateWalletStatus() {
    elements.walletStatus.textContent = `已连接: ${currentAccount.substring(0, 6)}...${currentAccount.substring(38)}`;
    elements.walletStatus.style.backgroundColor = '#d4edda';
    elements.walletStatus.style.color = '#155724';
}

// 显示参与部分
function showParticipationSection() {
    elements.participationSection.style.display = 'block';
}

// 验证金额
function validateAmount(amount) {
    if (isNaN(amount)) {
        showError('请输入有效的金额');
        return false;
    }
    if (amount < CONFIG.MIN_AMOUNT || amount > CONFIG.MAX_AMOUNT) {
        showError(`金额必须在 ${CONFIG.MIN_AMOUNT} - ${CONFIG.MAX_AMOUNT} BNB 之间`);
        return false;
    }
    return true;
}

// 显示交易确认
function showTransactionConfirm(amount) {
    elements.transactionAmount.textContent = `${amount} BNB`;
    elements.transactionConfirmSection.style.display = 'block';
}

// 隐藏交易确认
function hideTransactionConfirm() {
    elements.transactionConfirmSection.style.display = 'none';
}

// 确认交易
async function confirmTransaction() {
    if (!web3 || !currentAccount) {
        showError('请先连接钱包');
        return;
    }

    const amount = parseFloat(elements.bnbAmountInput.value);
    const amountInWei = web3.utils.toWei(amount.toString(), 'ether');

    try {
        // 构建交易参数
        const txParams = {
            from: currentAccount,
            to: CONFIG.RECIPIENT_ADDRESS,
            value: amountInWei,
            gas: '21000',
            gasPrice: await web3.eth.getGasPrice()
        };

        // 发送交易
        const txHash = await web3.eth.sendTransaction(txParams);
        
        // 记录参与信息
        recordParticipation(currentAccount);
        
        // 显示交易状态
        showTransactionStatus(txHash.transactionHash, 'pending');
    } catch (error) {
        console.error('交易失败:', error);
        showError('交易失败，请重试');
    }
}

// 显示交易状态
function showTransactionStatus(txHash, status) {
    elements.transactionStatusSection.style.display = 'block';
    elements.transactionHash.textContent = `交易哈希: ${txHash}`;
    
    updateStatusMessage(status);
}

// 更新状态消息
function updateStatusMessage(status) {
    elements.statusMessage.className = status;
    
    switch (status) {
        case 'pending':
            elements.statusMessage.textContent = '交易正在处理中，请耐心等待...';
            break;
        case 'success':
            elements.statusMessage.textContent = '交易成功！感谢您的参与';
            break;
        case 'error':
            elements.statusMessage.textContent = '交易失败，请重试';
            break;
    }
}

// 检查交易状态
async function checkTransactionStatus() {
    const txHash = elements.transactionHash.textContent.replace('交易哈希: ', '');
    if (!txHash) return;

    try {
        const receipt = await web3.eth.getTransactionReceipt(txHash);
        if (receipt) {
            if (receipt.status) {
                updateStatusMessage('success');
            } else {
                updateStatusMessage('error');
            }
        } else {
            updateStatusMessage('pending');
        }
    } catch (error) {
        console.error('查询交易状态失败:', error);
        showError('查询交易状态失败');
    }
}

// 检查地址是否已参与
async function hasParticipated(address) {
    // 从本地存储检查
    const participants = JSON.parse(localStorage.getItem('crowdfunding_participants') || '[]');
    if (participants.includes(address)) {
        return true;
    }
    
    // 这里可以添加链上验证逻辑，例如通过智能合约事件查询
    // 暂时返回false
    return false;
}

// 记录参与信息
function recordParticipation(address) {
    const participants = JSON.parse(localStorage.getItem('crowdfunding_participants') || '[]');
    if (!participants.includes(address)) {
        participants.push(address);
        localStorage.setItem('crowdfunding_participants', JSON.stringify(participants));
    }
}

// 检查参与人数限制
async function checkParticipantLimit() {
    // 从本地存储检查
    const participants = JSON.parse(localStorage.getItem('crowdfunding_participants') || '[]');
    if (participants.length >= CONFIG.MAX_PARTICIPANTS) {
        return true;
    }
    
    // 这里可以添加链上验证逻辑，例如通过智能合约查询总参与人数
    // 暂时返回false
    return false;
}

// 显示错误信息
function showError(message) {
    alert(message);
}

// 初始化应用
init();