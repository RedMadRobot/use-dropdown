import {StateChangeType} from './stateChangeType';
import {DropdownState} from './types/DropdownState';

export const reducer = (state: DropdownState, action) => {
  const {type} = action;
  let changes = {};

  switch (type) {
    case StateChangeType.ITEM_CLICK:
      changes = {
        isOpen: false,
      };
      break;
    case StateChangeType.INPUT_CHANGE:
      changes = {
        inputValue: action.inputValue,
      };
      break;
    case StateChangeType.SET_HIGHLIGHTED_INDEX:
      changes = {
        highlightedIndex: action.highlightedIndex,
      };
      break;
    case StateChangeType.SET_OPEN:
      changes = {
        isOpen: action.isOpen,
      };
      break;
    case StateChangeType.KEY_PRES_ESC:
      changes = {
        isOpen: false,
      };
      break;
    case StateChangeType.KEY_PRESS_DOWN:
      changes = {
        highlightedIndex: state.highlightedIndex === action.items.length - 1
          ? 0
          : state.highlightedIndex + 1,
      };
      break;
    case StateChangeType.KEY_PRESS_UP:
      changes = {
        highlightedIndex: state.highlightedIndex === 0 || state.highlightedIndex === -1
          ? action.items.length - 1
          : state.highlightedIndex - 1
      }
      break;
  }

  return {
    ...state,
    ...changes,
  };
};
