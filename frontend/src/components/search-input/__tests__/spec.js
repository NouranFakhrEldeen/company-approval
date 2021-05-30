
import React from 'react';
import { render } from '@testing-library/react';
import { HashRouter as Router } from 'react-router-dom';
import { SearchInput } from '../component';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key }),
}));


describe('filter deviations form component', () => {
  it('Should render (smoke test)', () => {

    const { asFragment } = render(
      <Router>
        <SearchInput
          className='padding-5'
          placeholder=''
          t={key=>key}
          handleSearch={() => { }}
          timeout={1000} />
      </Router>,
    );
    const firstRender = asFragment();
    expect(firstRender).toMatchSnapshot();
  });
});