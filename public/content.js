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
