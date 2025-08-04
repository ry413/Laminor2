<script setup lang="ts">
import { ref } from 'vue'
import draggable from 'vuedraggable'
import { trueDeviceRows, operationTargets } from './DevicesView.vue'
import { getInputId, InputType, TriggerType, type IInputRow } from '../types.ts'
import InputRow from './InputRow.vue'
import { actionGroupRows } from './ActionGroupView.vue'


function addInput() {
  inputRows.value.push({
    name: '',
    iid: getInputId(),
    type: InputType.PANEL_BTN,
    actionRounds: [],
    tags: null,
    lightBindDid: null,
    pid: 0,
    bid: 0,
    channel: 127,
    triggerType: TriggerType.HIGH_LEVEL,
    infraredDuration: 10,
    code: ''
  })
}
</script>
<script lang="ts">
export const inputRows = ref<IInputRow[]>([])

</script>

<template>
  <draggable v-model="inputRows" item-key="id" handle=".drag-handle">
    <template #item="{ element, index }">
      <div>
        <n-divider />
        <div style="display:flex; align-items:center">
          <span class="drag-handle" style="cursor:grab; padding-right:8px">☰</span>
          <InputRow :key="element.iid" v-model:data="inputRows[index]" :trueDevices="trueDeviceRows"
          :operationTargets="operationTargets" :actionGroups="actionGroupRows" @remove="inputRows.splice(index, 1)" />
        </div>
      </div>
    </template>
  </draggable>

  <n-button type="primary" @click="addInput" style="margin-top:12px">
    添加 Input
  </n-button>
</template>