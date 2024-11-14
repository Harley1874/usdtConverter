<script setup lang="ts">
declare const chrome: any;
import { ref, onMounted, } from 'vue';
import { getC2CList } from '../api/c2c';

const handleRefreshRate = async () => {
  const res = await getC2CList();
  currentRate.value = res.data[0].adv.price;

  // 将计算出来的金额存进本地，带有当前时间戳
  const obj = {
    currentRate: currentRate.value,
    time: Date.now(),
  };
  localStorage.setItem('c2cList', JSON.stringify(obj));
};
// 当前汇率
const currentRate = ref(0);
// 输入金额
const amount = ref('');
// 加载页面时，如果本地有数据，则直接显示
onMounted(() => {
  const data = JSON.parse(localStorage.getItem('c2cList') || '{}');
  if (data) {
    // 计算当前时间，如果时间差大于30分钟，则重新获取汇率
    const time = Date.now();
    const diff = time - data.time;
    if (diff < 30 * 60 * 1000) {
      currentRate.value = data.currentRate;
      return;
    }
  }
  handleRefreshRate();
});

const handleConvert = () => {
  modifyPageWithParams(currentRate.value)
};

const modifyPageWithParams = async (rate:number) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // 准备要传递的参数
  const params = {
    currentRate:rate
  };

  chrome.scripting.executeScript({
    target: { tabId: tab.id! },
    args: [params], // 传递参数
    function: (params:any) => {
      // 使用传入的参数修改页面
      const elements: HTMLElement[] = Array.from(document.querySelectorAll('.target'));
      elements.forEach(el => {
        el.style.color = params.color;
        el.textContent = params.text;
      });

      function modifyContent() {
        console.log(`output->开始转换`,params.currentRate)
        // 查找页面中所有class为amount，且innerText中第一个文字是 $ 符号的元素
        const amountElements: HTMLDivElement[] = Array.from(document.querySelectorAll('.amount'));
        const result = amountElements.filter(item => item.innerText.startsWith('$'))
        console.log(`output-> 查找到的元素`,result)
        result.forEach(item => {
          const newElement: HTMLDivElement = document.createElement('div');
          // 元素的金额
          const amount = item.innerText.replace('$', '');
          newElement.innerText = (params.currentRate * Number(amount)).toFixed(2).toString();
          newElement.style.color = 'red';
          item.parentNode?.appendChild(newElement);
        })
      }
      // 执行修改
      modifyContent();
    }
  });
};

// const watchAndModify = async () => {
//   const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id! },
//     function: () => {
//       // 创建观察器
//       const observer = new MutationObserver((mutations) => {
//         mutations.forEach((mutation) => {
//           // 处理DOM变化
//           if (mutation.type === 'childList') {
//             // 新增的节点
//             mutation.addedNodes.forEach(node => {
//               if (node instanceof HTMLElement) {
//                 // 新增的节点中，如果innerText中第一个文字是 $ 符号，则在这个元素的后方追加一个元素，内容为 data.currentRate * item.innerText
//                 if (node.innerText.startsWith('$')) {
//                   const newElement: HTMLDivElement = document.createElement('div');
//                   newElement.innerText = (currentRate.value * Number(node.innerText)).toString();
//                   newElement.style.color = 'red';
//                   node.parentNode?.appendChild(newElement);
//                 }
//               }
//             });
//           }
//         });
//       });

//       // 配置观察选项
//       const config = {
//         childList: true,
//         subtree: true
//       };

//       // 开始观察
//       observer.observe(document.body, config);
//     }
//   });
// };
</script>

<template>
  <div class="hello-world">
    <div class="icon">
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" class="logo" alt="Vite logo" />
      </a>
    </div>
    <!-- 当前汇率 -->
    <div class="form-item">
      <div class="label">当前汇率</div>
      <div class="value">{{ currentRate }}</div>
      <el-button type="primary" @click="handleRefreshRate">刷新</el-button>
      <el-button type="primary" @click="handleConvert">转换</el-button>
    </div>
    <!-- 币种选择 -->
    <div class="currency-select">
      <el-input v-model="amount" placeholder="请输入金额" :controls="false" />
    </div>
    <!-- 计算结果 -->
    <div class="result">
      <div class="label">计算结果</div>
      <div class="value">{{ Number(amount) * currentRate }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hello-world {
  padding: 20px;
  width: 300px;
  border: 1px solid #ccc;
  .icon {
    display: flex;
    justify-content: center;
    img {
      width: 60px;
    }
  }
  .form-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    margin-top: 10px;
    .label {
      width: 100px;
    }
    .value {
      flex: 1;
    }
  }
  .result {
    margin-top: 10px;
    padding: 10px;
    padding-top: 20px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 4px;
    border-radius: 4px;
    background: linear-gradient(45deg, #6a11cb, #2575fc);
    color: #fff;
    .value {
      font-size: 20px;
    }
  }
}
</style>
