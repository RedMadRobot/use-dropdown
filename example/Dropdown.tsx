import React, {ChangeEvent, KeyboardEvent, useCallback, useEffect, useMemo, useState} from 'react';
import ReactDOM from 'react-dom';
import {useDropdown, DropdownState, ReducerAction} from '../src';
import './Dropdown.css';

export type Item = {
  name: string;
  value: string;
};

type Props = {
  onSelect: (item: Item) => void;
  value?: Item;
}

const items: Item[] = [
  {
    name: 'NewYork',
    value: 'NewYork'
  },
  {
    name: 'Moscow',
    value: 'Moscow'
  },
  {
    name: 'London',
    value: 'London'
  },
  {
    name: 'Amsterdam',
    value: 'Amsterdam'
  },
];



export const Dropdown: React.FC<Props> = ({onSelect, value}) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleSelect = (item: Item) => {
    setInputValue(item.name);
    onSelect(item);
  }

  const options = useMemo(() => {
    return items.filter(item => item.name.includes(inputValue));
  }, [inputValue])

  const {
    isOpen,
    highlightedIndex,
    getWrapperProps,
    getInputProps,
    getMenuProps,
    getItemProps,
    setOpen,
  } = useDropdown<Item>({items: options, onSelect: handleSelect})

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setOpen(true);

    setInputValue(event.target.value);
    onSelect(undefined);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case 'ArrowDown':
        setOpen(true);
        break;

      // case 'Backspace':
      //   if(inputValue === value?.name) {
      //     onSelect(undefined);
      //   }
      //   break;
    }
  }

  const handleBlur = () => {
    console.log('blur');
    setInputValue('');
  }

  return <div className='wrapper' {...getWrapperProps()} onKeyDown={handleKeyDown} onBlur={handleBlur}>

    <input
      className='input'
      type="text" id="input" {...getInputProps()}
      placeholder='Select city'
      value={inputValue}
      onChange={handleChange}
      autoComplete='off'

    />

    {isOpen &&
      <ul className='menu' {...getMenuProps() as any}>
        {options.length === 0 ?
          <li>No data</li>
        : options.map(
          (item: Item, index) =>
            <li
              key={item.value}
              className={highlightedIndex === index ? 'item active' : 'item'}
              {...getItemProps(item, index)}
            >
              {item.name}
            </li>
          )
        }
      </ul>
    }
  </div>
}
