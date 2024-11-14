chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 点击按钮 打开插件
  if (request.action === 'openPopup') {
    chrome.action.openPopup();
  }
  // 返回当前页面
  if (request.action === 'returnCurrentPage') {
    console.log(`output->请求到页面了`);
    // 将活动tab的html实例返回
    chrome.tabs.sendMessage(sender.tab.id, { action: 'returnCurrentPage' });
  }
});

