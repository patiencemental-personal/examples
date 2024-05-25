import React from 'react';
import styled from 'styled-components';

const PopupBody = ({children}) => {
  return <Body>{children}</Body>;
};

const Body = styled.section`
  font-size: 1.5rem;
  width: 90%;
  text-align: center;
  margin: 0 auto 1rem auto;
`;

export default PopupBody;