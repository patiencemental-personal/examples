import React from 'react';
import styled from 'styled-components';
import color from '../../styles/color';
import media from '../../styles/media';

const CompetitonCreationHeadBlock = ({title, subTitle}) => {
  return (
    <Head>
      <p className='title'>{title}</p>
      <p className='subTitle'>{subTitle}</p>
    </Head>
  );
};

const Head = styled.div`
  padding: 1rem;
  border-bottom: 3px solid #e0e0e0;
  margin: 0 5%;
  text-align: center;
  letter-spacing: 0.05rem;
  p.title {
    font-size: 1.75rem;
    font-weight: 600;
  }
  p.subTitle {
    margin-top: 10px;
    font-size: 0.8rem;
    color: ${color.lightRed};
  }
  ${media.custom(1400)} {
    padding: 1rem 0;
  }
`;

export default CompetitonCreationHeadBlock;