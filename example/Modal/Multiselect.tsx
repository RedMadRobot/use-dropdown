import { State } from '@popperjs/core';
import classNames from 'classnames';
import React, { ChangeEvent, KeyboardEvent, useCallback, useMemo, useState } from 'react';
import mergeRefs from 'react-merge-refs';
import { usePopper } from 'react-popper';
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

  const [referenceElement, setReferenceElement] = React.useState(null);
  const [popperElement, setPopperElement] = React.useState(null);

  const reducer = (state: DropdownState, action: ReducerAction) => {
    const { type } = action;

    switch (type) {
      case StateChangeType.ITEM_CLICK:
        return { ...state, isOpen: true };

      default:
        return state;
    }
  };

  const closeModifierFn = useCallback(({ state }: { state: State }) => {
    if (state.attributes.popper['data-popper-reference-hidden']) {
      setOpen(false);
    }
  }, []);

  const popper = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
    strategy: 'fixed',
    modifiers: [
      {
        name: 'close',
        enabled: true,
        phase: 'main',
        fn: closeModifierFn,
      },
    ],
  });
  const { styles, attributes, update } = popper;

  const handleSelect = (item: Item) => {
    let newOptions = [];
    if (value.some((el) => el.value === item.value)) {
      newOptions = value.filter((el) => el.value !== item.value);
    } else {
      newOptions = [...value, item];
    }

    onSelect(newOptions);
    update();
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
  } = useDropdown<Item>({
    items: options,
    onSelect: handleSelect,
    reducer,
    isCustomPositioning: true,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setOpen(true);
    // Need reset highlightedIndex for correct keyDown after filter event
    setHighlightedIndex(-1);

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
      ref={mergeRefs([getWrapperProps().ref, setReferenceElement])}
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
          name="search"
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
      {isOpen && (
        <ul
          className="menu"
          {...(getMenuProps() as any)}
          ref={mergeRefs([getMenuProps().ref, setPopperElement])}
          style={styles.popper}
          {...attributes.popper}
        >
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
        </ul>
      )}
    </div>
  );
};
