import React, {useCallback, useRef, useState} from 'react';
import {Dropdown} from '../example/Dropdown';

const items = [
  {label: 'Orange', value: 'orange'},
  {label: 'Banana', value: 'banana'},
  {label: 'Apple', value: 'apple'}
]

export default {
  component: Dropdown,
  title: 'Dropdown example'
}

export const basic = () => {
  const [value, setValue] = useState();
  const handleSelect = useCallback((value) => {
    setValue(value);
  }, []);
  const handleSubmit = useCallback((ev) => {
    console.log('submit!');
    ev.preventDefault()
  }, []);
  return (
    <div style={{height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{height: '100%', padding: '900px 0', display: 'flex', justifyContent: 'center', flexGrow: 1}}>
        <form onSubmit={handleSubmit}>
          <Dropdown items={items} value={value} onChange={handleSelect} root={document.body.parentElement}/>
        </form>
      </div>
    </div>
  )
}

const modalStyles = {
  height: '300px',
  padding: '10px',
  border: '1px solid #ccc',
  overflow: 'scroll',
  background: '#fff',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

export const popup = () => (
  <div style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
    <div style={{padding: '600px 50px', flexGrow: 1, border: '1px solid #000', backgroundColor: 'rgba(0,0,0,0.3)'}}>
      <div style={modalStyles}>
        <Dropdown items={items} autoScroll/>
        <div style={{height: '1200px'}}></div>
      </div>
    </div>
  </div>
)
