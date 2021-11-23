import classNames from 'classnames';
import React, { ChangeEvent, KeyboardEvent, useMemo, useState } from 'react';
import { useDropdown } from '../../src';
import './MultiSelect.css';

export type Item = {
  name: string;
  value: string;
};

type Props = {
  onSelect: (items: Item[]) => void;
  values?: Item[];
};

const items: Item[] = [
  {
    name: 'NewYork',
    value: 'NewYork',
  },
  {
    name: 'Moscow',
    value: 'Moscow',
  },
  {
    name: 'London',
    value: 'London',
  },
  {
    name: 'Amsterdam',
    value: 'Amsterdam',
  },
  {
    name: 'Tokyo',
    value: 'Tokyo',
  },
  {
    name: 'Toronto',
    value: 'Toronto',
  },
  {
    name: 'Cape Town',
    value: 'Cape Town',
  },
  {
    name: 'Rio de Janeiro',
    value: 'Rio de Janeiro',
  },
];

export const Dropdown: React.FC<Props> = ({ onSelect, values }) => {
  const [inputValue, setInputValue] = useState<string>('');
  // const [selectedOptions, setSelected] = useState<Item[]>(values);
  const [isFocused, setFocused] = useState<Boolean>(false);

  const handleSelect = (item: Item) => {
    let newOptions = [];
    if (values.some((el) => el.value === item.value)) {
      newOptions = values.filter((el) => el.value !== item.value);
    } else {
      newOptions = [...values, item];
    }

    onSelect(newOptions);
  };

  const options = useMemo(() => {
    return items.filter((item) => item.name.toLowerCase().includes(inputValue.toLowerCase()));
  }, [inputValue]);

  const {
    isOpen,
    highlightedIndex,
    getWrapperProps,
    getInputProps,
    getMenuProps,
    getItemProps,
    setOpen,
  } = useDropdown<Item>({ items: options, onSelect: handleSelect });

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
  };

  const handleCloseClick = (item: Item) => (event) => {
    event.stopPropagation();
    const newArr = values.filter((el) => el.value !== item.value);
    onSelect(newArr);
  };

  const handleBlur = () => {
    setInputValue('');
    setFocused(false);
  };

  const handleFocus = () => {
    setFocused(true);
  };

  return (
    <div
      className="wrapper"
      {...getWrapperProps()}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {values.length === 0
        ? null
        : values.map((item: Item) => {
            return (
              <div className="multivalue" key={item.value}>
                <span className="multivalue-name">{item.name}</span>
                <button
                  type="button"
                  className="remove"
                  onClick={handleCloseClick(item)}
                  tabIndex={isFocused ? 0 : -1}
                  aria-label={`Remove value ${item.name}`}
                ></button>
              </div>
            );
          })}

      <input
        className="input"
        type="text"
        id="input"
        {...getInputProps()}
        placeholder="Select city"
        value={inputValue}
        onChange={handleChange}
        autoComplete="off"
      />

      {isOpen && (
        <ul className="menu" {...(getMenuProps() as any)}>
          {options.length === 0 ? (
            <li>No data</li>
          ) : (
            options.map((item: Item, index) => (
              <li
                key={item.value}
                className={classNames('item', {
                  active: highlightedIndex === index,
                  selected: values.some((el) => el.value === item.value),
                })}
                {...getItemProps(item, index)}
              >
                {item.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};
