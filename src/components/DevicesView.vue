<script setup lang="ts">
import { NFloatButton } from 'naive-ui'
import draggable from 'vuedraggable'
import { getDeviceId } from '../types'
import DeviceRow from './DeviceRow.vue'
import { useDevices } from '../store/devices'

const { trueDeviceRows } = useDevices()
function addRow() {
  trueDeviceRows.value.push({ did: getDeviceId(), type: 'lamp', carryState: null, linkDids: [], repelDids: [], payload: { name: '', channel: 127 } })
}
</script>

<template>
  <draggable v-model="trueDeviceRows" item-key="id" handle=".drag-handle" :force-fallback="true">
    <template #item="{ element, index }">
      <div style="display: flex; align-items: center">
        <img class="drag-handle" src="@/assets/drag-handle.png" alt="drag handle"
          style="cursor: grab; padding-right: 8px; width: 20px; height: 20px" />
        <DeviceRow :key="element.did" :index="index" :trueDevices="trueDeviceRows" v-model:data="trueDeviceRows[index]"
          @remove="trueDeviceRows.splice(index, 1)" />
      </div>
    </template>
  </draggable>
  <n-float-button :right="100" :bottom="100" :width="100" shape="square" type="primary" @click="addRow">
    <template #description>
      <div style="font-size: 20px;">
        添加设备
      </div>
    </template>
  </n-float-button>
</template>