
import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '../../components';
import './drop-zone.style.scss';
import { withTranslation } from 'react-i18next';
const getClassName = (className, isActive) => {
  if (!isActive) return className;
  return `${className} ${className}-active`;
};

const dropZone = ({ onDrop, accept, multiple, t: translate, disabled }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    disabled,
  });

  return (


    <div className="drop-container">
      <div className="content">
        <div className={getClassName('dropzone', isDragActive)} {...getRootProps()}>
          <input className="dropzone-input" {...getInputProps()} multiple = { multiple } />
          <div className="text-center">
            {isDragActive ? (
              <p className="dropzone-content mt-5 mt-2">{translate('release_to_drop_the_files_here')}</p>
            ) : (
              <div className='row mt-5 ml-4'>
                <Button
                  value={translate('select_file')}
                  disabled = {disabled}
                  iconsBoolean={false}
                  icons={'fal fa-walking font-size-x-large font-size-sm-2x-large'}
                  classes={'btn border-radius-0 btn-primary'}
                  // eslint-disable-next-line no-console

                />


                <p className="dropzone-content">
                  {translate('or_drag_here')}
                  {/* Drag 'n' drop some files here, or click to select files */}
                </p>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// export const DropZone = dropZone ;
export const DropZone = (withTranslation()(dropZone));