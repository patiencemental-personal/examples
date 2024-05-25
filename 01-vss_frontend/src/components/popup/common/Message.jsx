import React from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import styled, { css } from 'styled-components';
import font from '../../../styles/font';

const Message = ({message, styles}) => {
  const ref = useRef();
  useEffect(() => {
    ref.current.innerHTML = message;
  }, [message]);
  return <Block ref={ref} styles={styles} />;
};

const Block = styled.p`
  padding: 1rem;
  font-size: 1.2rem;
  text-align: center;
  font-weight: ${font.weight.bold};
  ${props => css`${props.styles}` }
`;

export default Message;