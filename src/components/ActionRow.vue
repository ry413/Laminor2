<!-- ActionRow.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { DeviceType, getDeviceType, type IActionGroupRow, type IActionRow, type IDeviceRow } from '../types';

const props = defineProps<{
  act: IActionRow
  trueDevices: IDeviceRow[]
  operationTargets: IDeviceRow[]
  actionGroups: IActionGroupRow[]
}>()

const dtype = computed(() =>
  getDeviceType(props.act.targetId, props.operationTargets)
)

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

    <template v-else-if="dtype === DeviceType.ROOM_STATE">
      <n-select v-model:value="act.operation" :options="['添加', '删除', '反转', '如果存在此状态则跳出'].map(x => ({ label: x, value: x }))"
        :consistent-menu-width="false" />
      <n-input v-model:value="act.parameter" style="width: 180px" :consistent-menu-width="false" />
    </template>

    <template v-else-if="dtype === DeviceType.DELAYER">
      <n-input-number v-model:value="parameterNum" style="width: 180px">
        <template #suffix><n-text depth="3">秒</n-text></template>
      </n-input-number>
    </template>

    <template v-else-if="dtype === DeviceType.ACTION_GROUP_OP">
      <n-select v-model:value="act.operation" :options="['调用', '中断', '生成任意键执行'].map(x => ({ label: x, value: x }))"
        :consistent-menu-width="false" />
      <n-select v-model:value="act.parameter" :options="props.actionGroups.map(x => ({ label: x.name, value: x.aid }))"
        :consistent-menu-width="false" />
    </template>

  </div>
</template>