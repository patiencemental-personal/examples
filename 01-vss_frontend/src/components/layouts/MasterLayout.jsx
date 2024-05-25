import React from 'react';
import MasterHeader from '../base/MasterHeader';
import Footer from '../base/Footer';
import styled from 'styled-components';

const MasterLayout = ({children, headerLeftMenu, headerRightButtons}) => {
  return (
    <Page>
      <MasterHeader headerLeftMenu={headerLeftMenu} headerRightButtons={headerRightButtons} />
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

export default MasterLayout;