import { TP_ACTIONS } from "../services/utils/tpConstants";
export type ActionId = (typeof TP_ACTIONS)[keyof typeof TP_ACTIONS];
export interface DataInfo {
  id: string;
  value: string;
}

export interface ActionData {
  type: string;
  pluginId: string;
  actionId: ActionId;
  data: DataInfo[];
}
