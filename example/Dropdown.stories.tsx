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
  <div style={{height: "100vh",display: "flex", flexDirection: "column"}}>
    <div style={{height: '100%',padding: "600px 0", flexGrow: 1, border: "1px solid #ccc"}}>
      <Dropdown items={items} />
    </div>
  </div>
)
