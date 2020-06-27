import React from 'react';
import {renderHook, act} from '@testing-library/react-hooks';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {useDropdown} from './useDropdown';
import {StateChangeType} from './stateChangeType';

function onSelect() {}

const items = [
  {label: '1', value: 1},
  {label: '2', value: 2},
  {label: '3', value: 3},
]

describe('Commands', () => {
  let result;

  beforeEach(() => {
    result = renderHook(() => useDropdown({onSelect, items})).result;
  })

  test('should open menu', () => {
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

  test('should change input text', () => {
    act(() => {
      result.current.setInputValue('abc');
    })
    expect(result.current.inputValue).toBe('abc');
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
  const index = 2;
  const item = items[index];
  let reducer;
  let result;
  let itemProps;
  let menuProps;
  let inputProps;

  beforeEach(() => {
    reducer = jest.fn((state) => state);
    result = renderHook(() => useDropdown({onSelect, items, reducer})).result;
    itemProps = result.current.getItemProps(item, index);
    menuProps = result.current.getMenuProps();
    inputProps = result.current.getInputProps();
  });

  test('should dispatch with new index on mouse enter', () => {
    const li = document.createElement('li');
    li.addEventListener('mouseenter', itemProps.onMouseEnter);
    li.dataset.index = itemProps['data-index'].toString();

    act(() => {
      const event = new MouseEvent('mouseenter');
      li.dispatchEvent(event);
    });

    expect(reducer).toHaveBeenCalledWith(expect.anything(), {
      highlightedIndex: index,
      type:  StateChangeType.SET_HIGHLIGHTED_INDEX,
    });
  })

  test('should dispatch with new index on mouse leave', () => {
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
  });

  test('should dispatch on key down', () => {
    act(() => {
      result.current.setOpen(true);
    })

    act(() => {
      const event = new KeyboardEvent('keydown', {key: 'ArrowDown'});
      document.dispatchEvent(event);
    });

    expect(reducer).toHaveBeenLastCalledWith(expect.anything(), {
      type: StateChangeType.KEY_PRESS_DOWN,
      items
    });
  });

  test('should dispatch on key up', () => {
    act(() => {
      result.current.setOpen(true);
    });

    act(() => {
      const event = new KeyboardEvent('keydown', {key: 'ArrowUp'});
      document.dispatchEvent(event);
    });

    expect(reducer).toHaveBeenLastCalledWith(expect.anything(), {
      type: StateChangeType.KEY_PRESS_UP,
      items
    });
  });

  test('should dispatch on Esc', () => {
    act(() => {
      result.current.setOpen(true);
    });

    act(() => {
      const event = new KeyboardEvent('keydown', {key: 'Escape'});
      document.dispatchEvent(event);
    });

    expect(reducer).toHaveBeenLastCalledWith(expect.anything(), {
      type: StateChangeType.KEY_PRES_ESC
    });
  });

  test('should dispatch on input change', () => {
    render(
      <input {...inputProps} role="input"/>
    );

    act(() => {
      const input = screen.getByRole('input');
      userEvent.type(input, 'A');
    });

    expect(reducer).toHaveBeenLastCalledWith(expect.anything(), {
      type: StateChangeType.INPUT_CHANGE,
      inputValue: 'A',
    });
  });

  test('should dispatch on item click', () => {
    render(
      <li {...itemProps} role="item">something</li>
    );

    act(() => {
      const li = screen.getByRole('item');
      userEvent.click(li);
    });

    expect(reducer).toHaveBeenLastCalledWith(expect.anything(), {
      type: StateChangeType.ITEM_CLICK,
      item,
    });
  });
});
