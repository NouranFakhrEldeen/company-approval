import { capitalizeFirstWord, capitalizeAllWords } from '.';
import 'babel-polyfill';
jest.mock('axios');
describe('format text helper', () => {
  it('capitalize sentence', ()=>{
    const result = capitalizeFirstWord('hello how are you?');
    expect(result).toEqual('Hello how are you?');
  });
  it('adding query to url that already have query string', ()=>{
    const result = capitalizeAllWords('hello how are you?');
    expect(result).toEqual('Hello How Are You?');
  });
});