import React from 'react';
import styled from 'styled-components';
import CheckBox from '../../common/CheckBox';
import { useRef } from 'react';
import font from '../../../styles/font';
import color from '../../../styles/color';
import { usePopupStore } from '../../../stores/usePopupStore';
import popupType from '../../../lib/popupType';
import media from '../../../styles/media';
import TermHtml from '../../common/TermHtml';

const TermsAgreeForm = ({ nextStep, readonly }) => {

  const openPopup = usePopupStore((state) => state.open);
  const agreeCheckRef = useRef();

  return (
    <React.Fragment>
      <Block>
        <Title>서비스 이용약관 및 개인정보 수집 ⦁ 이용 동의</Title>
        <HtmlBlock><TermHtml height='317px' /></HtmlBlock>
        <CheckBox
          reference={agreeCheckRef}
          name='agreeCheckRef'
          label='모든 약관 및 규정을 확인하고 동의합니다.'
          beforeOrAfter='before'
          fontSize='1rem'
          checkboxSize={{
            width: '0.8rem',
            height: '0.8rem'
          }}
          styles={{
            marginTop: '2rem',
          }}
        />        
      </Block>

      <ButtonsBlock>
        <Button
          onClick={(event) => {
            event.preventDefault();
            if (agreeCheckRef.current.checked) {
              nextStep(); 
            } else {
              openPopup({
                type: popupType.MESSAGE,
                props: { message: '약관에 동의해야 대회를 생성할 수 있습니다.' }
              })
            }
          }}
        >확인</Button>
      </ButtonsBlock>
    </React.Fragment>
  )
}

const Block = styled.div`
  width: 90%;
  margin: 1rem auto;
  text-align: center;
`

const HtmlBlock = styled.div`
  box-shadow: 0 5px 7px 1px ${color.grey};
  width: 90%;
  margin: auto;
  margin-top: 1.5rem;
`;

const Title = styled.h3`
  letter-spacing: 0.1rem;
  padding-top: 0.8rem;
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

const Divider = styled.div`
  height: 3px;
  background-color: #e0e0e0;
`

const ButtonsBlock = styled.section`
  position: relative;
  top: 8rem;
  width: 66%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  border-radius: 8px;
  font-size: 1.3rem;
  font-weight: ${font.weight.semiBold};
  width: 130px;
  height: 50px;
  background-color: ${color.blushRed};
  color: ${color.white};
  margin: auto 1rem;
  letter-spacing: 0.1rem;
  transition: .2s;
  &:hover {
    opacity: .9;
  };
`;

export default TermsAgreeForm;