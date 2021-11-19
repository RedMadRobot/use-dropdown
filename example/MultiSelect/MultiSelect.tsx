import React, {ChangeEvent, KeyboardEvent, useMemo, useState} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import {useDropdown} from '../../src';
import './MultiSelect.css';

export type Item = {
  name: string;
  value: string;
};

type Props = {
  onSelect: (items: Item[]) => void;
  values?: Item[];
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
  {
    name: 'Tokyo',
    value: 'Tokyo'
  },
  {
    name: 'Toronto',
    value: 'Toronto'
  },
  {
    name: 'Cape Town',
    value: 'Cape Town'
  },
  {
    name: 'Rio de Janeiro',
    value: 'Rio de Janeiro'
  },
];



export const Dropdown: React.FC<Props> = ({onSelect, values}) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [selectedOptions, setSelected] = useState<Item[]>(values);

  const handleSelect = (item: Item) => {
    if (selectedOptions.some(el => el.value === item.value)) {
      return;
    }

    const newArr = [...selectedOptions, item];
    setSelected(newArr);
    onSelect(newArr);
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
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case 'ArrowDown':
        setOpen(true);
        break;
    }
  }

  const handleBlur = () => {
    setInputValue('');
  }

  const handleCloseClick = (item: Item) => (event) => {
    event.stopPropagation();
    const newArr = selectedOptions.filter(el => el.value !== item.value);
    setSelected(newArr);
    onSelect(newArr);
  }

  return <div className='wrapper' {...getWrapperProps()} onKeyDown={handleKeyDown} onBlur={handleBlur}>

    {selectedOptions.length === 0 ? null :
      selectedOptions.map((item: Item) => {
        return (
          <div className='multivalue' key={item.value}>
            <span className='multivalue-name'>{item.name}</span>
            <button type='button' className='remove' onClick={handleCloseClick(item)} aria-label={`Remove value ${item.name}`}></button>
          </div>)
      })
    }

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
              className={
                classNames('item', {
                  'active': highlightedIndex === index,
                  'selected': selectedOptions.some(el => el.value === item.value),
                })
              }
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
