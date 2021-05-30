const extractQueryParam = (paramName, part = 'hash') => {
  let hashParts = window.location[part].split('?');
  let queryString;
  let paramValue;
  if (hashContainsQueryString(hashParts)) {
    queryString = hashParts[1];
  } else {
    return null;
  }
  if (!queryStringContainsParam(queryString, paramName)) {
    return null;
  }
  if (queryStringContainsMultipleParams(queryString)) {
    return findParamValue(queryString, paramName);
  } else {
    paramValue = queryString.split('=')[1];
  }
  return paramValue;
};
const hashContainsQueryString = (hashParts) => {
  return hashParts.length > 1;
};
const queryStringContainsParam = (queryString, paramName) => {
  return queryString.includes(paramName);
};
const queryStringContainsMultipleParams = (queryString) => {
  return queryString.split('&').length > 1;
};
const findParamValue = (queryString, paramNameToFind) => {
  const params = queryString.split('&');
  const paramValues = [];
  for (let i = 0; i < params.length; i++) {
    const paramParts = params[i].split('=');
    const paramName = paramParts[0];
    const paramValue = paramParts[1];
    if (paramName === paramNameToFind) {
      paramValues.push(paramValue);
    }
  }
  if (paramValues.length > 1) {
    return paramValues;
  } else if (paramValues.length === 1) {
    return paramValues[0];
  } else {
    return null;
  }
};
export default extractQueryParam;