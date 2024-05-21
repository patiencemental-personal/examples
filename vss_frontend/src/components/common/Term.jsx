import React from 'react';
import styled from 'styled-components';
import color from '../../styles/color';
import media from '../../styles/media';
import TermHtml from './TermHtml';

const Term = ({ height = '395px' }) => {
  return (
    <Container>
      <Title>서비스 이용약관 및 개인정보 수집 ⦁ 이용 동의</Title>
      <Block><TermHtml height={height || '395px'} /></Block>
    </Container>
  );
};

const Container = styled.div`
  padding: 1rem;
  text-align: center;
`

const Block = styled.div`
  box-shadow: 0 5px 7px 1px ${color.grey};
  width: 90%;
  margin: auto;
  margin-top: 3rem;
`;

const Title = styled.h3`
  letter-spacing: 0.1rem;
  margin-top: 0.6rem;
  margin-bottom: 0.6rem;
  /* ::before {
    content: '';
    background-color: black;
    display: inline-block;
    width: 7px;
    height: 7px;
    -webkit-border-radius: 50%;
    border-radius: 50%;
    vertical-align: top;
    margin-right: 0.5rem;
    vertical-align: 3px;
  } */
  ${media.small} {
    font-size: 1rem;
  }
`

export default Term;