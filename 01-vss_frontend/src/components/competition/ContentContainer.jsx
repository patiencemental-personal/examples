import React from 'react';
import styled from 'styled-components';
import color from '../../styles/color';
import media from '../../styles/media';
import { baseContainerStyle } from '../../styles/common';

const ContentContainer = ({children}) => {
  return <StyledContainer baseContainerStyle={baseContainerStyle}>{children}</StyledContainer>
};

const StyledContainer = styled.section`
  ${props => ({
    ...props.baseContainerStyle
  })};
  background-color: ${color.lightRed};
  ${media.custom(1420)} {
    width: 900px;
  };
  /* ${media.large} { // 1248
    width: 1000px;
  };
  ${media.custom(1020)} {
    width: 750px;
  };
  ${media.small} { // 768
    width: 600px;
  };
  ${media.custom(620)} {
    width: 370px;
  };   */
`;

export default ContentContainer;