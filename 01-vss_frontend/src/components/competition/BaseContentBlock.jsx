import React from 'react';
import styled from 'styled-components';
import media from '../../styles/media';

const BaseContentBlock = ({children}) => {
  return <Block>{children}</Block>
};

const Block = styled.div`
  margin: 2rem 3rem 0 3rem;
  ${media.custom(1000)} {
    margin-right: 0rem;
    margin-left: 0rem;
  };
`;

export default BaseContentBlock;