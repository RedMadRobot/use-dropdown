import {StateChangeType} from "../stateChangeType";

export type ReducerAction<T = unknown> = {
  type: StateChangeType;
  [key: string]: any;
} | {
  type: StateChangeType.INPUT_CHANGE,
  inputValue: string;
} | {
  type: StateChangeType.KEY_PRESS_ENTER,
  item: T,
  inputValue: string;
}
