<script setup lang="ts">
import { ref } from 'vue'
import draggable from 'vuedraggable'
import { operationTargets, trueDeviceRows } from './DevicesView.vue'
import { getActionGroupId, type IActionGroupRow } from '../types.ts'
import ActionGroupRow from './ActionGroupRow.vue'


function addActionGroup() {
    actionGroupRows.value.push({
        name: '',
        aid: getActionGroupId(),
        actions: [],
        isMode: false
    })
}
</script>
<script lang="ts">
export const actionGroupRows = ref<IActionGroupRow[]>([])

</script>

<template>
    <draggable v-model="actionGroupRows" item-key="id" handle=".drag-handle">
        <template #item="{ element, index }">
            <div>
                <n-divider />
                <div style="display:flex; align-items:center">
                    <span class="drag-handle" style="cursor:grab; padding-right:8px">☰</span>
                    <ActionGroupRow :key="element.aid" v-model:data="actionGroupRows[index]"
                        :trueDevices="trueDeviceRows" :operationTargets="operationTargets"
                        :actionGroups="actionGroupRows" @remove="actionGroupRows.splice(index, 1)" />
                </div>
            </div>
        </template>
    </draggable>

    <n-button type="primary" @click="addActionGroup" style="margin-top:12px">
        添加 模式
    </n-button>
</template>