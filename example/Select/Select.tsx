import React, { ChangeEvent, KeyboardEvent, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDropdown } from '../../src';
import { Item, items } from '../../stories/items';
import '../styles.css';

type Props = {
  onSelect: (item: Item) => void;
  value?: Item;
};

export const Select: React.FC<Props> = ({ onSelect, value }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleSelect = (item: Item) => {
    setInputValue(item.name);
    onSelect(item);
  };

  const options = useMemo(() => {
    return items.filter((item) => item.name.toLowerCase().includes(inputValue.toLowerCase()));
  }, [inputValue]);

  const {
    isOpen,
    highlightedIndex,
    setHighlightedIndex,
    getWrapperProps,
    getInputProps,
    getMenuProps,
    getItemProps,
    setOpen,
  } = useDropdown<Item>({ items: options, onSelect: handleSelect });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setOpen(true);
    // Need reset highlightedIndex for correct keyDown after filter event
    setHighlightedIndex(-1);

    setInputValue(event.target.value);
    onSelect(undefined);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case 'ArrowDown':
        setOpen(true);
        break;
    }
  };

  return (
    <div className="wrapper" {...getWrapperProps()} onKeyDown={handleKeyDown}>
      <input
        className="input"
        type="text"
        id="search"
        {...getInputProps()}
        placeholder="Select city"
        value={inputValue}
        onChange={handleChange}
        autoComplete="off"
      />

      {isOpen &&
        createPortal(
          <ul className="menu" {...(getMenuProps() as any)}>
            {options.length === 0 ? (
              <li>No data</li>
            ) : (
              options.map((item: Item, index) => (
                <li
                  key={item.value}
                  className={highlightedIndex === index ? 'item active' : 'item'}
                  {...getItemProps(item, index)}
                >
                  {item.name}
                </li>
              ))
            )}
          </ul>,
          document.body
        )}
    </div>
  );
};
