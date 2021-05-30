import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { withTranslation } from 'react-i18next';
import NoResults from '../../components/noResults/noResults';
// import Moment from 'react-moment';

const infiniteScrollComponent = ({
  next,
  dataLength,
  hasMore,
  loader,
  onClick,
  previewed,
  no_results,

}) => {

  return (
    <div className={
      !previewed?.length ? 'no-results-div' : ''}>
      <InfiniteScroll
        next={next}
        dataLength={dataLength}
        hasMore={hasMore}
        loader={loader}>

        <div className='list-group striped' id='results-container'>
          {
            !previewed?.length
              ?
              <NoResults value={no_results} />
              :
              previewed?.map((item, index) => (
                <div
                  onClick={() => onClick(item.realItem)}
                  key={index}
                  className='list-group-item list-group-item-with-actions cursorPointer'>
                  <p>{item?.header}</p>
                  <span>
                    {item?.body}
                  </span>
                </div>
              ))
          }
        </div>
      </InfiniteScroll>
    </div>
  );
};

export const InfiniteScrollComponent = (withTranslation()(infiniteScrollComponent));
// export const InfiniteScrollComponent = infiniteScrollComponent;

