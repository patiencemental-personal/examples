import React from "react";
import styled, { css } from "styled-components";
import color from "../../styles/color";

const ArrowButton = ({ leftOrRight, handleClick, styles }) => {
  return (
    <Arrow leftOrRight={leftOrRight} onClick={handleClick} styles={styles}>
      {leftOrRight === "left" ? (
        <i className="fa-solid fa-angle-left"></i>
      ) : (
        <i className="fa-solid fa-angle-right"></i>
      )}
    </Arrow>
  );
};

const Arrow = styled.button`
  z-index: 1;
  position: absolute;
  ${(props) => props.leftOrRight}: 1%;
  top: 50%;
  transform: translateY(-50%);
  ${(props) =>
    props.regular ??
    css`
      font-size: 2rem;
      width: 40px;
      height: 40px;
    `};
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 32px;
  cursor: pointer;
  color: ${color.white};
  background-color: #000000b3;
  &:hover {
    background-color: ${color.blushRed};
    color: ${color.whiteSmoke};
  }
  ${(props) => ({
    ...props.styles,
  })};
`;

export default ArrowButton;
