import React, {CSSProperties} from 'react';
import {useCallback, useReducer, useRef, useEffect} from 'react';
import {reducer} from './reducer';
import {StateChangeType} from './stateChangeType';
import {DropdownState} from './types/DropdownState';
import {ReducerAction} from './types/ReducerAction';
import {mergeReducers} from './utils/mergeReducers';

type UseDropdownOptions<TItem> = {
  onSelect: (item: TItem) => void;
  items: Array<TItem>;
  reducer?(state: DropdownState, action: ReducerAction): void;
  root?: HTMLElement;
};

type GetMenuPropsResult = {
  onMouseLeave: () => void;
  style: CSSProperties;
  ref: React.RefObject<any>;
};

const initialState = {
  isOpen: false,
  highlightedIndex: -1,
  inputValue: ''
};

export const useDropdown = <TItem>(props: UseDropdownOptions<TItem>) => {
  const {
    items,
    onSelect,
    root = document.body,
  } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const inputWrapperRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<any | null>(null);
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
    const index = ev.currentTarget.dataset.index;
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

  const getPosition = useCallback((): CSSProperties => {
    if (!inputWrapperRef.current) return {};
    const wrapperRect = inputWrapperRef.current.getBoundingClientRect();

    return {
      top: `${wrapperRect.top + wrapperRect.height + root.scrollTop}px`,
      left: `${wrapperRect.left}px`,
      width: `${wrapperRect.width}px`,
      willChange: 'top, left, width',
    };
  }, [inputWrapperRef, menuRef.current]);

  const setPosition = useCallback(() => {
    if (menuRef.current) {
      const {top, left, transform} = getPosition();

      menuRef.current.style.top = top;
      menuRef.current.style.left = left;
      menuRef.current.style.transform = transform;
      menuRef.current.style.visibility = 'visible';
    }
  }, []);

  const handleScroll = useCallback(() => {

  }, []);

  const handleKeyDown = useCallback((ev: KeyboardEvent) => {
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
          onSelect(items[highlightedIndex]);
          dispatch({type: StateChangeType.ITEM_CLICK, item: items[highlightedIndex]});
        }
        break;
    }
  }, [highlightedIndex, isOpen, onSelect]);

  useEffect(() => {
    if (isOpen) {
      // window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('keydown', handleKeyDown, true);
    }

    return () => {
      // window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen, handleKeyDown, handleScroll]);

  const getWrapperProps = () => {
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

  const getMenuProps = useCallback((): GetMenuPropsResult => {
    return {
      onMouseLeave: handleMenuMouseLeave,
      style: {
        position: 'absolute',
        ...getPosition(),
      },
      ref: menuRef,
    };
  }, [menuRef.current]);

  useEffect(() => {
    if (isOpen) {
      setPosition();
    }
  }, [isOpen]);

  return {
    getWrapperProps,
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
