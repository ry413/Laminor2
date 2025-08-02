<script setup lang="ts">
import { computed, ref } from 'vue'
import { NButton } from 'naive-ui'
import draggable from 'vuedraggable'
import { getDeviceId, type IDeviceRow } from '../types'
import DeviceRow from './DeviceRow.vue'

function addRow() {
  trueDeviceRows.value.push({ did: getDeviceId(), type: 'lamp', carryState: null, linkDids: [], repelDids: [], payload: { name: '', channel: 127 } })
}

</script>

<script lang="ts">
export const trueDeviceRows = ref<IDeviceRow[]>([])

const extraRows: IDeviceRow[] = [
  { did: getDeviceId(), type: 'heartbeat', carryState: null, linkDids: [], repelDids: [], payload: { name: '更改心跳包' } },
  { did: getDeviceId(), type: 'roomState', carryState: null, linkDids: [], repelDids: [], payload: { name: '房间状态操作' } },
  { did: getDeviceId(), type: 'delayer', carryState: null, linkDids: [], repelDids: [], payload: { name: '延时' } },
  { did: getDeviceId(), type: 'actionGroupOp', carryState: null, linkDids: [], repelDids: [], payload: { name: '模式' } },
  { did: getDeviceId(), type: 'snapshot', carryState: null, linkDids: [], repelDids: [], payload: { name: '房间状态快照' } },
  { did: getDeviceId(), type: 'indicator', carryState: null, linkDids: [], repelDids: [], payload: { name: '按键指示灯' } }
]

export const operationTargets = computed(() => [
  ...trueDeviceRows.value,
  ...extraRows
])

</script>

<template>
  <draggable v-model="trueDeviceRows" item-key="id" handle=".drag-handle">
    <template #item="{ element, index }">
      <div style="display: flex; align-items: center">
        <span class="drag-handle" style="cursor: grab; padding-right: 8px">☰</span>
        <DeviceRow :key="element.did" :trueDevices="trueDeviceRows" v-model:data="trueDeviceRows[index]"
          @remove="trueDeviceRows.splice(index, 1)" />
      </div>
    </template>
  </draggable>
  <n-button @click="addRow" type="primary" style="margin-top: 12px">添加 Row</n-button>
</template>