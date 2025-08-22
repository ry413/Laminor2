<script setup lang="ts">
import { ref } from 'vue'
import draggable from 'vuedraggable'
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
    <draggable v-model="actionGroupRows" item-key="id" handle=".drag-handle" :force-fallback="true">
        <template #item="{ element, index }">
            <div>
                <div style="display:flex; align-items:center">
                    <img class="drag-handle" src="@/assets/drag-handle.png" alt="drag handle"
                        style="cursor: grab; padding-right: 8px; width: 20px; height: 20px" />
                    <ActionGroupRow :index="index" :key="element.aid" v-model:data="actionGroupRows[index]"
                        :actionGroups="actionGroupRows" @remove="actionGroupRows.splice(index, 1)" />
                </div>
                <n-divider />

            </div>
        </template>
    </draggable>
    <n-float-button :right="100" :bottom="100" :width="100" shape="square" type="primary" @click="addActionGroup">
        <template #description>
            <div style="font-size: 20px;">
                添加模式
            </div>
        </template>
    </n-float-button>
</template>