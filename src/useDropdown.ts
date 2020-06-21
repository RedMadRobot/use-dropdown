import React from 'react';
import {useCallback, useReducer, useRef, useEffect} from 'react';
import {reducer} from './reducer';
import {StateChangeType} from './stateChangeType'
import {DropdownState} from './types/DropdownState';
import {ReducerAction} from './types/ReducerAction';
import {mergeReducers} from './utils/mergeReducers'

type UseDropdownOptions<TItem> = {
  onSelect: (item: TItem) => void;
  items: Array<TItem>;
  reducer?(state: DropdownState, action: ReducerAction): void;
  root?: any;
};

type GetMenuPropsResult = {
  onMouseLeave: () => void;
  style: React.CSSProperties;
  ref: React.RefObject<any>;
};

const initialState = {
  isOpen: false,
  highlightedIndex: -1,
  inputValue: '',
};

export const useDropdown = <TItem>(props: UseDropdownOptions<TItem>) => {
  const {
    items,
    onSelect,
  } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputWrapperRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLElement | null>(null);
  const [state, dispatch] =
    useReducer<React.Reducer<DropdownState, ReducerAction>>(mergeReducers(reducer, props.reducer), initialState);
  const {
    isOpen,
    highlightedIndex,
    inputValue,
  } = state;

  const onChange = useCallback(ev => {
    const inputValue = ev.target.value;
    dispatch({type: StateChangeType.INPUT_CHANGE, inputValue});
  }, []);

  const onMouseEnter = ev => {
    setHighlightedIndex(parseInt(ev.target.dataset.index));
  };

  const handleMenuMouseLeave = () => {
    dispatch({type: StateChangeType.SET_HIGHLIGHTED_INDEX, highlightedIndex: -1});
  };

  const handleInputFocus = () => {
    setOpen(true);
  };

  const handleItemClick = ev => {
    const index = ev.target.dataset.index;
    const item = items[index];
    onSelect(item);
    dispatch({
      type: StateChangeType.ITEM_CLICK,
      item,
    });
  };

  const setHighlightedIndex = (highlightedIndex: number) => {
    dispatch({
      type: StateChangeType.SET_HIGHLIGHTED_INDEX,
      highlightedIndex,
    });
  };

  const setOpen = (isOpen: boolean) => {
    dispatch({
      type: StateChangeType.SET_OPEN,
      isOpen,
    });
  };

  const setInputValue = (value: string) => {
    dispatch({
      type: StateChangeType.INPUT_CHANGE,
      inputValue: value,
    });
  };

  const getPosition = useCallback(() => {
    if (!inputWrapperRef.current) return {};
    const wrapper = inputWrapperRef.current;
    const wrapperRect = wrapper.getBoundingClientRect();

    return {
      top: `${wrapperRect.y + wrapperRect.height}px`,
      left: `${wrapperRect.x}px`,
      width: `${wrapperRect.width}px`,
    };
  }, [inputWrapperRef]);

  const handleScroll = useCallback(() => {
    window.requestAnimationFrame(() => {
      if (menuRef.current) {
        const {top, left} = getPosition();
        menuRef.current.style.top = top;
        menuRef.current.style.left = left;
      }
    });
  }, []);

  const handleKeyDown = useCallback((ev: KeyboardEvent) => {
    console.log(ev.key)
    switch (ev.key) {
      case 'ArrowDown':
        dispatch({type: StateChangeType.KEY_PRESS_DOWN, items});
        break;
      case 'ArrowUp':
        dispatch({type: StateChangeType.KEY_PRESS_UP, items});
        break;
      case 'Escape':
        dispatch({type: StateChangeType.KEY_PRES_ESC});
        break;
      case 'Enter':
        if (highlightedIndex !== -1) {
          dispatch({type: StateChangeType.ITEM_CLICK, item: items[highlightedIndex]});
        }
        break;
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('keydown', handleKeyDown, true);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('keydown', handleKeyDown, true);
    }
  }, [isOpen]);

  const getInputWrapperProps = () => {
    return {
      ref: inputWrapperRef,
    };
  };

  const getInputProps = () => {
    return {
      onChange,
      onFocus: handleInputFocus,
      value: inputValue,
      ref: inputRef,
    };
  };

  const getItemProps = (_item: TItem, index: number) => {
    return {
      onMouseEnter,
      'data-index': index,
      onClick: handleItemClick,
    };
  };

  const getMenuProps = (): GetMenuPropsResult => {
    return {
      onMouseLeave: handleMenuMouseLeave,
      style: {
        position: 'fixed',
        ...getPosition(),
      },
      ref: menuRef,
    };
  };

  return {
    getInputWrapperProps,
    getInputProps,
    getItemProps,
    getMenuProps,
    isOpen,
    highlightedIndex,
    setHighlightedIndex,
    setOpen,
    inputValue,
    setInputValue,
  };
};
