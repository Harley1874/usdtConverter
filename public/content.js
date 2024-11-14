const getC2CList = async () => {
  const params = { fiat: 'CNY', page: 1, rows: 10, tradeType: 'SELL', asset: 'USDT', countries: [], proMerchantAds: false, shieldMerchantAds: true, filterType: 'all', periods: [], additionalKycVerifyFilter: 0, publisherType: null, payTypes: ['ALIPAY'], classifies: ['mass', 'profession', 'fiat_trade'] };
  const res = await fetch('https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search', {
    method: 'POST',
    body: JSON.stringify(params),
  });
  return res.json();
}

// 创建按钮元素
const button = document.createElement('button');
button.textContent = '显示内容';
button.id = 'persistent-button';

// 添加按钮到页面
document.body.appendChild(button);

// 添加点击事件监听器
button.addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'openPopup' });
});
