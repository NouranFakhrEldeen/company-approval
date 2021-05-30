/* eslint-disable-next-line */
const spacialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;

export const formatDate = function (format, date) {
  if (!format) {
    throw new Error('Format must be exist with a string value.');
  }
  if (!date) {
    date = new Date();
  }
  const separators = format.match(spacialChar);
  format = format.replace(spacialChar, ' ');
  format = format.toLowerCase();
  switch (format) {
  case 'dd mm yyyy':
    return dayMonthYear(date, separators[0]);
  case 'mm dd yyyy':
    return monthDayYear(date, separators[0]);
  case 'yyyy mm dd':
    return yearMonthDay(date, separators[0]);
  case 'yyyy dd mm':
    return yearDayMonth(date, separators[0]);
  default:
    return date;
  }
};

// eslint-disable-next-line
function pad(s) { return (s < 10) ? `0${s}` : s; }

function dayMonthYear(date, separator) {
  var d = new Date(date);
  return [d.getDate(), d.getMonth() + 1, d.getFullYear()].join(separator);
}

function monthDayYear(date, separator) {
  var d = new Date(date);
  return [d.getMonth() + 1, d.getDate(), d.getFullYear()].join(separator);
}

function yearMonthDay(date, separator) {
  var d = new Date(date);
  return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join(separator);
}

function yearDayMonth(date, separator) {
  var d = new Date(date);
  return [d.getFullYear(), d.getDate(), d.getMonth() + 1].join(separator);
}
