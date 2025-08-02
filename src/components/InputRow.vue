<script setup lang="ts">
import { computed, ref } from 'vue'
import { NSelect, NInput, NButton, NText } from 'naive-ui'

import {
  type IDeviceRow,
  InputType,
  type IInputRow,
  type IActionGroupRow,
  InputTag,
  type IActionRow,
  TriggerType,
} from '../types.ts'
import ActionList from './ActionList.vue'

const props = defineProps<{
  data: IInputRow
  trueDevices: IDeviceRow[]
  operationTargets: IDeviceRow[]
  actionGroups: IActionGroupRow[]
}>()

const emit = defineEmits<{
  (e: 'update:data', v: IInputRow): void
  (e: 'remove'): void
}>()

const model = computed({
  get: () => props.data,
  set: v => emit('update:data', v)
})

const trueDeviceOptions = computed(() =>
  props.trueDevices.map(d => ({
    label: d.payload?.name ?? `设备 #${d.did}`,
    value: d.did
  }))
)

// actionRound相关
const selectedRound = ref(0)

if (!props.data.actionRounds || props.data.actionRounds.length === 0) {
  props.data.actionRounds = [[]]
}

function prevRound() {
  selectedRound.value = Math.max(0, selectedRound.value - 1);
}

function nextRound() {
  selectedRound.value = Math.min(
    props.data.actionRounds.length - 1,
    selectedRound.value + 1
  );
}

function addRound() {
  props.data.actionRounds.push([])
  selectedRound.value = props.data.actionRounds.length - 1
}

function removeCurrentRound() {
  props.data.actionRounds.splice(selectedRound.value, 1)
  selectedRound.value = Math.min(selectedRound.value, props.data.actionRounds.length - 1);
}

const currentActions = computed({
  get: () => props.data.actionRounds[selectedRound.value],
  set: (v: IActionRow[]) => {
    props.data.actionRounds[selectedRound.value] = v
  }
})
</script>

<template>
  <!-- 输入行本体 -->
  <div class="input-row">
    <p>{{ props.data.iid }}</p>
    <n-input v-model:value="model.name" placeholder="" style="width: 140px;">
      <template #prefix><n-text depth="3">名称:</n-text></template>
    </n-input>

    <!-- 输入类型与通道 -->
    <div>
      <n-select v-model:value="model.type" :options="[
        { label: '面板按键', value: InputType.PANEL_BTN },
        { label: '干接点输入', value: InputType.DRY_CONTACT }
      ]" style="width: 110px" :consistent-menu-width="false" />

      <template v-if="model.type === InputType.PANEL_BTN">
        <n-input-number v-model:value="model.pid" style="width: 140px;">
          <template #prefix><n-text depth="3">面板ID:</n-text></template>
        </n-input-number>
        <n-input-number v-model:value="model.bid" style="width: 140px;">
          <template #prefix><n-text depth="3">按钮ID:</n-text></template>
        </n-input-number>
      </template>

      <template v-else-if="model.type === InputType.DRY_CONTACT">
        <n-input-number v-model:value="model.channel" style="width: 140px">
          <template #prefix><n-text depth="3">通道:</n-text></template>
        </n-input-number>
        <n-select v-model:value="model.triggerType" :options="[
          { label: '低电平', value: TriggerType.LOW_LEVEL },
          { label: '高电平', value: TriggerType.HIGH_LEVEL },
          { label: '红外触发', value: TriggerType.INFRARED },
          { label: '红外超时', value: TriggerType.INFRARED_TIMEOUT }
        ]" style="width: 110px" :consistent-menu-width="false" />

        <n-input-number v-if="model.triggerType === TriggerType.INFRARED" v-model:value="model.infraredDuration" style="width: 140px">
          <template #suffix><n-text depth="3">秒</n-text></template>
        </n-input-number>
      </template>
    </div>
    <div>
      <n-select v-model:value="model.tags" placeholder="额外标记" style="width: 130px;" :clearable="true" :options="[
        { label: '拔卡时可用', value: InputTag.REMOVE_CARD_USABLE },
        { label: '是插拔卡输入', value: InputTag.IS_ALIVE_CHANNEL },
        { label: '是门磁输入', value: InputTag.IS_DOOR_CHANNEL },
        { label: '是门铃输入', value: InputTag.IS_DOORBELL_CHANNEL },
      ]" />

      <n-select v-if="model.type === InputType.PANEL_BTN" v-model:value="model.lightBindDid" placeholder="指示灯与设备状态同步"
        :clearable="true" :options="trueDeviceOptions" />
    </div>

    <!-- 移除整行按钮 -->
    <n-button quaternary circle @click="emit('remove')">✕</n-button>
  </div>

  <div style="display: flex; flex-direction: column">
    <div>当前: {{ selectedRound + 1 }} / {{ model.actionRounds.length }}</div>
    <n-button @click="addRound">添加新轮次</n-button>
    <n-button @click="removeCurrentRound" v-if="model.actionRounds.length > 1">删除轮次</n-button>
  </div>
  <div style="display: flex; flex-direction: column" v-if="model.actionRounds.length > 1">
    <n-button @click="prevRound">上一组</n-button>
    <n-button @click="nextRound">下一组</n-button>
  </div>

  <ActionList :key="selectedRound" v-model="currentActions" :trueDevices="props.trueDevices"
    :operationTargets="props.operationTargets" :actionGroups="props.actionGroups" />
</template>

<style scoped>
.input-row {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 4px;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-left: 32px;
}

.action-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>