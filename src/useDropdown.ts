import React, {CSSProperties, useMemo} from 'react';
import {useCallback, useReducer, useRef, useEffect} from 'react';
import {reducer} from './reducer';
import {StateChangeType} from './stateChangeType';
import {DropdownState} from './types/DropdownState';
import {ReducerAction} from './types/ReducerAction';
import {mergeReducers} from './utils/mergeReducers';
import {useEvent} from './useEvent';
import {findScrollContainers} from './utils/findScrollContainers';
import {isElementInvisible} from './utils/isElementInvisible';

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
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<any | null>(null);
  const [state, dispatch] =
    useReducer<React.Reducer<DropdownState, ReducerAction>>(mergeReducers(reducer, props.reducer), initialState);
  const {
    isOpen,
    highlightedIndex,
    inputValue,
  } = state;
  const parents = useMemo(() => findScrollContainers(wrapperRef.current), [wrapperRef.current]);

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
    if (!wrapperRef.current) return {};
    const wrapperRect = wrapperRef.current.getBoundingClientRect();

    return {
      top: `${wrapperRect.top + 5 + root.scrollTop}px`,
      left: `${wrapperRect.left}px`,
      width: 'auto',
      willChange: 'top, left, width',
    };
  }, [wrapperRef, menuRef.current]);

  const setPosition = useCallback(() => {
    const isInvisible = isElementInvisible(wrapperRef.current, parents);

    if (isInvisible) {
      setOpen(false);
    }

    if (menuRef.current) {
      const {top, left, transform} = getPosition();

      menuRef.current.style.top = top;
      menuRef.current.style.left = left;
      menuRef.current.style.transform = transform;
      menuRef.current.style.visibility = 'visible';
    }
  }, [parents]);

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


  useEvent([window, ...parents], 'scroll', setPosition, false, isOpen);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown, true);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen, handleKeyDown]);

  const getWrapperProps = () => {
    return {
      ref: wrapperRef,
    };
  };

  const getInputProps = () => {
    return {
      onChange,
      onFocus: handleInputFocus,
      onClick: handleInputFocus,
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
        position: 'fixed',
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
