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
  InputTagList,
  InputType,
  InputTypeList,
  TriggerType,
  TriggerTypeList,
  upMaxAgid,
  upMaxDid,
  upMaxiid,
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
  doorbell: { name: "n", channel: "ch" },
  heartbeat: { name: "n" },
  roomState: { name: "n" },
  delayer: { name: "n" },
  actionGroupOp: { name: "n" },
  snapshot: { name: "n" },
  indicator: { name: "n" },
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
      ...(device.linkDids.length > 0 ? { lkds: device.linkDids } : {}),
      ...(device.repelDids.length > 0 ? { rpds: device.repelDids } : {}),
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
    const linkDids = Object.prototype.hasOwnProperty.call(o, "lkds")
      ? o.lkds
      : [];
    const repelDids = Object.prototype.hasOwnProperty.call(o, "rpds")
      ? o.rpds
      : [];

    // 跳过预设的功能设备
    if (
      type === DeviceType.HEARTBEAT ||
      type === DeviceType.ROOM_STATE ||
      type === DeviceType.DELAYER ||
      type === DeviceType.ACTION_GROUP_OP ||
      type === DeviceType.SNAPSHOT ||
      type === DeviceType.INDICATOR
    )
      return [];

    const map = deviceImportMap[type];
    const payload: Record<string, any> = {};
    for (const k in o) {
      if (k === "type") continue;
      else if (k === "did") {
        upMaxDid(o[k]);
      }
      payload[map[k] ?? k] = o[k];
    }
    return [
      { did, type, carryState, linkDids, repelDids, payload } as IDeviceRow,
    ];
  });
}

// 动作组正反序列化
export function serializeActionGroups(actionGroups: IActionGroupRow[]): any[] {
  return actionGroups.map((actionGroup) => ({
    n: actionGroup.name,
    aid: actionGroup.aid,
    m: actionGroup.isMode,
    a: actionGroup.actions.map((act) => {
      const param = act.parameter;
      return {
        t: act.targetId,
        o: act.operation,
        ...(param === "" || param == null
          ? {}
          : typeof param === "string" ||
            typeof param === "number" ||
            typeof param === "boolean"
          ? { p: String(param) }
          : {}),
      };
    }),
  }));
}

export function deserializeActionGroups(json: any[]): IActionGroupRow[] {
  return json.flatMap((o) => {
    const aid = o.aid as number;
    upMaxAgid(aid);

    const name = o.n;
    const isMode = o.m;

    const actions: IActionRow[] = o.a.map((a: any) => ({
      targetId: a.t,
      operation: a.o,
      parameter: Object.prototype.hasOwnProperty.call(a, "p") ? a.p : null,
    }));

    return [
      {
        name,
        aid,
        isMode,
        actions,
      } as IActionGroupRow,
    ];
  });
}

// 输入正反序列化
export function serializeInputs(inputs: IInputRow[]): any[] {
  return inputs.map((input) => {
    const base = {
      n: input.name,
      iid: input.iid,
      type: InputTypeList.indexOf(input.type),
      a: input.actionRounds.map((actRound) =>
        actRound.map((act) => {
          const param = act.parameter;
          return {
            t: act.targetId,
            o: act.operation,
            ...(param === "" || param == null
              ? {}
              : typeof param === "string" ||
                typeof param === "number" ||
                typeof param === "boolean"
              ? { p: String(param) }
              : {}),
          };
        })
      ),
      ...(input.tags ? { tg: InputTagList.indexOf(input.tags!) } : {}),
    };

    if (input.type === InputType.PANEL_BTN) {
      return {
        ...base,
        pid: input.pid,
        bid: input.bid,
        ...(input.lightBindDid ? { lbd: input.lightBindDid } : {}),
      };
    } else if (input.type === InputType.DRY_CONTACT) {
      const temp = {
        ...base,
        ch: input.channel,
        tt: TriggerTypeList.indexOf(input.triggerType),
      };
      if (temp.tt === TriggerTypeList.indexOf(TriggerType.INFRARED)) {
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
      tags: Object.prototype.hasOwnProperty.call(o, "tg")
        ? InputTagList[o.tg]
        : null,
    };
    upMaxiid(base.iid!);

    if (base.type === InputType.PANEL_BTN) {
      base.pid = o.pid;
      base.bid = o.bid;
      base.lightBindDid = Object.prototype.hasOwnProperty.call(o, "lbd")
        ? o.lbd
        : null;
    } else if (base.type === InputType.DRY_CONTACT) {
      base.channel = o.ch;
      base.triggerType = TriggerTypeList[o.tt];
      if (base.triggerType === TriggerType.INFRARED) {
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
  return [
    JSON.stringify({ type: "Laminor2" }),
    JSON.stringify({ tm: new Date().toISOString().slice(0, 10) }),
    JSON.stringify({ c: commonConfigs }),
    JSON.stringify({ d: serializeDevices(devs) }),
    JSON.stringify({ a: serializeActionGroups(actionGroups) }),
    JSON.stringify({ i: serializeInputs(inputs) }),
  ].join("\n");
}

export function importAll(
  ndjsonStr: string,
  commom: Ref<any>,
  trueDevices: Ref<IDeviceRow[]>,
  actionGroups: Ref<IActionGroupRow[]>,
  inputs: Ref<IInputRow[]>
) {
  const lines = ndjsonStr.trim().split("\n");
  if (lines.length < 2) {
    throw new Error("Invalid NDJSON format: requires at least two lines");
  }

  const tm = JSON.parse(lines[1]);
  const c = JSON.parse(lines[2]);
  const d = JSON.parse(lines[3]);
  const a = JSON.parse(lines[4]);
  const i = JSON.parse(lines[5]);

  commom.value = c.c;
  trueDevices.value = deserializeDevices(d.d || []);
  actionGroups.value = deserializeActionGroups(a.a || []);
  inputs.value = deserializeInputs(i.i || []);
}
