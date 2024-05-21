import React from 'react';
import styled from 'styled-components';
import color from '../../../styles/color';
import font from '../../../styles/font';

const PopupHead = ({title, styles}) => {
  return (
    <Head styles={styles}>
      <img 
        src={`${process.env.PUBLIC_URL}/images/app-logo.png`} 
        alt="app icon" />
      <p>{title || ''}</p>
    </Head>
  );
};

const Head = styled.header`
  text-align: center;
  font-weight: ${font.weight.bold};
  font-size: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${color.blushRed};
  margin-bottom: 2rem;
  img {
    height: 60px;
    width: 90px;
    cursor: pointer;
  };
`;

export default PopupHead;