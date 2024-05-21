import React from 'react';
import styled, { css } from 'styled-components';
import color from '../../styles/color';

const CheckBox = ({reference, name, label, uniqueLableKey, fontSize, checkboxSize, styles, checkboxColor, beforeOrAfter = 'before', onClick}) => {
  return (
    <Box checkboxSize={checkboxSize} checkboxColor={checkboxColor} fontSize={fontSize} styles={styles} beforeOrAfter={beforeOrAfter} onClick={() => onClick?.()}>
      <input ref={reference} name={name} id={`chk-${label}${uniqueLableKey}`} type="checkbox" />
      <label htmlFor={`chk-${label}${uniqueLableKey}`}>{label}</label>
    </Box>
  );
};

// https://www.youtube.com/watch?v=YyLzwR-iXtI
const Box = styled.div`
  margin-bottom: 1rem;
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  input {
    opacity: 0;
    position: absolute;
  }
  label {
    display: flex;
    align-items: center;
    /* font-size: 1rem; */
    font-size: ${props => props.fontSize || '1rem' };
  }
  ${props => {
    return `label::${props.beforeOrAfter}`
  }} {
    content: '';
    margin-right: 0.5rem;
    margin-left: 0.5rem;
    border: 0.05rem solid ${props => props.checkboxColor || 'black'};
    top: 50%;
    width: 1rem;
    height: 1rem;
    ${props => css`${props.checkboxSize}`}
  }

  ${props => {
    return `label:hover::${props.beforeOrAfter}, input:hover + label::${props.beforeOrAfter}`
  }} {
    background-color: ${color.feelGrey};
  }

  ${props => {
    return `input:checked + label::${props.beforeOrAfter}`
  }} {
    display: flex;
    align-items: center;
    justify-content: center;
    /* https://www.mymathtables.com/html-symbols/shapes-and-symbols-in-ASCII-HEX-CSS-Unicode.html */
    /* https://medium.com/@jamesncox/rendering-unicode-symbol-in-react-76b1b4ffcee4 */
    content: '\u2713';
  }
  ${props => css`${props.styles}`}
`;

export default CheckBox;