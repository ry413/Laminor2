<script setup lang="ts">
import { type FormInst } from 'naive-ui';
import { computed, ref, watch } from 'vue'

const formRef = ref<FormInst | null>(null)
</script>

<script lang="ts">
export type CommonConfigs = {
  configName: string
  useDayNight: boolean
  dayTimePoint: number | null
  nightTimePoint: number | null
}

export const commonConfigs = ref<CommonConfigs>({
  configName: '',
  useDayNight: false,
  dayTimePoint: null,
  nightTimePoint: null,
  // airConfig: {
  //   defaultTargetTemp: 26,
  //   defaultMode: 0,
  //   defaultFanSpeed: 0,
  //   stopThreshold: 1,
  //   reworkThreshold: 1,
  //   stopAction: 0,
  //   shutdownAfterDuration: 30,
  //   shutdownAfterFanSpeed: 0,
  //   removeCardAirUsable: false,
  //   autoFan: {
  //     lowFanTempDiff: 2,
  //     highFanTempDiff: 4,
  //     autoVentFanSpeed: 1,
  //   }
  // }
})
const hourOptions = Array.from({ length: 24 }, (_, i) => ({ label: String(i), value: i }))

const nightOptions = computed(() => {
  const dt = commonConfigs.value.dayTimePoint
  return hourOptions.filter(o => o.value !== dt)
})

watch(() => commonConfigs.value.useDayNight, (on) => {
  if (!on) {
    commonConfigs.value.dayTimePoint = null
    commonConfigs.value.nightTimePoint = null
  } else {
    if (commonConfigs.value.dayTimePoint == null) commonConfigs.value.dayTimePoint = 7
    if (
      commonConfigs.value.nightTimePoint == null ||
      commonConfigs.value.nightTimePoint === commonConfigs.value.dayTimePoint
    ) {
      const dt = commonConfigs.value.dayTimePoint!
      commonConfigs.value.nightTimePoint = (dt + 12) % 24
    }
  }
})
</script>

<template>
  <div class="page-container">
    <n-form ref="formRef" class="form-wrapper" label-width="230px" label-placement="left">
      <h2 style="text-align: center;">基础配置</h2>
      <n-form-item label="配置名称" path="configName">
        <n-input v-model:value="commonConfigs.configName" placeholder="输入" />
      </n-form-item>
      <n-form-item label="夜间翻倍红外检测时长">
        <n-switch v-model:value="commonConfigs.useDayNight" />
      </n-form-item>
      <n-form-item label="白天时间点" path="dayTimePoint">
        <n-select v-model:value="commonConfigs.dayTimePoint" :options="hourOptions"
          :disabled="!commonConfigs.useDayNight" />
      </n-form-item>
      <n-form-item label="晚上时间点" path="nightTimePoint">
        <n-select v-model:value="commonConfigs.nightTimePoint" :options="nightOptions"
          :disabled="!commonConfigs.useDayNight" />
      </n-form-item>
      <!-- <h2 style="text-align: center;">空调配置</h2>
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
      <n-form-item label="盘管空调关机后风机再吹">
        <n-select v-model:value="commonConfigs.airConfig.shutdownAfterDuration" :options="[
          { label: '0秒', value: 0 },
          { label: '30秒', value: 30 },
          { label: '45秒', value: 45 },
          { label: '60秒', value: 60 },
          { label: '90秒', value: 90 },
          { label: '120秒', value: 120 },
        ]" />
        <n-select v-model:value="commonConfigs.airConfig.shutdownAfterFanSpeed" :options="[
          { label: '低风', value: 0 },
          { label: '中风', value: 1 },
          { label: '高风', value: 2 },
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
      </n-form-item> -->
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
  overflow-y: auto;
  /* Page‑level scrolling */
  display: flex;
  justify-content: center;
  align-items: flex-start;
  /* keep content at the top */
  padding: 24px 0;
  /* optional top/bottom spacing */
  width: 100%;
}

.form-wrapper {
  width: 100%;
  max-width: 600px;
  /* keeps each form‑item narrow */
}
</style>
