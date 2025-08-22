<script lang="ts" setup>
import { computed } from 'vue'
import draggable from 'vuedraggable'
import { DeviceType, RoomStates, type IActionGroupRow, type IActionRow, type IDeviceRow } from '../types';
import ActionRow from './ActionRow.vue';
import { useDevices } from '../store/devices';

const { trueDeviceRows, presetDeviceRows } = useDevices() 

const props = defineProps<{
    modelValue: IActionRow[]
    actionGroups: IActionGroupRow[]
}>()
const emit = defineEmits<{
    (e: 'update:modelValue', v: IActionRow[]): void
}>()

/** 单一数据来源：actions */
const actions = computed({
    get: () => props.modelValue,
    set: v => emit('update:modelValue', v)
})

/** 设备下拉（分组：灯控 / 其他设备 / 系统工具） */
const presetList = computed<IDeviceRow[]>(() => {
    // 兼容从另一个组件导出的数组或 ref，两者都取到同一数组
    const p: any = presetDeviceRows as any
    return Array.isArray(p) ? (p as IDeviceRow[]) : ((p?.value ?? []) as IDeviceRow[])
})

const toOption = (d: IDeviceRow) => {
    const name = d.payload?.name ?? `设备 #${d.did}`
    const channel = (d.payload && 'channel' in d.payload) ? ` (${(d.payload as any).channel})` : ''
    return { label: name + channel, key: d.did }
}

const allTargets = computed<IDeviceRow[]>(() => [
    ...trueDeviceRows.value,
    ...presetList.value
])

const opeartionTargetOptions = computed(() => {
    const lampChildren = trueDeviceRows.value
        .filter(d => d.type === DeviceType.LAMP)
        .map(toOption)

    const otherChildren = trueDeviceRows.value
        .filter(d => d.type !== DeviceType.LAMP)
        .map(toOption)

    const systemChildren = presetList.value.map(toOption)

    return [
        { label: '灯控', key: 'group-lamp', children: lampChildren },
        { label: '其他设备', key: 'group-other', children: otherChildren },
        { label: '系统工具', key: 'group-system', children: systemChildren }
    ]
})

/** 新增 */
function addAction() {
    const dev = allTargets.value[0]
    if (!dev) return
    const a: IActionRow = { targetId: dev.did, operation: '', parameter: null }
    resetPayloadForDevice(a)
    actions.value = [...actions.value, a]
}

/** 删除 */
function removeAt(idx: number) {
    const next = actions.value.slice()
    next.splice(idx, 1)
    actions.value = next
}

/* ---------- 当 targetId 变更时，根据设备类型重置 Action.payload ---------- */
function resetPayloadForDevice(act: IActionRow) {
    const dev = allTargets.value.find(d => d.did === act.targetId)
    if (!dev) return

    act.operation = ''
    act.parameter = null

    switch (dev.type) {
        case DeviceType.LAMP:
            act.operation = '开'
            break
        case DeviceType.CURTAIN:
            act.operation = '开'
            break
        case DeviceType.INFRARED_AIR:
        case DeviceType.SINGLE_AIR:
            act.operation = '开'
            act.parameter = 22
            break
        case DeviceType.RS485:
            act.operation = '发送'
            break
        case DeviceType.RELAY:
            act.operation = '开'
            break
        case DeviceType.DRY_CONTACT:
            act.operation = '开'
            break
        case DeviceType.DOORBELL:
            act.operation = '开'
            break
        case DeviceType.HEARTBEAT:
            act.operation = '插卡'
            break
        case DeviceType.ROOM_STATE:
            act.operation = '添加'
            act.parameter = RoomStates[0]
            break
        case DeviceType.DELAYER:
            act.operation = '延时'
            act.parameter = 10
            break
        case DeviceType.ACTION_GROUP_OP:
            act.operation = '调用'
            act.parameter = props.actionGroups[0]?.aid ?? -1
            break
        case DeviceType.SNAPSHOT:
            act.operation = '记录快照'
            break
        case DeviceType.INDICATOR:
            act.operation = '亮'
            break
        default:
            break
    }
}

function targetLabel(act: IActionRow) {
    const d = allTargets.value.find(d => d.did === act.targetId)
    if (!d) return '选择设备'
    const name = d.payload?.name ?? `设备 #${act.targetId}`
    const channel = (d.payload && 'channel' in d.payload) ? ` (${(d.payload as any).channel})` : ''
    return name + channel
}

function handleSelectTarget(act: IActionRow, key: string | number) {
    act.targetId = Number(key)
    resetPayloadForDevice(act)
}
</script>

<template>
    <div class="actions">
        <draggable v-model="actions" item-key="aid" :clone="(i: any) => ({ ...i })" handle=".drag-handle" animation="150" :force-fallback="true">
            <template #item="{ element: act, index: idx }">
                <div class="action-row">
                    <img class="drag-handle" src="@/assets/drag-handle.png" alt="drag handle"
                        style="cursor: grab; padding-right: 4px; width: 16px; height: 16px" />

                    <n-dropdown trigger="hover" :options="opeartionTargetOptions" @select="(key: string | number) => handleSelectTarget(act, key)" placement="bottom-end">
                        <n-button style="width:140px; display: inline-flex; justify-content: space-between;">
                            {{ targetLabel(act) }}
                        </n-button>
                    </n-dropdown>

                    <ActionRow :act="act" :trueDevices="trueDeviceRows" :operationTargets="allTargets"
                        :actionGroups="props.actionGroups" @remove="removeAt(idx)" />

                    <n-button quaternary circle @click="removeAt(idx)">✕</n-button>
                </div>
            </template>
        </draggable>

        <n-button tertiary size="small" type="primary" @click="addAction">添加动作</n-button>
    </div>
</template>

<style scoped>
.action-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.drag-handle {
    cursor: grab;
    padding-right: 6px;
}
</style>