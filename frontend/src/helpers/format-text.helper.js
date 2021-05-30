export const capitalizeFirstWord = function (string) {
  if (Object.prototype.toString.call(string) !== '[object String]')
    return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
};
export const capitalizeAllWords = function (string) {
  if (Object.prototype.toString.call(string) !== '[object String]')
    return string;
  return string.replace(/\w\S*/g, function(txt){
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};