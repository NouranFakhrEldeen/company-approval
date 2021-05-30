import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
// import { HashRouter as Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { Textarea } from '../textarea';

let onChange = jest.fn();

describe('testing textArea', ()=>{
  afterEach(cleanup);


  test('should write in input', () => {
    const { getByTestId } = render(<Textarea data-testid='textArea' onChange={()=> onChange()}/>);
    const input = getByTestId('textArea');
    fireEvent.change(input, { target: { value: '23' } });
    expect(input.value).toBe('23');
  });

  //   snapshot
  test('should do snapshot', () => {
    const textarea = renderer.create(
      <Textarea
        id = {'test'}
        onChange={()=> onChange()}
      />
    ).toJSON();
    expect(textarea).toMatchSnapshot();
  });

});