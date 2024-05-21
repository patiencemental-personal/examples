import React from 'react';
import styled from 'styled-components';
import PhoneContainer from '../components/common/PhoneContainer';
import TermsAgreeForm from '../components/competitionCreation/form/TermsAgreeForm';
import BasicLayout from '../components/layouts/BasicLayout';
import media from '../styles/media';
import Term from '../components/common/Term';

const TermsPage = () => {
  return (
    <BasicLayout>
      <DummyContainer />
      <WrapperPhoneContainer>
        <PhoneContainer>
          {/* <TermsAgreeForm readonly={true} /> */}
          <Term />
        </PhoneContainer>
      </WrapperPhoneContainer>
    </BasicLayout>
  );
};


const WrapperPhoneContainer = styled.section`
  padding-bottom: 3.7rem;
  background-color: white;
`

const DummyContainer = styled.section`
  height: 8rem;
  background-color: white;
  ${media.mobile} {
    height: 6rem;
  }
`;

export default TermsPage;