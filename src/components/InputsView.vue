<script setup lang="ts">
import { ref } from 'vue'
import draggable from 'vuedraggable'
import { getInputId, InputType, TriggerType, type IInputRow } from '../types.ts'
import InputRow from './InputRow.vue'
import { actionGroupRows } from './ActionGroupView.vue'
import { useDevices } from '../store/devices.ts'

const { trueDeviceRows, allTargets } = useDevices()

function addInput() {
  inputRows.value.push({
    name: '',
    iid: getInputId(),
    type: InputType.PANEL_BTN,
    actionRounds: [],
    tags: [],
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
  <draggable v-model="inputRows" item-key="id" handle=".drag-handle" :force-fallback="true">
    <template #item="{ element, index }">
      <div>
        <div style="display:flex; align-items:center">
          <img class="drag-handle" src="@/assets/drag-handle.png" alt="drag handle"
            style="cursor: grab; padding-right: 8px; width: 20px; height: 20px" />

          <InputRow :index="index" :key="element.iid" v-model:data="inputRows[index]" :trueDevices="trueDeviceRows"
            :operationTargets="allTargets" :actionGroups="actionGroupRows" @remove="inputRows.splice(index, 1)" />
        </div>
        <n-divider />
      </div>
    </template>
  </draggable>


  <n-float-button :right="100" :bottom="100" :width="100" shape="square" type="primary" @click="addInput">
    <template #description>
      <div style="font-size: 20px;">
        添加输入
      </div>
    </template>
  </n-float-button>
</template>