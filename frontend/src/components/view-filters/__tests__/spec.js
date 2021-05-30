
import React from 'react';
import { render } from '@testing-library/react';
import { HashRouter as Router } from 'react-router-dom';
import { ViewFilters } from '../viewFilters';
describe('filter deviations form component', () => {
  it('Should render (smoke test)', () => {

    const { asFragment } = render(
      <Router>
        <ViewFilters
          filters={{}}
          t={key=>key}
          handleRemoveFilter={() => { }}
        />
      </Router>,
    );
    const firstRender = asFragment();
    expect(firstRender).toMatchSnapshot();
  });
});