import React, {useCallback, useEffect, useMemo, useReducer, useRef} from 'react';
import {reducer} from './reducer';
import {StateChangeType} from './stateChangeType';
import {DropdownState} from './types/DropdownState';
import {ReducerAction} from './types/ReducerAction';
import {mergeReducers} from './utils/mergeReducers';
import {useEvent} from './useEvent';
import {findScrollContainers} from './utils/findScrollContainers';
import {isElementInvisible} from './utils/isElementInvisible';

type MenuWidth = Pick<CSSStyleDeclaration, 'width'> | 'wrapper';

export enum Direction {
  DOWN = 'down',
  UP = 'up',
}

export enum Side {
  LEFT = 'left',
  RIGHT = 'right',
}

type UseDropdownOptions<TItem> = {
  onSelect: (item: TItem) => void;
  items: Array<TItem>;
  reducer?(state: DropdownState, action: ReducerAction<TItem>): void;
  autoScroll?: boolean;
  root?: HTMLElement;
  direction?: Direction;
  side?: Side;
};

type GetMenuPropsResult = {
  onMouseLeave: () => void;
  style: Partial<CSSStyleDeclaration>;
  ref: React.RefObject<any>;
};

type GetMenuPropsOptions = {
  width?: MenuWidth;
};

type GetPositionOptions = {
  width?: MenuWidth;
  autoScroll?: boolean;
}

const initialState = {
  isOpen: false,
  highlightedIndex: -1,
  inputValue: ''
};

const defaultMenuOptions: GetPositionOptions = {
  width: 'wrapper'
}

export const useDropdown = <TItem>(props: UseDropdownOptions<TItem>) => {
  const {
    items,
    onSelect,
    autoScroll = false,
    direction = Direction.DOWN,
    side = Side.LEFT,
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
  const isIOS = typeof navigator !== 'undefined' && /(iPad|iPhone|iPod)/g.test(navigator.userAgent);

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

  const handleBlur = () => {
    setTimeout(() => setOpen(false), 100);
  }

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

  const getPosition = useCallback((options?: GetPositionOptions): Partial<CSSStyleDeclaration> => {
    if (!wrapperRef.current) return {};

    const wrapperRect = wrapperRef.current.getBoundingClientRect();

    options = {
      ...defaultMenuOptions,
      ...options,
    }

    const width = options.width === 'wrapper' ? `${wrapperRect.width}px` : options.width;
    const top = wrapperRect.top + wrapperRect.height + (autoScroll ? 0 : window.scrollY);

    let transform = direction === Direction.DOWN
      ? ''
      : `translateY(-100%) translateY(-${wrapperRect.height}px)`;

    if (side === Side.RIGHT) {
      transform = `${transform} translateX(-100%)`
    }

    const horizontalPosition = side === Side.LEFT
      ? {left: `${wrapperRect.left}px`}
      : {left: `${wrapperRect.right}px`};

    return {
      top: `${top}px`,
      ...horizontalPosition,
      width: `${width}`,
      willChange: 'top, left, width',
      transform,
    };
  }, [wrapperRef, menuRef.current]);

  const setPosition = useCallback(() => {
    if (wrapperRef.current) {
      const parents = findScrollContainers(wrapperRef.current);
      const isInvisible = isElementInvisible(wrapperRef.current, parents);

      if (isInvisible) {
        setOpen(false);
      }
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
        dispatch({type: StateChangeType.KEY_PRESS_ESC});
        break;
      case 'Backspace':
        dispatch({type: StateChangeType.KEY_PRESS_BACKSPACE});
        break;
      case 'Enter':
        dispatch({type: StateChangeType.KEY_PRESS_ENTER, item: items[highlightedIndex], inputValue });
        if (highlightedIndex !== -1) {
          onSelect(items[highlightedIndex]);
          dispatch({type: StateChangeType.ITEM_CLICK, item: items[highlightedIndex]});
        }
        break;
    }
  }, [highlightedIndex, isOpen, onSelect]);

  useEvent(parents, 'scroll', setPosition, true, autoScroll && isOpen);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown, true);
      window.addEventListener('resize', setPosition);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('resize', setPosition);
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
      onBlur: handleBlur,
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

  const getMenuProps = useCallback((options?: GetMenuPropsOptions): GetMenuPropsResult => {
    return {
      onMouseLeave: handleMenuMouseLeave,
      style: {
        position: autoScroll ? 'fixed' : 'absolute',
        ...getPosition(options),
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
    setPosition,
  };
};
