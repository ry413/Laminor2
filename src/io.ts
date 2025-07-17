// --------------------------------------------------
// io.ts  —— 设备 / 输入 正反序列化
// --------------------------------------------------
import type { Ref } from "vue";
import {
  DeviceType,
  DeviceTypeList,
  type IActionGroupRow,
  type IActionRow,
  type IDeviceRow,
  type IInputRow,
  InputType,
  InputTypeList,
} from "./types.ts";

const deviceExportMap: Record<DeviceType, Record<string, string>> = {
  lamp: { name: "n", channel: "ch" },
  curtain: { name: "n", openChannel: "oc", closeChannel: "cc", runtime: "rt" },
  infraredAir: { name: "n", airId: "aid" },
  singleAir: {
    name: "n",
    airId: "aid",
    waterChannel: "wc",
    lowChannel: "lc",
    midChannel: "mc",
    highChannel: "hc",
  },
  rs485: { name: "n", code: "cd" },
  relay: { name: "n", channel: "ch" },
  dryContact: { name: "n", channel: "ch" },
  heartbeat: { name: "n" },
  roomState: { name: "n" },
  delayer: { name: "n" },
  actionGroupOp: { name: "n" },
};

const deviceImportMap: Record<
  DeviceType,
  Record<string, string>
> = Object.fromEntries(
  Object.entries(deviceExportMap).map(([k, v]) => [
    k,
    Object.fromEntries(Object.entries(v).map(([k2, v2]) => [v2, k2])),
  ])
) as Record<DeviceType, Record<string, string>>;

// 设备正反序列化
export function serializeDevices(devices: IDeviceRow[]): any[] {
  return devices.map((device) => {
    const map = deviceExportMap[device.type];
    const transformed: Record<string, any> = {
      did: device.did,
      type: DeviceTypeList.indexOf(device.type),
      ...(device.carryState ? { ct: device.carryState } : {}),
    };
    for (const k in device.payload) {
      const val = (device.payload as Record<string, any>)[k];
      const mappedKey = map[k] ?? k;
      transformed[mappedKey] = val;
    }
    return transformed;
  });
}

export function deserializeDevices(json: any[]): IDeviceRow[] {
  return json.flatMap((o) => {
    const did = o.did as number;
    const type = DeviceTypeList[o.type];
    const carryState = Object.prototype.hasOwnProperty.call(o, "ct")
      ? o.ct
      : null;

    // 跳过不想处理的类型
    if (
      type === DeviceType.HEARTBEAT ||
      type === DeviceType.ROOM_STATE ||
      type === DeviceType.DELAYER ||
      type === DeviceType.ACTION_GROUP_OP
    )
      return [];

    const map = deviceImportMap[type];
    const payload: Record<string, any> = {};
    for (const k in o) {
      if (k === "did" || k === "type") continue;
      payload[map[k] ?? k] = o[k];
    }
    return [{ did, type, carryState, payload } as IDeviceRow];
  });
}

// 动作组正反序列化
export function serializeActionGroups(actionGroups: IActionGroupRow[]): any[] {
  return actionGroups.map((actionGroup) => ({
    n: actionGroup.name,
    aid: actionGroup.aid,
    m: actionGroup.isMode,
    a: actionGroup.actions.map((act) => ({
      t: act.targetId,
      o: act.operation,
      ...(act.parameter === '' || act.parameter == null ? {} : { p: act.parameter })
    })),
  }));
}

export function deserializeActionGroups(json: any[]): IActionGroupRow[] {
  return json.map((o) => ({
    name: o.n,
    aid: o.aid,
    isMode: o.m,
    actions: o.a.map(
      (a: any) =>
        ({
          targetId: a.t,
          operation: a.o,
          parameter: Object.prototype.hasOwnProperty.call(a, "p") ? a.p : null,
        } as IActionRow)
    ),
  }));
}

// 输入正反序列化
export function serializeInputs(inputs: IInputRow[]): any[] {
  return inputs.map((input) => {
    const base = {
      n: input.name,
      iid: input.iid,
      type: InputTypeList.indexOf(input.type),
      a: input.actionRounds.map((actRound) =>
        actRound.map((act) => ({
          t: act.targetId,
          o: act.operation,
          ...(act.parameter === '' || act.parameter == null ? {} : { p: act.parameter })
        }))
      ),
      ...(input.tags.length === 0 ? {} : { tg: input.tags }),
    };

    if (input.type === InputType.PANEL_BTN) {
      return {
        ...base,
        pid: input.pid,
        bid: input.bid,
      };
    } else if (input.type === InputType.DRY_CONTACT) {
      const temp = {
        ...base,
        ch: input.channel,
        tt: input.triggerType,
      };
      if (temp.tt === 2) {
        // 红外触发
        return {
          ...temp,
          du: input.infraredDuration,
        };
      } else {
        // 高低电平与红外超时
        return temp;
      }
    }

    return base; // fallback
  });
}

export function deserializeInputs(json: any[]): IInputRow[] {
  return json.map((o) => {
    const base: Partial<IInputRow> = {
      name: o.n,
      type: InputTypeList[o.type],
      iid: o.iid,
      actionRounds: o.a.map((round: any[]) =>
        round.map((act: any) => ({
          targetId: act.t,
          operation: act.o,
          parameter: Object.prototype.hasOwnProperty.call(act, "p")
            ? act.p
            : null,
        }))
      ),
      tags: Object.prototype.hasOwnProperty.call(o, "tg") ? o.tg : [],
    };

    if (base.type === InputType.PANEL_BTN) {
      base.pid = o.pid;
      base.bid = o.bid;
    } else if (base.type === InputType.DRY_CONTACT) {
      base.channel = o.ch;
      base.triggerType = o.tt;
      if (base.triggerType === 2) {
        // 红外检查
        base.infraredDuration = o.du;
      }
    }

    return base as IInputRow;
  });
}

export function exportAll(
  commonConfigs: Ref,
  devs: IDeviceRow[],
  actionGroups: IActionGroupRow[],
  inputs: IInputRow[]
) {
  return JSON.stringify({
    c: commonConfigs, // commons
    d: serializeDevices(devs), // devices
    a: serializeActionGroups(actionGroups), // actionGroups
    i: serializeInputs(inputs), // inputs
  });
}

export function importAll(
  jsonStr: string,
  commom: Ref<any>,
  trueDevices: Ref<IDeviceRow[]>,
  actionGroups: Ref<IActionGroupRow[]>,
  inputs: Ref<IInputRow[]>
) {
  const data = JSON.parse(jsonStr);
  commom.value = data.c;
  trueDevices.value = deserializeDevices(data.d || []);
  actionGroups.value = deserializeActionGroups(data.a || []);
  inputs.value = deserializeInputs(data.i || []);
}
