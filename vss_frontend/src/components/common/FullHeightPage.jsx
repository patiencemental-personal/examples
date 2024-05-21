import React from 'react';

import styled, { createGlobalStyle } from 'styled-components';

const FullHeightPage = ({ children }) => {
  return (
    <React.Fragment>
      <GlobalFullHeight />
      <Page>{children}</Page>
    </React.Fragment>
  );
};

const GlobalFullHeight = createGlobalStyle`
  html, body {
    height: 100%;
  }
`;

const Page = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export default FullHeightPage;