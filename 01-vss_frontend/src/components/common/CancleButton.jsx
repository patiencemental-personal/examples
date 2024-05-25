import React from 'react';
import styled, { css } from 'styled-components';
import color from '../../styles/color';
import font from '../../styles/font';

const CancleButton = ({onClick, styles}) => {
  return <Button onClick={onClick} styles={styles}>X</Button>
};

const Button = styled.button`
  background-color: ${color.blushRed};
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: ${font.weight.semiBold};
  color: white;
  font-size: 1.2rem;
  ${props => props.styles && css`${props.styles}`}
`;

export default CancleButton;