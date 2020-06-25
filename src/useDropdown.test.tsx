import React from 'react';
import {renderHook, act} from '@testing-library/react-hooks';
import {useDropdown} from './useDropdown';

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
  test.only('should change highlightedIndex on mouse enter', () => {
    const {result, rerender} = renderHook(() => useDropdown({onSelect, items}));
    const {getItemProps, highlightedIndex} = result.current;
    const itemProps = getItemProps(items[2], 2);
    const li = document.createElement('li');
    li.addEventListener('mouseenter', itemProps.onMouseEnter);
    li.dataset.index = itemProps['data-index'].toString();

    act(() => {
      const event = new MouseEvent('mouseenter', {
        view: window,
        bubbles: true,
        cancelable: true,
      });

      li.dispatchEvent(event);
    })

    rerender();

    expect(highlightedIndex).toBe(2);
  })
})
