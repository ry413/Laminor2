<script setup lang="ts">
import { ref } from 'vue';
import { actionGroupRows } from './components/ActionGroupView.vue';
import { trueDeviceRows, operationTargets } from './components/DevicesView.vue';
import { commonConfigs } from './components/HomeView.vue';
import { inputRows } from './components/InputsView.vue';
import SidebarMenu from './components/SidebarMenu.vue';
import { exportAll, importAll } from './io';
import mqtt from 'mqtt';

const brokerUrl = import.meta.env.VITE_MQTT_BROKER;
const username = import.meta.env.VITE_MQTT_USERNAME;
const password = import.meta.env.VITE_MQTT_PASSWORD;

let client: mqtt.MqttClient | null = null;

const targetSerialNum = ref("")

function downloadConfig() {
  const text = exportAll(commonConfigs.value, operationTargets.value, actionGroupRows.value, inputRows.value)
  const blob = new Blob([text], { type: 'application/x-ndjson' })

  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'config.ndjson'
  a.click()
  URL.revokeObjectURL(a.href)
}

function sendConfig() {
  console.log('Sending to:', targetSerialNum.value);
  const text = exportAll(commonConfigs.value, operationTargets.value, actionGroupRows.value, inputRows.value);

  client = mqtt.connect(brokerUrl, {
    username, password
  });

  client.on('connect', () => {
    const topicPath = `/XZRCU/DOWN/${targetSerialNum.value}`;
    client?.publish(topicPath, text, { qos: 1 }, () => {
      console.log('MQTT message sent to', topicPath);
      client?.end();
    });
  });

  client.on('error', (err) => {
    console.error('MQTT connection error:', err);
  });
}

async function fetchConfig() {
  if (!targetSerialNum.value) return;
  const reqPayload = '{"type":"GET_FILE"}';

  return new Promise<void>((resolve, reject) => {
    const c = mqtt.connect(brokerUrl, { username, password });

    const upTopic = `/XZRCU/UP/${targetSerialNum.value}`;
    const downTopic = `/XZRCU/DOWN/${targetSerialNum.value}`;

    const timer = setTimeout(() => {
      c.end();
      reject(new Error('MQTT timeout – no response'));
    }, 5000);

    c.on('connect', () => {
      c.subscribe(upTopic, { qos: 1 }, () => {
        c.publish(downTopic, reqPayload, { qos: 1 });
      });
    });

    c.on('message', (_topic, payload) => {
      if (_topic === upTopic) {
        clearTimeout(timer);
        try {
          importAll(payload.toString(), commonConfigs, trueDeviceRows, actionGroupRows, inputRows);
          resolve();
        } catch (e) {
          reject(e);
        } finally {
          c.end();
        }
      }
    });

    c.on('error', err => {
      clearTimeout(timer);
      c.end();
      reject(err);
    });
  });
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
        <n-input :show-button="false" v-model:value="targetSerialNum" placeholder="目标序列号"></n-input>
        <n-button @click="sendConfig">直接发送配置</n-button>
        <n-button @click="downloadConfig">下载文件</n-button>
        <n-button @click="fetchConfig">拉取配置</n-button>
        <input type="file" accept=".ndjson" @change="(e) => {
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
</style>
