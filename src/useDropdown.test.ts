import {renderHook, act} from '@testing-library/react-hooks';
import {useDropdown} from './useDropdown';

function onSelect() {}

const items = [
  {label: '1', value: 1},
  {label: '2', value: 2},
  {label: '3', value: 3},
]

test('should open menu on command', () => {
  const {result} = renderHook(() => useDropdown({onSelect, items}));
  act(() => {
    result.current.setOpen(true);
  })
  expect(result.current.isOpen).toBe(true);
});

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
})

