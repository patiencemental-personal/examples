import React from 'react';
import styled from 'styled-components';
import { baseContainerStyle } from '../../styles/common';
import media from '../../styles/media';
import color from '../../styles/color';

const PhoneContainer = ({children}) => {
  return (
    <Wrapper>
      <Phone baseContainerStyle={baseContainerStyle}>
        {children}
      </Phone>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  background: white;
  min-height: 500px;
`;

const Phone = styled.section`
  padding: 1rem;
  width: 810px;
  margin: 0 auto;
  background-color: ${color.white};
  position: relative;
  top: -3.7rem;
  border-top-left-radius: 80px;
  border-top-right-radius: 80px;
  box-shadow: 0px 5px 60px 1px  ${color.grey};
  min-width: 250px;
  ${media.custom(810)} {
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    margin-right: 0;
    margin-left: 0;
    width: 100%;
  };
`;

export default PhoneContainer;