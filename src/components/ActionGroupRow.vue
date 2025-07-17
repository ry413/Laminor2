<script setup lang="ts">
import { computed } from 'vue'
import { NButton } from 'naive-ui'

import {
    type IDeviceRow,
    type IActionGroupRow,
} from '../types.ts'
import ActionList from './ActionList.vue'

/* ---------- props / emits ---------- */
const props = defineProps<{
    data: IActionGroupRow
    trueDevices: IDeviceRow[]
    operationTargets: IDeviceRow[]
    actionGroups: IActionGroupRow[]
}>()

const emit = defineEmits<{
    (e: 'update:data', v: IActionGroupRow): void
    (e: 'remove'): void
}>()

/* ---------- v-model 封装 ---------- */
const model = computed({
    get: () => props.data,
    set: v => emit('update:data', v)
})
</script>

<template>
    <div class="input-row">

        <n-input v-model:value="model.name" placeholder="" style="width: 140px;">
            <template #prefix><n-text depth="3">名称:</n-text></template>
        </n-input>

        <n-button quaternary circle @click="emit('remove')">✕</n-button>
        <p>是模式</p>
        <n-switch v-model:value="model.isMode" />
    </div>

    <ActionList v-model="model.actions" :trueDevices="props.trueDevices" :operationTargets="props.operationTargets" :actionGroups="props.actionGroups" />

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

<script lang="ts">
// 帮助函数：根据 id 找到设备类型

// export function getDeviceType(id: number) {
//   const dev = (getCurrentInstance()?.props as any).devices
//     .find((d: IDeviceRow) => d.did === id)
//   return dev?.type as DeviceType
// // }
// export function getDeviceType(id: number, devices: IDeviceRow[]) {
//   const dev = devices.find(d => d.did === id)
//   return dev?.type as DeviceType | undefined
// }

</script>