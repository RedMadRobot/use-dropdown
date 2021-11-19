import React, { useState } from 'react';

import { Meta } from '@storybook/react';

import { Dropdown, Item } from '../example/MultiSelect/MultiSelect';

export default {
  title: 'Components/Dropdown',
  component: Dropdown,
} as Meta;



export const MultiSelect = () => {
  const [values, setValues] = useState<Item[]>([]);

  const onSelect = (items: Item[]) => {
    setValues(items);
  }

  return (
  <>
    <Dropdown onSelect={onSelect} values={values} />
    {values.map(item => item.name + ' ')}
  </>);
}

