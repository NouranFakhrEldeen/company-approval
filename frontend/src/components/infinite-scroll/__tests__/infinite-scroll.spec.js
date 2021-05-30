import React from 'react';

// import renderer from 'react-test-renderer';
import { InfiniteScrollComponent } from '../infinite-scroll';
import { render } from '@testing-library/react';
import { HashRouter as Router } from 'react-router-dom';

describe('should test infinite scroll', () => {

  let cars = [
    {
      'color': 'purple',
      'name': 'minivan',
      'businessId': 12345,
      'item': 7,
    },
    {
      'color': 'red',
      'name': 'station wagon',
      'businessId': 345456,
      'item': 5,
    },
  ];

  // snapshot

  it('should do snapshot', () => {
    /*const ButtonComp = renderer.create(
      <InfiniteScrollComponent
        dataLength={cars?.length}
        previewed={[...cars.map(item => ({
          createdAt: '2020-01-01',
          header: item?.name,
          body: item.businessId,
          realItem: item,
        }))]}

      />
    ).toJSON();
    expect(ButtonComp).toMatchSnapshot();*/
    const { asFragment } = render(
      <Router>
        <InfiniteScrollComponent
          dataLength={cars?.length}
          previewed={[...cars.map(item => ({
            createdAt: '2021-03-28T08:16:54.277Z',
            header: item?.name,
            body: item.businessId,
            realItem: item,
          }))]}

        />
      </Router>,
    );
    const firstRender = asFragment();
    expect(firstRender).toMatchSnapshot();
  });
});
