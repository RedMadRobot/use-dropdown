# useDropdown
**useDropdown** is a hook that helps you build a custom
select element that suits needs. It also takes away the pain
of positioning of a dropdown element and repositioning it
on scroll.

## Usage
```typescript jsx
const {
  isOpen,
  highlightedIndex,
  inputValue,
  getInputWrapperProps,
  getInputProps,
  getMenuProps,
  getItemProps,
} = useDropdown<T>({
  items,
  onSelect,
  reducer,
  autoScroll,
  direction,
})
```

### Arguments
`useDropdown` accepts following arguments:

* **items** - `Array<T>`
Menu elements of your dropdown. It is expected that they will
be the same type you passed to `useDropdown` generic

* **onSelect** - `(item: T) => void`
Function which is called each time you click on element or
select it with Enter key

* **reducer**
Using this function you can change how `useDropdown` reacts
to certain events; For example, you can prevent dropdown
from closing after user selects an option

* **autoScroll** - `boolean`
If `true` dropdown will detect scroll of outer containers and will reposition menu accordingly.

* **direction** - `Direction`
Direction in which dropdown should be opened.

 ### State and methods
 `useDropdown` returns it's state and provides methods that
 you should use to build your dropdown:

 * **isOpen** - `boolean`
Current state of dropdown. Use it to decide whether you should
show menu or not

* **highlightedIndex** - `number`
Shows the index of an element that is currently highlighted by
cursor or with arrow keys. Use it to apply styles.

* **inputValue** - `string`
Current value of input.

* **getWrapperProps** - `(): WrapperProps` - _required_
Apply these props to block that represents your dropdown element.
This block will be used to calculate the width of dropdown along
with it's position on the screen.

* **getInputProps** - `(): InputProps` - _optional_
You can use it on your input. This method will help `useDropdown`
to track input's value and it also allows menu to be opened each time
input recieves focus.

* **getMenuProps** - `(): MenuProps` - _required_
Returns props for block element that wraps your menu items. It is
necessary for correct positioning of you dropdown.

* **getItemProps** - `(item: T, index: number) => ItemProps` - _required_
Method for getting props for every item in your items list. Pass
item and it's index to this method.
