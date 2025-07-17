import { createMemoryHistory, createRouter, type RouteRecordRaw } from 'vue-router'

import HomeView from '../components/HomeView.vue'
import DevicesView from '../components/DevicesView.vue'
import InputsView from '../components/InputsView.vue'
import ActionGroupView from '../components/ActionGroupView.vue'


const routes: Array<RouteRecordRaw> = [
  { path: '/', component: HomeView },
  { path: '/devices', component: DevicesView },
  { path: '/inputs', component: InputsView},
  { path: '/actionGroups', component: ActionGroupView},
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router