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

export const popup = () => (
  <div style={{height: "100vh",display: "flex", flexDirection: "column"}}>
    <div style={{maxHeight: '200px', padding: "600px 50px", flexGrow: 1, border: "1px solid #000"}}>
      <div style={{height: '300px', padding: '10px', border: '1px solid red', overflow: 'auto'}}>
        <div style={{height: '250px', border: '1px solid green', overflow: 'auto', padding: '100px'}}>
          <Dropdown items={items} />
          <div style={{height: '600px'}}></div>
        </div>
        <div style={{height: '500px'}}></div>
      </div>
    </div>
  </div>
)
