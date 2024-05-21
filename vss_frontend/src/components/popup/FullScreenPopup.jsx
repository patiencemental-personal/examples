import React from 'react';
import Spinner from '../common/Spinner';
import styled from 'styled-components';
import zIndex from '../../styles/zIndex';

const FullScreenPopup = () => {
  return (
    <FullScreen>
      <Spinner />
    </FullScreen>
  );
};

const FullScreen = styled.main`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${zIndex.popup};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
`;

export default FullScreenPopup;