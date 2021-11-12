import React, { useState } from 'react';

import { Meta } from '@storybook/react';

import { Dropdown, Item } from '../example/Dropdown';

export default {
  title: 'Components/Dropdown',
  component: Dropdown,
} as Meta;



export const Basic = () => {
  const [value, setValue] = useState<Item>();

  const onSelect = (item: Item) => {
    console.log(item);
    setValue(item);
  }

  return (
  <>
    <Dropdown onSelect={onSelect} value={value} />
    {value?.name}
  </>);
}

