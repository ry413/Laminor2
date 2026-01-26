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
