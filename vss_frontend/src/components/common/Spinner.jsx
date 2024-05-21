import React from 'react';
import styled from 'styled-components';
import color from '../../styles/color';
import media from '../../styles/media';
import transition from '../../styles/transition';

const Spinner = ({ styles }) => {
  return <Spin styles={styles} />;
};

const Spin = styled.div`
  width: 5rem;
  height: 5rem;
  ${media.mobile} {
    width: 4rem;
    height: 4rem;
  }
  border-radius: 50%;
  border: 3px solid ${color.grey};
  border-top: 3px solid ${color.skyBlue};
  animation: ${transition.spin} 2s linear infinite;
`;

export default Spinner;