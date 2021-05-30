export const UrlQueryMaker = function (url, data) {
  const ret = [];
  for (let d in data)
    ret.push(`${encodeURIComponent(d)}=${encodeURIComponent(data[d])}`);
  if (!ret.length)
    return url;
  return `${url.includes('?') ? `${url}&` : `${url}?`}${ret.join('&')}`;
};
