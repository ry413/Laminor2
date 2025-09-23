<template>
    <div class="menu-wrapper">
        <n-menu :options="menuOptions" />
    </div>
</template>

<script lang="ts">
import type { MenuOption } from 'naive-ui'
import type { Component } from 'vue'
import {
    HomeOutline as HomeIcon,
    GridOutline as DevicesIcon,
    EnterOutline as InputsIcon,
    ReceiptOutline as ActionGroupIcon
} from '@vicons/ionicons5'

import { NIcon } from 'naive-ui'
import { defineComponent, h } from 'vue'
import { RouterLink } from 'vue-router'

function renderIcon(icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        path: '/'
                    }
                },
                { default: () => '主页' }
            ),
        key: 'home',
        icon: renderIcon(HomeIcon)
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        path: '/devices'
                    }
                },
                { default: () => '设备配置' }
            ),
        key: 'devices',
        icon: renderIcon(DevicesIcon)
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        path: '/actionGroups'
                    }
                },
                { default: () => '动作组合' }
            ),
        key: 'actionGroups',
        icon: renderIcon(ActionGroupIcon)
    },

    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        path: '/inputs'
                    }
                },
                { default: () => '输入配置' }
            ),
        key: 'inputs',
        icon: renderIcon(InputsIcon)
    }
]

export default defineComponent({
    setup() {
        return {
            menuOptions
        }
    }
})
</script>

<style scoped>
</style>