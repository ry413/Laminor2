<script setup lang="ts">
import { actionGroupRows } from './components/ActionGroupView.vue';
import { trueDeviceRows, operationTargets } from './components/DevicesView.vue';
import { commonConfigs } from './components/HomeView.vue';
import { inputRows } from './components/InputsView.vue';
import SidebarMenu from './components/SidebarMenu.vue';
import { exportAll, importAll } from './io';

function downloadConfig() {
  const text = exportAll(commonConfigs.value, operationTargets.value, actionGroupRows.value, inputRows.value)
  const blob = new Blob([text], { type: 'application/json' })

  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'config.json'
  a.click()
  URL.revokeObjectURL(a.href)
}

function handleFile(file: File) {
  return new Promise<void>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        importAll(reader.result as string, commonConfigs, trueDeviceRows, actionGroupRows, inputRows)
        resolve()
      } catch (e) {
        reject(e)
      }
    }
    reader.readAsText(file)
  })
}

</script>

<template>
  <n-layout has-sider style="height: 100vh">
    <n-layout-sider bordered width="220" show-trigger collapse-mode="width" :native-scrollbar="true">
      <div class="sider-wrapper">
        <SidebarMenu />
        <n-button @click="downloadConfig">下载文件</n-button>
        <input type="file" accept=".json" @change="(e) => {
          const file = (e.target as HTMLInputElement).files?.[0]
          file && handleFile(file)
        }" />
      </div>
    </n-layout-sider>

    <n-layout>
      <n-layout-header bordered>
        <h2 style="margin: 0 16px">Laminor2</h2>
      </n-layout-header>
      <n-layout-content style="padding: 24px;">
        <RouterView />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<style scoped>
.sider-wrapper {
  display: flex;
  flex-direction: column;
  height: 90%;
}

/* .sider-bottom-button {
  margin-top: 12px;
  flex-shrink: 0;
} */
</style>
