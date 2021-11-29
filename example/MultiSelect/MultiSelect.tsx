import classNames from 'classnames';
import React, { ChangeEvent, KeyboardEvent, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { DropdownState, ReducerAction, StateChangeType, useDropdown } from '../../src';
import { Item } from '../../stories/items';
import '../styles.css';

type Props = {
  onSelect: (items: Item[]) => void;
  value?: Item[];
  items: Item[];
};

export const MultiSelect: React.FC<Props> = ({ onSelect, value = [], items }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const [isFocused, setFocused] = useState<boolean>(false);

  const reducer = (state: DropdownState, action: ReducerAction) => {
    const { type } = action;

    switch (type) {
      case StateChangeType.ITEM_CLICK:
        return { ...state, isOpen: true };

      default:
        return state;
    }
  };

  const handleSelect = (item: Item) => {
    let newOptions = [];
    if (value.some((el) => el.value === item.value)) {
      newOptions = value.filter((el) => el.value !== item.value);
    } else {
      newOptions = [...value, item];
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
  } = useDropdown<Item>({ items: options, onSelect: handleSelect, reducer });

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

  const handleResetClick = (event) => {
    event.stopPropagation();
    onSelect([]);
  };

  const handleRemoveClick = (item: Item) => (event) => {
    event.stopPropagation();
    const newArr = value.filter((el) => el.value !== item.value);
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
      className={classNames('wrapper', { 'wrapper-open': isOpen })}
      {...getWrapperProps()}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <div className="input-wrapper">
        {value.length === 0
          ? null
          : value.map((item: Item) => {
              return (
                <div className="tag" key={item.value}>
                  <span className="multivalue-name">{item.name}</span>
                  <button
                    type="button"
                    className="tag-remove"
                    onClick={handleRemoveClick(item)}
                    tabIndex={isFocused ? 0 : -1}
                    aria-label={`Remove value ${item.name}`}
                  />
                </div>
              );
            })}

        <input
          {...getInputProps()}
          className="input"
          type="text"
          id="search"
          placeholder="Select city"
          value={inputValue}
          onChange={handleChange}
          autoComplete="off"
        />
      </div>
      {value.length === 0 ? null : (
        <button
          className="reset"
          onClick={handleResetClick}
          type="button"
          aria-label="Clear all values"
        />
      )}
      <span className={isOpen ? 'toggle open' : 'toggle'} />
      {isOpen &&
        createPortal(
          <ul className="menu" {...(getMenuProps() as any)}>
            {options?.length === 0 ? (
              <li>No data</li>
            ) : (
              options.map((item: Item, index) => (
                <li
                  key={item.value}
                  className={classNames('item', {
                    active: highlightedIndex === index,
                    selected: value.some((el) => el.value === item.value),
                  })}
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
