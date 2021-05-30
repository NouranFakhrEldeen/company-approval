import React, { useEffect, useState } from 'react';
import { ImageServiceFactory } from '.././../services/image.service';


let ImageService = ImageServiceFactory.getInstance();
function authImg({
  imgId,
  id,
  className,
  alt,
  src,
  height,
  width,
  ismap,
  longdesc,
  referrerPolicy,
  sizes,

}) {

  let [image, setImage] = useState(undefined);
  useEffect(() => {
    if (imgId){
      fetch(imgId);
    }
  }, [imgId]);
  let fetch = async (imgId) =>{
    const response = await ImageService.getById(`${imgId}`);
    const base64 = `data:${response.data.contentType};base64,${response.data.file}`;
    setImage(base64);
  };

  return (
    (image || src) ? <img
      src={image || src}
      alt={alt}
      className={className}
      id={id}
      height={height}
      width={width}
      ismap={ismap}
      longdesc={longdesc}
      referrerPolicy={referrerPolicy}
      sizes={sizes}
    /> : <span/>
  );
}

export const AuthImg = authImg;