import { ref, computed } from 'vue'
import { getDeviceId, type IDeviceRow } from '../types'

const trueDeviceRows = ref<IDeviceRow[]>([])
const presetDeviceRows = ref<IDeviceRow[]>([
  { did: getDeviceId(), type: 'heartbeat', carryState: null, linkDids: [], repelDids: [], payload: { name: '更改心跳包' } },
  { did: getDeviceId(), type: 'roomState', carryState: null, linkDids: [], repelDids: [], payload: { name: '房间状态操作' } },
  { did: getDeviceId(), type: 'delayer', carryState: null, linkDids: [], repelDids: [], payload: { name: '延时' } },
  { did: getDeviceId(), type: 'actionGroupOp', carryState: null, linkDids: [], repelDids: [], payload: { name: '模式' } },
  { did: getDeviceId(), type: 'snapshot', carryState: null, linkDids: [], repelDids: [], payload: { name: '房间状态快照' } },
  { did: getDeviceId(), type: 'indicator', carryState: null, linkDids: [], repelDids: [], payload: { name: '按键指示灯' } }
])

export function useDevices() {
  const allTargets = computed(() => [
    ...trueDeviceRows.value,
    ...presetDeviceRows.value
  ])
  return { trueDeviceRows, presetDeviceRows, allTargets }
}