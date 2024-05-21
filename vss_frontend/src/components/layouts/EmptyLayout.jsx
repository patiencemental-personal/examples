import React from 'react';
import styled from 'styled-components';
import color from '../../styles/color';

const EmptyLayout = ({children}) => {
  return <Page>{children}</Page>;
};

const Page = styled.main`
  background-color: ${color.whiteSmoke};
  height: 100vh;
`;

export default EmptyLayout;