<!-- ActionRow.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { DeviceType, getDeviceType, RoomStates, type IActionGroupRow, type IActionRow, type IDeviceRow } from '../types';

const props = defineProps<{
  act: IActionRow
  trueDevices: IDeviceRow[]
  operationTargets: IDeviceRow[]
  actionGroups: IActionGroupRow[]
}>()

const dtype = computed(() =>
  getDeviceType(props.act.targetId, props.operationTargets)
)

// INDICATOR 专用参数
// 把 parameter 视作 "panelId,keyId" 这种格式
function splitParam() {
  return (props.act.parameter || '').split(',').slice(0, 2) as [string?, string?]
}

function writeParam(p?: string, k?: string) {
  props.act.parameter = `${p ?? ''},${k ?? ''}`
}

const panelId = computed<number | null>({
  get() {
    if (dtype.value !== DeviceType.INDICATOR) return null
    const [p] = splitParam()
    if (p === undefined || p === '') return 0 // 默认显示为 0，但不写回
    const n = Number(p)
    return isNaN(n) ? null : n
  },
  set(v) {
    const [, k] = splitParam()
    writeParam(v != null ? String(v) : '', k)
  }
})

const keyId = computed<number | null>({
  get() {
    if (dtype.value !== DeviceType.INDICATOR) return null
    const [, k] = splitParam()
    if (k === undefined || k === '') return 0 // 默认显示为 0，但不写回
    const n = Number(k)
    return isNaN(n) ? null : n
  },
  set(v) {
    const [p] = splitParam()
    writeParam(p, v != null ? String(v) : '')
  }
})

// 大概是delayer时长专用
const parameterNum = computed<number | null>({
  get: () => {
    const n = Number(props.act.parameter)
    // 只有明确是数字才返回，否则为 null
    return isNaN(n) ? null : n
  },
  set: v => {
    props.act.parameter = v != null ? String(v) : ''
  }
})
const actionGroupOptions = computed(() =>
  props.actionGroups.map(g => ({
    label: g.name,
    value: String(g.aid)   // 统一成字符串
  }))
)
</script>

<template>
  <div class="action-row">
    <template v-if="dtype === DeviceType.LAMP">
      <n-select v-model:value="act.operation" :options="['开', '关', '反转'].map(x => ({ label: x, value: x }))"
        :consistent-menu-width="false" />
    </template>

    <template v-else-if="dtype === DeviceType.CURTAIN">
      <n-select v-model:value="act.operation" :options="['开', '关'].map(x => ({ label: x, value: x }))"
        :consistent-menu-width="false" />
    </template>

    <template v-else-if="dtype === DeviceType.INFRARED_AIR || dtype === DeviceType.SINGLE_AIR">
      <n-select v-model:value="act.operation"
        :options="['开', '关', '设置温度', '制冷', '制热', '通风', '低风', '中风', '高风', '风量加大', '风量减小', '温度升高', '温度降低'].map(x => ({ label: x, value: x }))"
        :consistent-menu-width="false" />
      <n-select v-if="act.operation === '设置温度'" v-model:value="act.parameter" :consistent-menu-width="false" :options="Array.from({ length: 16 }, (_, i) => {
        const num = i + 16
        return { label: String(num), value: num }
      })" />
    </template>

    <template v-else-if="dtype === DeviceType.RS485">
      <n-select v-model:value="act.operation" :options="['发送'].map(x => ({ label: x, value: x }))"
        :consistent-menu-width="false" />
    </template>

    <template v-else-if="dtype === DeviceType.RELAY">
      <n-select v-model:value="act.operation" :options="['开', '关', '反转'].map(x => ({ label: x, value: x }))"
        :consistent-menu-width="false" />
    </template>

    <template v-else-if="dtype === DeviceType.DRY_CONTACT">
      <n-select v-model:value="act.operation" :options="['开', '关', '反转'].map(x => ({ label: x, value: x }))"
        :consistent-menu-width="false" />
    </template>

    <template v-else-if="dtype === DeviceType.HEARTBEAT">
      <n-select v-model:value="act.operation" :options="['插卡', '拔卡', '睡眠'].map(x => ({ label: x, value: x }))"
        :consistent-menu-width="false" />
    </template>

    <template v-else-if="dtype === DeviceType.DOORBELL">
      <n-select v-model:value="act.operation" :options="['开', '关', '反转'].map(x => ({ label: x, value: x }))"
        :consistent-menu-width="false" />
    </template>

    <template v-else-if="dtype === DeviceType.BGM">
      <n-select v-model:value="act.operation" :options="['打开功放', '关闭功放', '播放', '停止', '播放/暂停', '上一首', '下一首', '音量加', '音量减', '打开蓝牙模式', '关闭蓝牙模式', '反转模式'].map(x => ({ label: x, value: x }))"
        :consistent-menu-width="false" />
    </template>

    <template v-else-if="dtype === DeviceType.ROOM_STATE">
      <n-select v-model:value="act.operation"
        :options="['添加', '删除', '反转', '如果存在此状态则跳出'].map(x => ({ label: x, value: x }))" :consistent-menu-width="false" />
      <n-select v-model:value="act.parameter" :options="RoomStates.map(x => ({ label: x, value: x }))"
        :consistent-menu-width="false" />
    </template>

    <template v-else-if="dtype === DeviceType.DELAYER">
      <n-input-number v-model:value="parameterNum" style="width: 180px">
        <template #suffix><n-text depth="3">秒</n-text></template>
      </n-input-number>
    </template>

    <template v-else-if="dtype === DeviceType.ACTION_GROUP_OP">
      <n-select v-model:value="act.operation"
        :options="['调用', '中断', '生成任意键执行', '删除任意键执行'].map(x => ({ label: x, value: x }))"
        :consistent-menu-width="false" />
      <n-select v-if="act.operation != '删除任意键执行'" v-model:value="act.parameter" :options="actionGroupOptions"
        :consistent-menu-width="false" />
    </template>

    <template v-else-if="dtype === DeviceType.SNAPSHOT">
      <n-select v-model:value="act.operation"
        :options="['记录快照', '读取并删除快照', '删除快照', '删除快照并跳出'].map(x => ({ label: x, value: x }))"
        :consistent-menu-width="false" />
    </template>

    <template v-else-if="dtype === DeviceType.INDICATOR">
      <n-select v-model:value="act.operation" style="width: auto;"
        :options="['亮', '灭', '亮1秒'].map(x => ({ label: x, value: x }))" :consistent-menu-width="false" />
      <n-input-number v-model:value="panelId" placeholder="" :show-button="false" style="width: 90px;">
        <template #prefix><n-text depth="3">面板ID</n-text></template>
      </n-input-number>
      <n-input-number v-model:value="keyId" placeholder="" :show-button="false" style="width: 90px;">
        <template #prefix><n-text depth="3">按键ID</n-text></template>
      </n-input-number>
    </template>

  </div>
</template>