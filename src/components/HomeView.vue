<script setup lang="ts">
import { type FormInst } from 'naive-ui';
import { ref, type Ref } from 'vue'

const formRef = ref<FormInst | null>(null)
const rules = {
  configName: {
    required: true,
    message: '配置名称',
  },
  airConfig: {
    defaultTargetTemp: {
      require: true,
      message: '默认温度'
    },
    defaultMode: {
      require: true,
      message: '默认模式'
    },
    defaultFanSpeed: {
      require: true,
      message: '默认风速'
    },
    stopThreshold: {
      require: true,
      message: '停止工作所需超出目标温度的阈值'
    },
    reworkThreshold: {
      require: true,
      message: '回温后重新开始工作的阈值'
    },
    stopAction: {
      require: true,
      message: '盘管空调停止工作后的行为'
    },
    removeCardAirUsable: {
      require: true,
      message: '拔卡时空调是否可用'
    },
    autoFan: {
      lowFanTempDiff: {
        require: true,
        message: '调到低风所需小于等于的温差'
      },
      highFanTempDiff: {
        require: true,
        message: '调到高风所需大于等于的温差'
      },
      autoVentFanSpeed: {
        require: true,
        message: '处于通风模式且自动风速时的风速'
      }
    }
  }
}
</script>

<script lang="ts">
export const commonConfigs: Ref = ref({
  configName: '',
  airConfig: {
    defaultTargetTemp: 26,
    defaultMode: 0,
    defaultFanSpeed: 0,
    stopThreshold: 1,
    reworkThreshold: 1,
    stopAction: 0,
    removeCardAirUsable: false,
    autoFan: {
      lowFanTempDiff: 2,
      highFanTempDiff: 4,
      autoVentFanSpeed: 1,
    }
  }
})
</script>

<template>
  <div class="page-container">
    <n-form ref="formRef" :rules="rules" class="form-wrapper" label-width="230px" label-placement="left">
      <h2 style="text-align: center;">基础配置</h2>
      <n-form-item label="配置名称" path="configName">
        <n-input v-model:value="commonConfigs.configName" placeholder="输入" />
      </n-form-item>
      <h2 style="text-align: center;">空调配置</h2>
      <n-form-item label="默认目标温度" path="airConfig.defaultTargetTemp">
        <n-select v-model:value="commonConfigs.airConfig.defaultTargetTemp" :options="Array.from({ length: 16 }, (_, i) => {
          const num = i + 16
          return { label: String(num), value: num }
        })" />
      </n-form-item>
      <n-form-item label="默认模式" path="airConfig.defaultMode">
        <n-select v-model:value="commonConfigs.airConfig.defaultMode" :options="[
          { label: '制冷', value: 0 },
          { label: '制热', value: 1 },
          { label: '通风', value: 2 },
        ]" />
      </n-form-item>
      <n-form-item label="默认风速" path="airConfig.defaultFanSpeed">
        <n-select v-model:value="commonConfigs.airConfig.defaultFanSpeed" :options="[
          { label: '低风', value: 0 },
          { label: '中风', value: 1 },
          { label: '高风', value: 2 },
          { label: '自动', value: 3 },
        ]" />
      </n-form-item>
      <n-form-item label="停止工作所需超出目标温度的阈值">
        <n-select v-model:value="commonConfigs.airConfig.stopThreshold" :options="Array.from({ length: 6 }, (_, i) => {
          return { label: String(i), value: i }
        })" />
      </n-form-item>
      <n-form-item label="回温后重新开始工作的阈值">
        <n-select v-model:value="commonConfigs.airConfig.reworkThreshold" :options="Array.from({ length: 6 }, (_, i) => {
          return { label: String(i), value: i }
        })" />
      </n-form-item>
      <n-form-item label="盘管空调停止工作后的行为">
        <n-select v-model:value="commonConfigs.airConfig.stopAction" :options="[
          { label: '关闭风机与水阀', value: 0 },
          { label: '仅关闭水阀', value: 1 },
          { label: '仅关闭风机', value: 2 },
          { label: '什么都不做', value: 3 },
        ]" />
      </n-form-item>
      <n-form-item label="拔卡时空调是否可用">
        <n-switch v-model:value="commonConfigs.airConfig.removeCardAirUsable" />
      </n-form-item>
      <h3 style="text-align: center;">当风速为自动时</h3>
      <n-form-item label="调到低风所需小于等于的温差">
        <n-select v-model:value="commonConfigs.airConfig.autoFan.lowFanTempDiff" :options="Array.from({ length: 4 }, (_, i) => {
          return { label: String(i), value: i }
        })" />
      </n-form-item>
      <n-form-item label="调到高风所需大于等于的温差">
        <n-select v-model:value="commonConfigs.airConfig.autoFan.highFanTempDiff" :options="Array.from({ length: 8 }, (_, i) => {
          return { label: String(i), value: i }
        })" />
      </n-form-item>
      <n-form-item label="处于通风模式且自动风速时的风速">
        <n-select v-model:value="commonConfigs.airConfig.autoFan.autoVentFanSpeed" :options="[
          { label: '低风', value: 0 },
          { label: '中风', value: 1 },
          { label: '高风', value: 2 },
          { label: '自动', value: 3 },
        ]" />
      </n-form-item>
    </n-form>
  </div>
</template>

<style scoped>
.page-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;      /* Page‑level scrolling */
  display: flex;
  justify-content: center;
  align-items: flex-start; /* keep content at the top */
  padding: 24px 0;        /* optional top/bottom spacing */
  width: 100%;
}

.form-wrapper {
  width: 100%;
  max-width: 600px;       /* keeps each form‑item narrow */
}
</style>
