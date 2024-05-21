import React from 'react';
import styled, { css } from 'styled-components';
import color from '../../../styles/color';
import media from '../../../styles/media';
import zIndex from '../../../styles/zIndex';

const PopupTemplate = ({children, styles, applyMediaQuery = true}) => {
  return (
    <Container>
      <Template styles={styles} applyMediaQuery={applyMediaQuery}>
        {children} 
      </Template>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${zIndex.popup};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
`;

const Template = styled.main`
  position: relative;
  width: 600px;
  height: auto;
  padding: 2rem;
  border-radius: 20px;
  /* box-shadow: 0 5px 7px 1px ${color.grey}; */
  background-color: ${color.white};
  color: black;
  ${props => props.applyMediaQuery ? `${media.custom(650)} { width: 95%; };` : ''}
  ${props => css`${props.styles}`}
`;

export default PopupTemplate;