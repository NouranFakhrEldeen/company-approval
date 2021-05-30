import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
// import { HashRouter as Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { RadioButtons } from '../radioButtons';

let onChange = jest.fn();
let radioBtnArray = [
  { label: 'yes', value: 'YES', name: 'first' },
  { label: 'no', value: 'NO', name: 'second' },
];
describe('testing delayed input', ()=>{
  afterEach(cleanup);


  //   test('should checkbox checked', () => {
  //     const { getByTestId } = render(<DelayedInput data-testid='delayed-input-it' onChange={()=> onChange()}/>);
  //     const input = getByTestId('delayed-input-it');
  //     fireEvent.change(input, { target: { value: '23' } });
  //     expect(input.value).toBe('23');
  //   });

  test('should test radio buttons', () => {
    const { getByLabelText } = render(
      <form>
        <label>
             First <input type="radio" name="radio1" value="first" />
        </label>
        <label>
            Second <input type="radio" name="radio1" value="second" />
        </label>
      </form>
    );

    const radio = getByLabelText('First');
    fireEvent.change(radio, { target: { value: 'second' } });
    expect(radio.value).toBe('second');
  });


  //   snapshot
  test('should do snapshot', () => {
    const radiobutton = renderer.create(
      <RadioButtons
        disabled={''}
        className='col-12 padding-0'
        name={'answer'}
        value={''}
        options={radioBtnArray}
        onChange={()=> onChange()}
      />
    ).toJSON();
    expect(radiobutton).toMatchSnapshot();
  });

});