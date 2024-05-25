import React from 'react';
import Header from '../base/Header';
import Footer from '../base/Footer';
import styled from 'styled-components';

const BasicLayout = ({children, headerRightButtons}) => {
  return (
    <Page>
      <Header headerRightButtons={headerRightButtons} />
      <Content>{children}</Content>
      <Footer />
    </Page>
  );
};

const Content = styled.section`
  display: flex;
  flex-direction: column;
`;

const Page = styled.main`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export default BasicLayout;