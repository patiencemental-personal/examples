import React, { memo } from 'react';
import styled from 'styled-components';
import media from '../../styles/media';

const HomeHeadBlock = memo(({ selectedGameMenu }) => {
  return (
    <Head>
      <p>{selectedGameMenu}</p>
    </Head>
  );
});

const Head = styled.div`
  position: relative;
  padding: 1rem;
  text-align: center;
  p {
    font-size: 1.75rem;
    font-weight: 600;
    letter-spacing: 0.05rem;
  };
  ${media.custom(1400)} {
    padding: 1rem 0;
  }
`;

export default HomeHeadBlock;