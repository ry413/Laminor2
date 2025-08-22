<script setup lang="ts">
import { computed } from 'vue'
import { NButton } from 'naive-ui'

import {
    type IActionGroupRow,
} from '../types.ts'
import ActionList from './ActionList.vue'
import { useDevices } from '../store/devices.ts'

const { trueDeviceRows } = useDevices()

/* ---------- props / emits ---------- */
const props = defineProps<{
    data: IActionGroupRow
    actionGroups: IActionGroupRow[]
    index: number
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
        <!-- <p>{{ props.data.aid }}</p> -->
        <p style="min-width: 20px; text-align: right; ">
            {{ props.index + 1 }}
        </p>
        <n-input v-model:value="model.name" placeholder="" style="width: 140px;">
            <template #prefix><n-text depth="3">名称:</n-text></template>
        </n-input>

        <n-button type="error" ghost @click="emit('remove')">删除本行</n-button>
        <p>是模式</p>
        <n-switch v-model:value="model.isMode" />
    </div>

    <ActionList v-model="model.actions" :trueDevices="trueDeviceRows" :actionGroups="props.actionGroups" />

</template>

<style scoped>
.input-row {
    display: flex;
    gap: 8px;
    align-items: center;
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
</script>