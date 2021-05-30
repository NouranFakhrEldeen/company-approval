import React from 'react';
import renderer from 'react-test-renderer';
import { cleanup } from '@testing-library/react';
// import { HashRouter as Router } from 'react-router-dom';

import { Dropdown } from '../dropdown';

let onChange = jest.fn();

describe('testing dropdown', ()=>{
  afterEach(cleanup);

  const OPTIONS = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];

  //   test('should dropdown Selected', () => {
  //     const { getByTestId } = render(<Select data-testid='dropdown' options={OPTIONS} onChange={()=> onChange()}/>);
  //     const input = getByTestId('dropdown');
  //     fireEvent.change(input, { target: { value: '1' } });
  //     expect(input.value).toBe('chocolate');

  //   });


  //   snapshot
  test('should do snapshot', () => {
    const dropdown = renderer.create(
      <Dropdown
        onChange={()=> onChange()}
        options={OPTIONS}
      />
    ).toJSON();
    expect(dropdown).toMatchSnapshot();
  });

});