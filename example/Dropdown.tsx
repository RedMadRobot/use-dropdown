import React, {useCallback, useEffect} from 'react';
import ReactDOM from 'react-dom';
import {useDropdown, DropdownState, ReducerAction} from '../src';
import './Dropdown.css';

type Option = {
  label: string;
  value: string;
}

type DropdownProps = {
  items: Array<Option>;
  value?: Option;
  onChange?(value: Option): void;
  root?: HTMLElement;
  autoScroll?: boolean;
}
export const Dropdown = ({
  items,
  value,
  onChange = () => {},
  autoScroll,
  root,
}: DropdownProps) => {

  const reducer = (state: DropdownState, action: ReducerAction<Option>) => {
    console.log('Reducer', state, action);
    switch (action.type) {
      default:
        return state;
    }
  }

  const {
    isOpen,
    getInputProps,
    getWrapperProps,
    getItemProps,
    getMenuProps,
    highlightedIndex,
    setOpen,
  } = useDropdown<Option>({
    reducer,
    onSelect: (value: Option) => {
      onChange(value);
    },
    items,
    autoScroll,
    root
  })

  const inputProps = getInputProps();

  const handleInputKeyDown = useCallback((ev: KeyboardEvent) => {
    switch (ev.key) {
      case 'Backspace':
        onChange(null);
    }
  }, []);

  useEffect(() => {
    inputProps.ref.current.addEventListener('keydown', handleInputKeyDown);

    return () => {
      inputProps.ref.current.removeEventListener('keydown', handleInputKeyDown);
    }
  }, [inputProps]);

  const toggle = useCallback(() => {
    setOpen(!isOpen);
  }, [isOpen])

  return (
    <div>
      <div {...getWrapperProps()} className="wrapper">
        <span>{value?.label}</span>
        <input
          type="text"
          className="input"
          value={value?.label}
          {...inputProps}
        />
        <span onClick={toggle}>{isOpen ? '-' : '+'}</span>
      </div>
      {
        isOpen && (
          ReactDOM.createPortal(
            <ul className="menu" {...getMenuProps()}>
              {
                items.map((item, index) => (
                  <li
                    className={`item ${highlightedIndex === index ? 'active' : ''}`}
                      {...getItemProps(item, index)}>
                    {item.label}
                  </li>
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
