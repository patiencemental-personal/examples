import React from 'react';
import styled from 'styled-components';

const PopupFooter = ({children}) => {
  return <Footer>{children}</Footer>;
};

const Footer = styled.footer`
  padding: 1rem;
  display: flex;
  justify-content: center;
`;

export default PopupFooter;