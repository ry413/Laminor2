// --------------------------------------------------
// src/types.ts
// 整个项目全局共享的类型 & 映射 & 工具
// --------------------------------------------------

// 设备类型
export const DeviceType = {
  LAMP: "lamp",
  CURTAIN: "curtain",
  INFRARED_AIR: "infraredAir",
  SINGLE_AIR: "singleAir",
  RS485: "rs485",
  RELAY: "relay",
  DRY_CONTACT: "dryContact",
  DOORBELL: "doorbell",

  // 预设
  HEARTBEAT: "heartbeat",
  ROOM_STATE: "roomState",
  DELAYER: "delayer",
  ACTION_GROUP_OP: "actionGroupOp",
  SNAPSHOT: "snapshot",
  INDICATOR: "indicator",
} as const;
export type DeviceType = (typeof DeviceType)[keyof typeof DeviceType];
export const DeviceTypeList = [
  DeviceType.LAMP,
  DeviceType.CURTAIN,
  DeviceType.INFRARED_AIR,
  DeviceType.SINGLE_AIR,
  DeviceType.RS485,
  DeviceType.RELAY,
  DeviceType.DRY_CONTACT,
  DeviceType.DOORBELL,
  DeviceType.HEARTBEAT,
  DeviceType.ROOM_STATE,
  DeviceType.DELAYER,
  DeviceType.ACTION_GROUP_OP,
  DeviceType.SNAPSHOT,
  DeviceType.INDICATOR,
];

// 输入类型
export const InputType = {
  PANEL_BTN: "panelBtn",
  DRY_CONTACT: "dryContact",
  VOICE_CMD: "voice_cmd",
} as const;
export type InputType = (typeof InputType)[keyof typeof InputType];
export const InputTypeList = [
  InputType.PANEL_BTN,
  InputType.DRY_CONTACT,
  InputType.VOICE_CMD,
];

// 干接点输入的更细分类型
export const TriggerType = {
  LOW_LEVEL: "lowLevel",
  HIGH_LEVEL: "highLevel",
  INFRARED: "infrared",
  INFRARED_TIMEOUT: "infrared_timeout",
} as const;
export type TriggerType = (typeof TriggerType)[keyof typeof TriggerType];
export const TriggerTypeList = [
  TriggerType.LOW_LEVEL,
  TriggerType.HIGH_LEVEL,
  TriggerType.INFRARED,
  TriggerType.INFRARED_TIMEOUT,
];

// 输入通道的tag
export const InputTag = {
  REMOVE_CARD_USABLE: "removeCardUsable",
  IS_ALIVE_CHANNEL: "isAliveChannel",
  IS_DOOR_CHANNEL: "isDoorChannel",
  IS_DOORBELL_CHANNEL: "isDoorbellChannel",
  IGNORE_ANY_KEY_EXECUTE: "ignoreAnyKeyExecute",
} as const;
export type InputTag = (typeof InputTag)[keyof typeof InputTag];
export const InputTagList = [
  InputTag.REMOVE_CARD_USABLE,
  InputTag.IS_ALIVE_CHANNEL,
  InputTag.IS_DOOR_CHANNEL,
  InputTag.IS_DOORBELL_CHANNEL,
  InputTag.IGNORE_ANY_KEY_EXECUTE,
];

// 房间状态
export const RoomStates = ["入住", "清理", "勿扰", "SOS"];

/* ---------- 各设备 payload 详细结构 ---------- */
export interface LampPayload {
  name: string;
  channel: number;
}

export interface CurtainPayload {
  name: string;
  openChannel: number;
  closeChannel: number;
  runtime: number;
}

export interface InfraredAirPayload {
  name: string;
  airId: number;
}

export interface SingleAirPayload {
  name: string;
  airId: number;
  waterChannel: number;
  lowChannel: number;
  midChannel: number;
  highChannel: number;
}

export interface RS485Payload {
  name: string;
  code: string;
}

export interface RelayPayload {
  name: string;
  channel: number;
}

export interface DryContactPayload {
  name: string;
  channel: number;
}

export interface DoorbellPayload {
  name: string;
  channel: number;
}

// 这些是单例, 不该有负载
export interface HeartbeatPayload {
  name: string;
}

export interface RoomStatePayload {
  name: string;
}

export interface DelayerPayload {
  name: string;
}

export interface ActionGroupOpPayload {
  name: string;
}

export interface SnapshotPayload {
  name: string;
}

export interface IndicatorPayload {
  name: string;
}

/* ---------- 设备类型 → Payload 的映射 ---------- */
export interface DevicePayloadMap {
  [DeviceType.LAMP]: LampPayload;
  [DeviceType.CURTAIN]: CurtainPayload;
  [DeviceType.INFRARED_AIR]: InfraredAirPayload;
  [DeviceType.SINGLE_AIR]: SingleAirPayload;
  [DeviceType.RS485]: RS485Payload;
  [DeviceType.RELAY]: RelayPayload;
  [DeviceType.DRY_CONTACT]: DryContactPayload;
  [DeviceType.DOORBELL]: DoorbellPayload;
  [DeviceType.HEARTBEAT]: HeartbeatPayload;
  [DeviceType.ROOM_STATE]: RoomStatePayload;
  [DeviceType.DELAYER]: DelayerPayload;
  [DeviceType.ACTION_GROUP_OP]: ActionGroupOpPayload;
  [DeviceType.SNAPSHOT]: SnapshotPayload;
  [DeviceType.INDICATOR]: IndicatorPayload;
}

/* ---------- 一些行结构 ---------- */
export interface IDeviceRow<
  T extends keyof DevicePayloadMap = keyof DevicePayloadMap
> {
  did: number;
  type: T;
  payload: DevicePayloadMap[T];
  carryState: string | null;
  linkDids: number[];
  repelDids: number[];
}

export interface IActionGroupRow {
  name: string;
  aid: number;
  isMode: boolean;
  actions: IActionRow[];
}

export interface IActionRow {
  // aid: number;
  targetId: number; // 指向某 DeviceRow.id
  operation: string;
  parameter: any;
}

export interface IInputRow {
  name: string;
  iid: number;
  type: InputType;
  actionRounds: IActionRow[][];
  tags: InputTag | null;
  // 只对面板按键类型有效
  pid: number;
  bid: number;
  lightBindDid: number | null;

  // 只对干接点输入类型有效, 其中infraredDuration只在输入为红外时有效
  channel: number;
  triggerType: TriggerType;
  infraredDuration: number;

  // 只对语音指令有效
  code: string;
}

/* ---------- 默认 payload 工厂 ---------- */
export function createDefaultDevicePayload<T extends keyof DevicePayloadMap>(
  type: T
): DevicePayloadMap[T] {
  switch (type) {
    case DeviceType.LAMP:
      return { name: "", channel: 127 } as DevicePayloadMap[T];
    case DeviceType.CURTAIN:
      return {
        name: "",
        openChannel: 127,
        closeChannel: 127,
        runtime: 10,
      } as DevicePayloadMap[T];
    case DeviceType.INFRARED_AIR:
      return { name: "", airId: 0 } as DevicePayloadMap[T];
    case DeviceType.SINGLE_AIR:
      return {
        name: "",
        airId: 0,
        waterChannel: 127,
        lowChannel: 127,
        midChannel: 127,
        highChannel: 127,
      } as DevicePayloadMap[T];
    case DeviceType.RS485:
      return { name: "", code: "" } as DevicePayloadMap[T];
    case DeviceType.RELAY:
      return { name: "", channel: 127 } as DevicePayloadMap[T];
    case DeviceType.DRY_CONTACT:
      return { name: "", channel: 127 } as DevicePayloadMap[T];
    case DeviceType.HEARTBEAT:
      return { name: "更改心跳包" } as DevicePayloadMap[T];
    case DeviceType.ROOM_STATE:
      return { name: "房间状态操作" } as DevicePayloadMap[T];
    case DeviceType.DELAYER:
      return { name: "延时" } as DevicePayloadMap[T];
    case DeviceType.ACTION_GROUP_OP:
      return { name: "模式操作" } as DevicePayloadMap[T];
    case DeviceType.SNAPSHOT:
      return { name: "房间状态快照" } as DevicePayloadMap[T];
    default:
      return {} as DevicePayloadMap[T];
  }
}

/* ---------- ID生成器 ---------- */

let deviceId = 0;
export function getDeviceId() {
  return ++deviceId;
}

export function upMaxDid(val: number) {
  deviceId = Math.max(deviceId, val);
}

let actionGroupId = 0;
export function getActionGroupId() {
  return ++actionGroupId;
}

export function upMaxAgid(val: number) {
  actionGroupId = Math.max(actionGroupId, val);
}

let inputId = 0;
export function getInputId() {
  return ++inputId;
}

export function upMaxiid(val: number) {
  inputId = Math.max(inputId, val);
}

export function getDeviceType(id: number, devices: IDeviceRow[]) {
  const dev = devices.find((d) => d.did === id);
  return dev?.type as DeviceType | undefined;
}
