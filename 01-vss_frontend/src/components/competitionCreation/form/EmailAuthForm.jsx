import React, { useState } from 'react';
import { useRef } from 'react';
import styled from 'styled-components';
import { emailAuthCode, emailAuthCodeConfirm } from '../../../api/user';
import popupType from '../../../lib/popupType';
import { regexKeyMap, validateRegex } from '../../../lib/validation';
import { usePopupStore } from '../../../stores/usePopupStore';
import color from '../../../styles/color';
import font from '../../../styles/font';


const EmailAuthForm = ({ setAuthedEmail, prevStep, nextStep }) => {
  // email
  const emailInputRef = useRef();
  const emailAuthNumberInputRef = useRef();

  const [isRequestAuthNumber, setIsRequestAuthNumber] = useState(false);
  const open = usePopupStore((state) => state.open);
  const close = usePopupStore((state) => state.close);

  const requestEmailAuthCode = async (event) => {
    event.preventDefault();
    if (validateRegex(regexKeyMap.email, emailInputRef.current.value)) {
      open({ type: popupType.LOADING });
      try {
        const response = await emailAuthCode(emailInputRef.current.value);
        if (response.status === 201) setIsRequestAuthNumber(true);
        close();
      } catch (error) {
        const errorMessage = (error.status === 400) ? '올바른 이메일 형식이 아닙니다.' : error.data.message;
        open({ type: popupType.MESSAGE, props: { message: errorMessage } })
      }
    } else {
      open({ type: popupType.MESSAGE, props: { message: '올바른 이메일 형식이 아닙니다.' } })
    }
  }

  return (
    <React.Fragment>
      <Form>
        <InputBox>
          <InputWrapper>
            <Input
              ref={emailInputRef}
              type='text'
              autoComplete='off'
              required
              className={isRequestAuthNumber ? 'sended' : ''}
              onChange={() => {
                if (isRequestAuthNumber) {
                  setIsRequestAuthNumber(false)
                }
              }}
            />
            {
              !isRequestAuthNumber && (
                <Placeholder>example@vss.gg</Placeholder>
              )
            }
          </InputWrapper>
          {
            isRequestAuthNumber ? (
              <ButtonInForm onClick={(event) => {
                event.preventDefault();
                requestEmailAuthCode(event)
              }}>재전송</ButtonInForm>
            ) : (
              <ButtonInForm onClick={requestEmailAuthCode}>인증 번호 요청</ButtonInForm>
            )
          }
        </InputBox>
        {
          isRequestAuthNumber && (
            <InputBox className='input-auth-number'>
              <Input
                ref={emailAuthNumberInputRef}
                type='password'
                autoComplete='off'
                required
              />
              <Placeholder>인증 번호</Placeholder>
            </InputBox>
          )
        }
      </Form>

      <ButtonsBlock>
        <Button onClick={prevStep}>이전</Button>
        <Button
          onClick={async () => {
            open({ type: popupType.LOADING })

            let warningMessage = null;

            if (!emailAuthNumberInputRef.current) {
              warningMessage = '이메일 인증을 진행하세요.';
            } else if (emailAuthNumberInputRef.current.value === '') {
              warningMessage = '인증 번호를 입력해주세요.';
            } else {
              try {
                await emailAuthCodeConfirm({ 
                  authentication_key: emailAuthNumberInputRef.current.value,
                  email: emailInputRef.current.value
                });
              } catch (error) {
                warningMessage = '유효한 인증 번호가 아닙니다.';
              }
            }

            if (warningMessage === null) {
              setAuthedEmail(emailInputRef.current.value)
              close();
              nextStep();
            } else {
              open({
                type: popupType.MESSAGE,
                props: { message: warningMessage }
              })
            }

            // {
            //   // test 임시용
            //   setAuthedEmail(emailInputRef.current.value)
            //   close();
            //   nextStep();
            // }
          }}
        >다음</Button>
      </ButtonsBlock>
    </React.Fragment>
  );
};

const Form = styled.form`
  padding: 1rem;
`

const InputBox = styled.div`
  margin-bottom: 1.5rem;
  text-align: center;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  &.input-auth-number {
    transform: translateY(2.5rem);
    input {
      text-align: center;
    }
  }
`

const InputWrapper = styled.div`
  position: relative;
`

const Input = styled.input`
  position: relative;
  width: 35%;
  border: none;
  /* border: 1px solid black; */
  outline: none;
  border-bottom: 2px solid ${color.thickDark};
  min-width: 300px;
  font-size: 1rem;
  letter-spacing: 0.05rem;
  padding: 0.5rem;
  font-size: 1.2rem;
  &:valid ~ span,
  &:focus ~ span {
    transform: translateX(80%);
    opacity: 0;
  };
  &.sended {
    /* cursor: not-allowed; */
    border: 2px solid ${color.successGreen};
    border-radius: 3px;
    color: ${color.darkGrey}
  }
`

const Placeholder = styled.span`
  position: absolute;
  margin: 0 auto;
  left: 0;
  padding: 0.5rem;
  font-size: 1.2rem;
  color: ${color.placeholder};
  pointer-events: none;
  letter-spacing: 0.05rem;
  transition: 0.35s;
  font-weight: ${font.weight.bold};
  text-align: center;
  width: 100%;
`

const ButtonInForm = styled.button`
  font-size: 1.2rem;
  text-align: center;
  margin-left: 10px;
  color: ${color.darkGrey};
  font-weight: ${font.weight.bold};
  background-color: ${color.successGreen};
  color: white;
  width: 140px;
  padding: 0.5rem;
  border-radius: 8px;
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

export default EmailAuthForm;