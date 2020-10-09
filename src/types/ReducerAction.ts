import {StateChangeType} from "../stateChangeType";

export type ReducerAction = {
  type: StateChangeType;
  [key: string]: any;
};
