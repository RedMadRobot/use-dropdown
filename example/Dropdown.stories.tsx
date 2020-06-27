import React from 'react';
import {Dropdown} from './Dropdown';

const items = [
  {label: 'Orange', value: 'orange'},
  {label: 'Banana', value: 'banana'},
  {label: 'Apple', value: 'apple'}
]

export default {
  component: Dropdown,
  title: 'Dropdown example'
}

export const basic = () => (
  <div style={{padding: "1500px 0"}}>
    <Dropdown items={items} />
  </div>
)
