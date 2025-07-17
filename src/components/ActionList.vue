<script lang="ts" setup>
import { computed, watch } from 'vue'
import draggable from 'vuedraggable'
import { DeviceType, getActionId, type IActionGroupRow, type IActionRow, type IDeviceRow } from '../types';
import ActionRow from './ActionRow.vue';

const props = defineProps<{
    modelValue: IActionRow[]
    trueDevices: IDeviceRow[]
    operationTargets: IDeviceRow[]
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

/** 设备下拉 */
const deviceOptions = computed(() =>
    props.operationTargets.map(d => {
        const name = d.payload?.name ?? `设备 #${d.did}`
        const channel = (d.payload && 'channel' in d.payload) ? ` (${(d.payload as any).channel})` : ''
        return {
            label: name + channel,
            value: d.did
        }
    })
)

/** 新增 */
function addAction() {
    const dev = props.operationTargets[0]   // 可确认一定有一个目标
    const a: IActionRow = { aid: getActionId(), targetId: dev.did, operation: '', parameter: null }
    resetPayloadForDevice(a)           // 重置operation和parameter
    actions.value = [...actions.value, a]   // 产生新引用
}

/** 删除 */
function removeAt(idx: number) {
    const next = actions.value.slice()
    next.splice(idx, 1)
    actions.value = next
}

// watch(
//     () => actions.value.map(a => ({ id: a.aid, t: a.targetId })),
//     (n, o) => {
//         n.forEach(({ id, t }) => {
//             const prev = o.find(p => p.id === id)
//             if (!prev || prev.t !== t) {
//                 const act = actions.value.find(a => a.aid === id)!
//                 const dev = props.operationTargets.find(d => d.did === t)
//                 resetPayloadForDevice(act, dev)
//             }
//         })
//     },
//     { deep: true }
// )

/* ---------- 当 targetId 变更时，根据设备类型重置 Action.payload ---------- */
function resetPayloadForDevice(act: IActionRow) {
    const dev = props.operationTargets.find(d => d.did === act.targetId)
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
        case DeviceType.HEARTBEAT:
            act.operation = '插卡'
            break
        case DeviceType.ROOM_STATE:
            act.operation = '添加'
            act.parameter = '入住'
            break
        case DeviceType.DELAYER:
            act.operation = '延时'
            act.parameter = 10
            break
        case DeviceType.ACTION_GROUP_OP:
            act.operation = '调用'
            act.parameter = props.actionGroups[0]?.aid ?? -1
            console.log("awdkanwdkanwdlk" + props.actionGroups.length + " adasd " + act.parameter)
            break
        default:
            break
    }
}
</script>

<template>
    <div class="actions">
        <draggable v-model="actions" item-key="aid" :clone="(i: any) => ({ ...i })" handle=".handle" animation="150">
            <template #item="{ element: act, index: idx }">
                <div class="action-row">
                    <span class="handle" style="cursor:grab">☰</span>

                    <n-select v-model:value="act.targetId" :options="deviceOptions" style="width:140px" :consistent-menu-width="false" 
                    @update:value="resetPayloadForDevice(act)"/>

                    <ActionRow :act="act" :trueDevices="props.trueDevices" :operationTargets="props.operationTargets"
                        :actionGroups="props.actionGroups" @remove="removeAt(idx)" />

                    <n-button quaternary circle @click="removeAt(idx)">✕</n-button>
                </div>
            </template>
        </draggable>

        <n-button tertiary size="small" @click="addAction">＋新增 Action</n-button>
    </div>
</template>

<style scoped>
.action-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.handle {
    cursor: grab;
    padding-right: 6px;
}
</style>