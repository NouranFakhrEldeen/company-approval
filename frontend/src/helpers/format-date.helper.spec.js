import { formatDate } from '.';
import 'babel-polyfill';

jest.mock('axios');
describe('format date', () => {
  let date;
  beforeEach(()=>{
    date = new Date('2020-02-01');
  });
  it('formatDate dd-mm-yyyy', ()=>{
    const result = formatDate('dd-mm-yyyy', date);
    expect(result).toEqual('1-2-2020');
  });
  it('formatDate dd/mm/yyyy', ()=>{
    const result = formatDate('dd/mm/yyyy', date);
    expect(result).toEqual('1/2/2020');
  });
  it('formatDate mm-dd-yyyy', ()=>{
    const result = formatDate('mm-dd-yyyy', date);
    expect(result).toEqual('2-1-2020');
  });
  it('formatDate mm/dd/yyyy', ()=>{
    const result = formatDate('mm/dd/yyyy', date);
    expect(result).toEqual('2/1/2020');
  });
  it('formatDate yyyy-mm-dd', ()=>{
    const result = formatDate('yyyy-mm-dd', date);
    expect(result).toEqual('2020-2-1');
  });
  it('formatDate yyyy/mm/dd', ()=>{
    const result = formatDate('yyyy/mm/dd', date);
    expect(result).toEqual('2020/2/1');
  });
  it('formatDate yyyy-dd-mm', ()=>{
    const result = formatDate('yyyy-dd-mm', date);
    expect(result).toEqual('2020-1-2');
  });
  it('formatDate yyyy/dd/mm', ()=>{
    const result = formatDate('yyyy/dd/mm', date);
    expect(result).toEqual('2020/1/2');
  });
});