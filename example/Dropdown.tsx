import React from 'react';
import ReactDOM from 'react-dom';
import {useDropdown} from '../src';
import './Dropdown.css';

type Option = {
  label: string;
  value: string;
}

type DropdownProps = {
  items: Array<Option>;
}

export const Dropdown = ({items}) => {
  const {
    isOpen,
    getInputProps,
    getInputWrapperProps,
    getItemProps,
    getMenuProps,
  } = useDropdown({
    onSelect: () => console.log('select'),
    items,
  })

  return (
    <div>
      <div {...getInputWrapperProps()}>
        <input type="text" {...getInputProps()} />
      </div>
      {
        isOpen && (
          ReactDOM.createPortal(
            <ul className="menu" {...getMenuProps()}>
              {
                items.map((item, index) => (
                  <li {...getItemProps(item, index)}>{item.label}</li>
                ))
              }
            </ul>,
            document.body
          )

        )
      }
    </div>
  )
}
