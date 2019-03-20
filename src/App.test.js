import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Calculator from './App';

//https://facebook.github.io/create-react-app/docs/running-tests
//https://stackoverflow.com/questions/39986178/testing-react-target-container-is-not-a-dom-element

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Calculator />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('hi', () => {
  expect(1+1).toEqual(2);
})