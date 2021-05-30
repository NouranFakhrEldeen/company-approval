import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
// import { HashRouter as Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import { Checkbox } from '../checkbox';

let onChange = jest.fn();

describe('testing checkbox', ()=> {
  afterEach(cleanup);

  test('should checkbox checked', () => {
    const { getByTestId } = render(<Checkbox data-testid='checkbox' onChange={()=> onChange()}/>);
    const linkElement = getByTestId('checkbox');
    fireEvent.click(linkElement);
  });

  //   snapshot
  test('should do snapshot', () => {
    const checkboxComp = renderer.create(
      <Checkbox
        onChange={()=> onChange()}
      />
    ).toJSON();
    expect(checkboxComp).toMatchSnapshot();
  });
});

