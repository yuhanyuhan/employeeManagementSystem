import '@testing-library/jest-dom/extend-expect'

import React from 'react'; 
import ReactDOM from 'react-dom'
import {render, fireEvent, screen} from '@testing-library/react'; 
import AddUser from '../AddUser'; 

test('check that the option has 3 options', ()=> {
    const div = document.createElement('div')
    ReactDOM.render(<AddUser />, div)
    expect(div.querySelector('input').type).toBe('text')
})