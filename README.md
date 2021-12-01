# useDropdown

[Example](https://redmadrobot.github.io/use-dropdown/?path=/docs/examples-select--select)

**useDropdown** is a hook that helps you to build a custom
select element. It also takes away the pain
of positioning of a dropdown element and repositioning it
on scroll.

## Usage

```typescript jsx
import React, {useState} from 'react';
import {useDropdown} from './useDropdown';

const Select = ({value, onChange, items}) => {
  const [input, setInput] = useState('');
  const handleSelect = (value) => {
    onChange(value);
  }

  const {
    isOpen,
    setOpen,
    highlightedIndex,
    getWrapperProps,
    getInputProps,
    getMenuProps,
    getItemProps,
  } = useDropdown({
    items,
    onSelect: handleSelect,
  });

  return (
    <div className='wrapper' {...getWrapperProps()}>
      <input
        {...getInputProps()}
        className='input'
        value={input}
        onChange={(ev) => setInput(ev.target.value)}
      />
      {
        isOpen && createPortal(
          <ul className='menu' {...getMenuProps()}>
            {
              items.map(item, index) => (
                <li
                  key={item.value}
                  className={highlightedIndex === index ? 'item active' : 'item'}
                  {...getItemProps(item, index)}
                >
                  {item.label}
                </li>
              )
            }
          </ul>, document.body
        )
      }
    </div>
  )
}


```

### Arguments

`useDropdown` accepts following arguments:

- **items** - `Array<T>` _required_  
  Menu elements of your dropdown. It is expected that they will
  be the same type you passed to `useDropdown` generic

- **onSelect** - `(item: T) => void` _required_  
  Function which is called each time you click on element or
  select it with Enter key

- **reducer** - `(state: DropdownState, action: ReducerAction) => DropdownState`  
  Using this function you can change how `useDropdown` reacts
  to certain events; For example, you can prevent dropdown
  from closing after user selects an option

- **onClickOutside** - `() => void`  
  Callback which is called when user clicks outside menu or wrapper

- **ResizeObserver**  
  Use it to pass your polyfill for ResizeObserver. By default uses window.ResizeObserver

### State and methods

`useDropdown` returns it's state and provides methods that
you should use to build your dropdown:

- **isOpen** - `boolean`  
  Current state of dropdown. Use it to decide whether you should
  show menu or not

- **highlightedIndex** - `number`  
  Shows the index of an element that is currently highlighted by
  cursor or with arrow keys. Use it to apply styles.

- **inputValue** - `string`  
  Current value of input.

- **getWrapperProps** - `(): WrapperProps` - _required_  
  Apply these props to block that represents your dropdown element.
  This block will be used to calculate the width of dropdown along
  with it's position on the screen.

- **getInputProps** - `(): InputProps` - _optional_  
  You can use it on your input. This method will help `useDropdown`
  to track input's value and it also allows menu to be opened each time
  input recieves focus.

- **getMenuProps** - `(): MenuProps` - _required_  
  Returns props for block element that wraps your menu items. It is
  necessary for correct positioning of you dropdown.

- **getItemProps** - `(item: T, index: number) => ItemProps` - _required_  
  Method for getting props for every item in your items list. Pass
  item and it's index to this method.
