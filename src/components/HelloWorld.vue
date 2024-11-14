<script setup lang="ts">
declare const chrome: any;
import { ref, onMounted } from 'vue';
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
  startConvert();
};
const startConvert = async () => {
  const data = JSON.parse(localStorage.getItem('c2cList') || '{}');
  if (data && data.currentRate) {
    console.log(`当前汇率`, data.currentRate)
    // 获取 所有 class名字是amount，且innerText中第一个文字是 $ 符号的元素
    const amountElements: HTMLDivElement[] = Array.from(document.querySelectorAll('.amount'));
    console.log(`output->所有amount元素`,amountElements)
    const result = amountElements.filter(item => item.innerText.startsWith('$'))
    // 在这个元素后，追加一个元素 内容为 data.currentRate * item.innerText
    result.forEach(item => {
      const newElement: HTMLDivElement = document.createElement('div');
      newElement.innerText = (data.currentRate * Number(item.innerText)).toString();
      newElement.style.color = 'red';
      item.parentNode?.appendChild(newElement);
    })
    console.log(`output->result`, result)
  }
};
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
