import React from 'react';
import { cleanup } from '@testing-library/react';
// import { HashRouter as Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import NoResults from '../noResults';


describe('testing no Results', ()=>{
  afterEach(cleanup);


  //   snapshot
  test('should do snapshot', () => {
    const input = renderer.create(
      <NoResults
      />
    ).toJSON();
    expect(input).toMatchSnapshot();
  });

});