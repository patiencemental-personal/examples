import React from 'react';
import {
  PopupTemplate,
} from './common/index';
import Spinner from '../common/Spinner';

const templateStyles = {
  width: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}

const LoadingPopup = ({ message }) => {
  return (
    <PopupTemplate styles={templateStyles} applyMediaQuery={false}>
      <Spinner />
      {message && (<p style={{marginTop: '1rem'}}>{message}</p>)}
    </PopupTemplate>
  );
};

export default LoadingPopup;