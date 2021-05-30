export const resizeImage = (file, options, callback) => {
  if (!file || !file.type.match(/image.*/)) {
    return;
  }
  var reader = new FileReader();
  reader.onload = (e) => {
    var img = document.createElement('img');
    img.onload = () => {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      var MAX_WIDTH = options.maxWidth;
      var MAX_HEIGHT = options.maxHeight;
      var width = img.width;
      var height = img.height;
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      var dataUrl = canvas.toDataURL('image/jpeg');
      var blobImage = dataURLToBlob(dataUrl);
      var resizedImage = blobToFile(blobImage, file);
      callback(resizedImage);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

var dataURLToBlob = function(dataURL) {
  var BASE64_MARKER = ';base64,';
  let parts, contentType, raw;
  if (dataURL.indexOf(BASE64_MARKER) === -1) {
    parts = dataURL.split(',');
    contentType = parts[0].split(':')[1];
    raw = parts[1];
    return new Blob([raw], { type: contentType });
  }
  parts = dataURL.split(BASE64_MARKER);
  contentType = parts[0].split(':')[1];
  raw = window.atob(parts[1]);
  var rawLength = raw.length;
  var uInt8Array = new Uint8Array(rawLength);
  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
};

function blobToFile(theBlob, fileData){
  theBlob.name = fileData.name;
  return new File([theBlob], fileData.name, { type: fileData.type });
}