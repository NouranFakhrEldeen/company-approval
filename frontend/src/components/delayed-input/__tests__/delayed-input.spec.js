import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
// import { HashRouter as Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { DelayedInput } from '../delayed-input';

let onChange = jest.fn();

describe('testing delayed input', ()=>{
  afterEach(cleanup);


  test('should checkbox checked', () => {
    const { getByTestId } = render(<DelayedInput data-testid='delayed-input-it' onChange={()=> onChange()}/>);
    const input = getByTestId('delayed-input-it');
    fireEvent.change(input, { target: { value: '23' } });
    expect(input.value).toBe('23');
  });

  //   snapshot
  test('should do snapshot', () => {
    const datePicker = renderer.create(
      <DelayedInput
        onChange={()=> onChange()}
      />
    ).toJSON();
    expect(datePicker).toMatchSnapshot();
  });

});