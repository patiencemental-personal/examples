import React from 'react';
import styled, { css } from 'styled-components';
import color from '../../../styles/color';
import font from '../../../styles/font';

const Button = ({name, onClick, styles, active = true}) => {
  return <Block disabled={!active} onClick={onClick} styles={styles}>{name}</Block>;
};

const Block = styled.button`
  padding: 0.8rem 1.2rem;
  border-radius: 5px;
  background-color: ${color.blushRed};
  font-weight: ${font.weight.bold};
  color: ${color.white};
  text-align: center;
  margin: 0 0.5rem;
  font-size: 1.4rem;
  word-break: keep-all;
  &:disabled {
    background-color: ${color.darkGrey};
  }
  ${props => css`${props.styles}`};
`;

export default Button;