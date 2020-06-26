import React from 'react';
import {renderHook, act} from '@testing-library/react-hooks';
import {useDropdown} from './useDropdown';
import {StateChangeType} from './stateChangeType';

function onSelect() {}

const items = [
  {label: '1', value: 1},
  {label: '2', value: 2},
  {label: '3', value: 3},
]

describe('Commands', () => {
  test('should open menu', () => {
    const {result} = renderHook(() => useDropdown({onSelect, items}));
    act(() => {
      result.current.setOpen(true);
    })
    expect(result.current.isOpen).toBe(true);
  });

  test('should set higlighted index', () => {
    const {result} = renderHook(() => useDropdown({onSelect, items}));
    act(() => {
      result.current.setHighlightedIndex(2);
    })
    expect(result.current.highlightedIndex).toBe(2);
  })
})

describe('Keyboard events', () => {
  test('should navigate list with arrow down key', () => {
    const {result} = renderHook(() => useDropdown({onSelect, items}));
    act(() => {
      result.current.setOpen(true);
    })
    expect(result.current.highlightedIndex).toBe(-1);

    const event = new KeyboardEvent('keydown', {key: 'ArrowDown'});
    act(() => {
      document.dispatchEvent(event);
    })
    expect(result.current.highlightedIndex).toBe(0);

    act(() => {
      document.dispatchEvent(event);
      document.dispatchEvent(event);
      document.dispatchEvent(event);
    })
    expect(result.current.highlightedIndex).toBe(0);
  })

  test('should navigate list with arrow up key', () => {
    const {result} = renderHook(() => useDropdown({onSelect, items}));
    act(() => {
      result.current.setOpen(true);
    })
    expect(result.current.highlightedIndex).toBe(-1);

    const event = new KeyboardEvent('keydown', {key: 'ArrowUp'});
    act(() => {
      document.dispatchEvent(event);
    })
    expect(result.current.highlightedIndex).toBe(2);

    act(() => {
      result.current.setHighlightedIndex(0);
      document.dispatchEvent(event);
    })
    expect(result.current.highlightedIndex).toBe(2);
  })

  test('should select item with Enter key', () => {
    const onSelect = jest.fn();
    const {result} = renderHook(() => useDropdown({onSelect, items}));
    act(() => {
      result.current.setOpen(true);
      result.current.setHighlightedIndex(1);
    });
    act(() => {
      const event = new KeyboardEvent('keydown', {key: 'Enter'});
      document.dispatchEvent(event);
    })

    expect(onSelect).toHaveBeenCalledWith(items[1]);
  })
})

describe('Mouse events', () => {
  test('should change highlightedIndex on mouse enter', () => {
    const {result} = renderHook(() => useDropdown({onSelect, items}));
    const {getItemProps} = result.current;
    const itemProps = getItemProps(items[2], 2);
    const li = document.createElement('li');
    li.addEventListener('mouseenter', itemProps.onMouseEnter);
    li.dataset.index = itemProps['data-index'].toString();

    act(() => {
      const event = new MouseEvent('mouseenter');
      li.dispatchEvent(event);
    })

    const {highlightedIndex} = result.current;
    expect(highlightedIndex).toBe(2);
  });

  test('should open menu on input focus', () => {
    const {result} = renderHook(() => useDropdown({onSelect, items}));
    const {getInputProps} = result.current;
    const inputProps = getInputProps();
    const input = document.createElement('input');
    input.addEventListener('focus', inputProps.onFocus);

    expect(result.current.isOpen).toBe(false);

    act(() => {
      const event = new Event('focus');
      input.dispatchEvent(event);
    });

    expect(result.current.isOpen).toBe(true);
  })
})

describe('reducer', () => {
  test('should call reducer with new index on mouse enter', () => {
    const reducer = jest.fn((state, action) => state);
    const {result} = renderHook(() => useDropdown({onSelect, items, reducer}));
    const {getItemProps} = result.current;
    const itemProps = getItemProps(items[2], 2);
    const li = document.createElement('li');
    li.addEventListener('mouseenter', itemProps.onMouseEnter);
    li.dataset.index = itemProps['data-index'].toString();

    act(() => {
      const event = new MouseEvent('mouseenter');
      li.dispatchEvent(event);
    });

    expect(reducer).toHaveBeenCalledWith(expect.anything(), {
      highlightedIndex: 2,
      type:  StateChangeType.SET_HIGHLIGHTED_INDEX,
    });
  })

  test('should call reducer with new index on mouse leave', () => {
    const reducer = jest.fn((state, action) => state);
    const {result} = renderHook(() => useDropdown({onSelect, items, reducer}));
    const {getMenuProps} = result.current;
    const menuProps = getMenuProps();
    const ul = document.createElement('ul');
    ul.addEventListener('mouseleave', menuProps.onMouseLeave);

    act(() => {
      const event = new MouseEvent('mouseleave');
      ul.dispatchEvent(event);
    });

    expect(reducer).toHaveBeenCalledWith(expect.anything(), {
      highlightedIndex: -1,
      type:  StateChangeType.SET_HIGHLIGHTED_INDEX,
    });
  })
})
