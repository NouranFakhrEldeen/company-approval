import { UrlQueryMaker } from './';
jest.mock('axios');
describe('url query helper', () => {
  it('adding query to simple url', ()=>{
    const result = UrlQueryMaker('http://test.test', { id: 1, name: 'test' });
    expect(result).toEqual('http://test.test?id=1&name=test');
  });
  it('adding query to url that already have query string', ()=>{
    const result = UrlQueryMaker('http://test.test?age=5', { id: 1, name: 'test' });
    expect(result).toEqual('http://test.test?age=5&id=1&name=test');
  });
});