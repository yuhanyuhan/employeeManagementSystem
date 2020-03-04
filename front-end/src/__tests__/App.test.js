import React from 'react';
import { render } from '@testing-library/react';
import App from '../App';

test('Dummy test', () => {
  expect(true).toBeTruthy()
})

test('renders without crashing', ()=>{
   render(<App/>); 
})

// test('renders learn react link', () => {
//   const container = document.body
//   const dialogContainer = getByRole(container, 'App')
// });
