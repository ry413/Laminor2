<script setup lang="ts">
import { computed } from 'vue'
import { NSelect, NInput } from 'naive-ui'
import { createDefaultDevicePayload, DeviceType, type CurtainPayload, type IDeviceRow, type DryContactPayload, type InfraredAirPayload, type LampPayload, type RelayPayload, type RS485Payload, type SingleAirPayload, type DoorbellPayload, RoomStates } from '../types'

const typeOptions = [
    { label: '灯', key: DeviceType.LAMP },
    { label: '窗帘', key: DeviceType.CURTAIN },
    { label: '红外空调', key: DeviceType.INFRARED_AIR },
    { label: '单管空调', key: DeviceType.SINGLE_AIR },
    { label: '485指令', key: DeviceType.RS485 },
    { label: '继电器输出', key: DeviceType.RELAY },
    { label: '干接点输出', key: DeviceType.DRY_CONTACT },
    { label: '门铃', key: DeviceType.DOORBELL }
]

const props = defineProps<{
    data: IDeviceRow
    trueDevices: IDeviceRow[]
    index: number
}>()

const emit = defineEmits<{
    (e: 'update:data', val: IDeviceRow): void
    (e: 'remove'): void
}>()

const model = computed({
    get: () => props.data,
    set: (val) => emit('update:data', val)
})

const typeProxy = computed({
    get: () => model.value.type,
    set: (newType: DeviceType) => {
        if (newType !== model.value.type) {
            // 仅用户改下拉时走到这里
            model.value.type = newType
            model.value.payload = createDefaultDevicePayload(newType)
        }
    }
})

const currentTypeLabel = computed(() =>
    typeOptions.find(o => o.key === typeProxy.value)?.label ?? '选择类型'
)

const handleTypeSelect = (key: DeviceType) => {
    typeProxy.value = key as DeviceType
}

const trueDeviceOptions = computed(() =>
    props.trueDevices.map(d => ({
        label: d.payload?.name ?? `设备 #${d.did}`,
        value: d.did
    }))
)
</script>

<template>
    <div style="display: flex; gap: 8px; align-items: center;">
        <!-- <p>{{ props.data.did }}</p> -->

        <p style="min-width: 20px; text-align: right; ">
            {{ props.index + 1 }}
        </p>

        <n-dropdown trigger="hover" :options="typeOptions" @select="handleTypeSelect">
            <n-button style="width: 110px; display: inline-flex; justify-content: space-between;">
                {{ currentTypeLabel }}
            </n-button>
        </n-dropdown>

        <!-- 灯 -->
        <template v-if="model.type === DeviceType.LAMP">
            <n-input v-model:value="model.payload.name" placeholder="" class="name-input">
                <template #prefix><n-text depth="3">名称:</n-text></template>
            </n-input>
            <n-input-number v-model:value="(model.payload as LampPayload).channel" placeholder="" :show-button="false"
                class="channel-input">
                <template #prefix><n-text depth="3">通道:</n-text></template>
            </n-input-number>
        </template>

        <!-- 窗帘 -->
        <template v-else-if="model.type === DeviceType.CURTAIN">
            <n-input style="width: 150px;" v-model:value="model.payload.name" placeholder="" class="name-input">
                <template #prefix><n-text depth="3">名称:</n-text></template>
            </n-input>
            <n-input-number v-model:value="(model.payload as CurtainPayload).openChannel" placeholder=""
                :show-button="false" class="channel-input">
                <template #prefix><n-text depth="3">开:</n-text></template>
            </n-input-number>
            <n-input-number v-model:value="(model.payload as CurtainPayload).closeChannel" placeholder=""
                :show-button="false" class="channel-input">
                <template #prefix><n-text depth="3">关:</n-text></template>
            </n-input-number>
            <n-input-number v-model:value="(model.payload as CurtainPayload).runtime" placeholder=""
                :show-button="false" style="width: 120px;">
                <template #prefix><n-text depth="3">运行:</n-text></template>
                <template #suffix>秒</template>
            </n-input-number>
        </template>

        <!-- 红外空调 -->
        <template v-if="model.type === DeviceType.INFRARED_AIR">
            <n-input v-model:value="model.payload.name" placeholder="" class="name-input">
                <template #prefix><n-text depth="3">名称:</n-text></template>
            </n-input>
            <n-input-number v-model:value="(model.payload as InfraredAirPayload).airId" placeholder=""
                class="channel-input" :show-button="false">
                <template #prefix><n-text depth="3">空调ID:</n-text></template>
            </n-input-number>
        </template>

        <!-- 单管空调 -->
        <template v-if="model.type === DeviceType.SINGLE_AIR">
            <n-input v-model:value="model.payload.name" placeholder="" class="name-input">
                <template #prefix><n-text depth="3">名称:</n-text></template>
            </n-input>
            <n-input-number v-model:value="(model.payload as SingleAirPayload).airId" placeholder=""
                class="channel-input" :show-button="false">
                <template #prefix><n-text depth="3">空调ID:</n-text></template>
            </n-input-number>
            <n-input-number v-model:value="(model.payload as SingleAirPayload).waterChannel" placeholder=""
                :show-button="false" class="channel-input">
                <template #prefix><n-text depth="3">水阀:</n-text></template>
            </n-input-number>
            <n-input-number v-model:value="(model.payload as SingleAirPayload).lowChannel" placeholder=""
                :show-button="false" class="channel-input">
                <template #prefix><n-text depth="3">低风:</n-text></template>
            </n-input-number>
            <n-input-number v-model:value="(model.payload as SingleAirPayload).midChannel" placeholder=""
                :show-button="false" class="channel-input">
                <template #prefix><n-text depth="3">中风:</n-text></template>
            </n-input-number>
            <n-input-number v-model:value="(model.payload as SingleAirPayload).highChannel" placeholder=""
                :show-button="false" class="channel-input">
                <template #prefix><n-text depth="3">高风:</n-text></template>
            </n-input-number>
        </template>

        <!-- 485 -->
        <template v-if="model.type === DeviceType.RS485">
            <n-input v-model:value="model.payload.name" placeholder="" class="name-input">
                <template #prefix><n-text depth="3">名称:</n-text></template>
            </n-input>
            <n-input v-model:value="(model.payload as RS485Payload).code" placeholder="" style="width: 268px;">
                <template #prefix><n-text depth="3">指令码:</n-text></template>
            </n-input>
        </template>

        <!-- 继电器输出 -->
        <template v-if="model.type === DeviceType.RELAY">
            <n-input v-model:value="model.payload.name" placeholder="" class="name-input">
                <template #prefix><n-text depth="3">名称:</n-text></template>
            </n-input>
            <n-input-number v-model:value="(model.payload as RelayPayload).channel" placeholder="" :show-button="false"
                class="channel-input">
                <template #prefix><n-text depth="3">通道:</n-text></template>
            </n-input-number>
        </template>

        <!-- 门铃 -->
        <template v-if="model.type === DeviceType.DOORBELL">
            <n-input v-model:value="model.payload.name" placeholder="" class="name-input">
                <template #prefix><n-text depth="3">名称:</n-text></template>
            </n-input>
            <n-input-number v-model:value="(model.payload as DoorbellPayload).channel" placeholder=""
                :show-button="false" class="channel-input">
                <template #prefix><n-text depth="3">通道:</n-text></template>
            </n-input-number>
        </template>

        <!-- 干接点输出 -->
        <template v-if="model.type === DeviceType.DRY_CONTACT">
            <n-input v-model:value="model.payload.name" placeholder="" class="name-input">
                <template #prefix><n-text depth="3">名称:</n-text></template>
            </n-input>
            <n-input-number v-model:value="(model.payload as DryContactPayload).channel" placeholder=""
                :show-button="false" class="channel-input">
                <template #prefix><n-text depth="3">通道:</n-text></template>
            </n-input-number>
        </template>

        <n-select v-model:value="model.carryState" placeholder="携带状态" style="width: 100px;" :clearable="true"
            :options="RoomStates.map(x => ({ label: x, value: x }))" />

        <n-select multiple v-model:value="model.linkDids" placeholder="联动设备" style="width: 140px;" :clearable="true"
            :consistent-menu-width="false" :options=trueDeviceOptions />
        <n-select multiple v-model:value="model.repelDids" placeholder="排斥设备" style="width: 140px;" :clearable="true"
            :consistent-menu-width="false" :options=trueDeviceOptions />

        <n-button type="error" ghost @click="emit('remove')">删除本行</n-button>
    </div>

</template>

<style scoped>
.name-input {
    width: 150px;
}

.channel-input {
    width: 90px;
}
</style>