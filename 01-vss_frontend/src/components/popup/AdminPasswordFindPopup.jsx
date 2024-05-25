import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import color from '../../styles/color';
import {
  PopupTemplate,
  PopupHead,
  PopupBody,
  PopupFooter,
  Button,
  Message
} from './common/index';
import Spinner from '../common/Spinner';
import useLoading from '../../hooks/useLoading';
import font from '../../styles/font';
import { emailAuthCode, emailAuthCodeConfirm } from '../../api/user';
import useInputRef from '../../hooks/useInputRef';
import { updatePassword } from '../../api/user';
import { regexKeyMap, validateRegex } from '../../lib/validation';
import useCompetitionStore from '../../stores/useCompetitionStore';
import { useNavigate } from 'react-router-dom';

import CancleButton from '../common/CancleButton';
const templateStylesOnSpinner = {
  width: 'auto',
};

const MessageStyles = {
  color: color.blushRed,
};

const cancleButtonStyles = {
  position: 'absolute',
  top: '1.7rem',
  right: '1.7rem'
}

const STEP_EMAIL_AUTH = 1;
const STEP_NEW_PASSWORD = 2;

const AdminPasswordChangePopup = () => {

  const navigate = useNavigate();

  const [step, setStep] = useState(STEP_EMAIL_AUTH);
  const emailInputRef = useInputRef()

  const competitionId = useCompetitionStore((state) => state.info[0].competition_index)

  // const close = usePopupStore((state) => state.close)
  const [applyMediaQuery, setApplyMediaQuery] = useState(false);
  const [loading, startLoading, endLoading] = useLoading(false);
  const [tempalteStyles, setTemplateStyles] = useState(null);

  const emailAuthNumberInputRef = useRef();
  const [message, setMessage] = useState('')
  const [isRequestAuthNumber, setIsRequestAuthNumber] = useState(false);
  const [email, setEmail] = useState();

  const passwordInputRef = useInputRef({
    validRules: [
      {
        rule: 'require',
        warning: '새로운 비밀번호를 입력해주세요.'
      },
      {
        rule: 'password',
        warning: '영문과 숫자, 특수 문자 조합 8~15 자리로 입력해 주세요.'
      }
    ]
  });
  const passwordCheckInputRef = useInputRef();


  const requestEmailAuthCode = async (event) => {
    event.preventDefault();
    setMessage('')
    startLoading();

    if (!isRequestAuthNumber) {
      if (!validateRegex(regexKeyMap.email, email)) {
        setMessage('이메일 양식이 아닙니다.')
        endLoading();
        return;
      }
    }

    try {
      const response = await emailAuthCode(email);
      if (response.status === 201) {
        setIsRequestAuthNumber(true);
      }
    } catch (error) {
      setMessage('서버 에러 입니다.<br>나중에 다시 시도해주세요.')
    } finally {
      endLoading();
    }
  }

  const changePassword = async () => {
    startLoading();
    const password = passwordInputRef.get();
    const password2 = passwordCheckInputRef.get();

    if (!passwordInputRef.validate()) {
      if (password === '' || password2 === '') {
        endLoading();
        setMessage('새로운 비밀번호를 입력해주세요.');
        return;
      }

      if (passwordInputRef.get() !== passwordCheckInputRef.get()) {
        endLoading();
        setMessage('비밀번호가 일치하지 않습니다')
        return;
      }

      if (!validateRegex(regexKeyMap.password, password)) {
        endLoading();
        setMessage('영문과 숫자, 특수 문자 조합 8~15 자리로 입력해 주세요.')
        return;
      }

    } else {

      if (passwordInputRef.get() !== passwordCheckInputRef.get()) {
        endLoading();
        setMessage('비밀번호가 일치하지 않습니다')
        return;
      }

      if (!validateRegex(regexKeyMap.password, password)) {
        endLoading();
        setMessage('영문과 숫자, 특수 문자 조합 8~15 자리로 입력해 주세요.')
        return;
      }
    
      else {
        endLoading();
        setMessage('')
      }
    }

    endLoading();

    // 요청
    const payload = {
      email, competitionId,
      password: passwordInputRef.get(),
    }

    try {
      await updatePassword(payload);
      navigate(-1)
    } catch (error) {
      setMessage(error.data.message)
      return;
    } finally {
      endLoading()
    }
  }

  useEffect(() => {
    setApplyMediaQuery(!loading);
    setTemplateStyles(loading ? templateStylesOnSpinner : null);
  }, [loading]);

  return (
    <PopupTemplate styles={tempalteStyles} applyMediaQuery={applyMediaQuery}>
      {
        loading ? (
          <Spinner />
        ) : (
          <React.Fragment>
            <CancleButton
              onClick={() => navigate(-1)}
              styles={cancleButtonStyles}
            />
            <PopupHead title='비밀번호 찾기' />
            {
              step === STEP_EMAIL_AUTH && (
                <PopupBody>
                  {
                    !isRequestAuthNumber && (
                      <>
                        <GuideText>등록된 관리자 이메일을 입력해 주세요.</GuideText>

                        <InputBox className='emailInput'>
                          <Input
                            ref={emailInputRef.reference}
                            type='text'
                            autoComplete='off'
                            required
                            onChange={(event) => {
                              setEmail(event.currentTarget.value)
                            }}
                          />
                          <Placeholder>example@vss.gg</Placeholder>
                        </InputBox>
                      </>
                    )
                  }
                  {
                    isRequestAuthNumber && (
                      <React.Fragment>
                        <GuideText>{email}</GuideText>
                        <InputBox>
                          <Input2
                            ref={emailAuthNumberInputRef}
                            type='password'
                            required
                          />
                          <Placeholder>이메일 인증 번호</Placeholder>
                        </InputBox>
                        <P>
                          <button onClick={requestEmailAuthCode}>
                            재전송
                          </button>
                        </P>
                      </React.Fragment>
                    )
                  }
                </PopupBody>
              )
            }
            {
              step === STEP_NEW_PASSWORD && (
                <PopupBody>
                  <InputBox className='newPassword'>
                    <Input
                      ref={passwordInputRef.reference}
                      type='password'
                      required
                    />
                    <Placeholder>새로운 비밀번호</Placeholder>
                  </InputBox>
                  <InputBox>
                    <Input
                      ref={passwordCheckInputRef.reference}
                      type='password'
                      required
                    />
                    <Placeholder>비밀번호 확인</Placeholder>
                  </InputBox>
                </PopupBody>
              )
            }
            {message && <Message message={message} styles={MessageStyles} />}
            {/* {passwordInputRef.warningMessage && <Message message={passwordInputRef.warningMessage} styles={MessageStyles} />}
            {passwordCheckInputRef.warningMessage && <Message message={passwordCheckInputRef.warningMessage} styles={MessageStyles} />} */}
            <PopupFooter>
              {
                !isRequestAuthNumber && (
                  <Button
                    name='전송'
                    onClick={requestEmailAuthCode}
                  />
                )
              }
              {
                step === STEP_EMAIL_AUTH && isRequestAuthNumber && (
                  <Button
                    name='인증'
                    onClick={async () => {
                      startLoading();
                      const inputedAuthNumber = emailAuthNumberInputRef.current.value;

                      if (inputedAuthNumber === '') {
                        setMessage('인증 번호를 입력해주세요.')
                        endLoading()
                        return;
                      } else if (!isRequestAuthNumber) {
                        setMessage('전송 버튼을 눌러주세요.')
                        endLoading()
                        return;
                      } else {
                        try {
                          await emailAuthCodeConfirm({
                            email,
                            authentication_key: inputedAuthNumber,
                          })
                          setMessage('');
                          setStep(STEP_NEW_PASSWORD);
                          endLoading()
                        } catch (error) {
                          setMessage(error.data.message)
                          endLoading()
                          return;
                        }
                      }
                    }}
                  />
                )
              }
              {
                step === STEP_NEW_PASSWORD && (
                  <Button
                    name='변경'
                    onClick={changePassword}
                  />
                )
              }
            </PopupFooter>
          </React.Fragment>
        )
      }
    </PopupTemplate>
  );
};

const GuideText = styled.div`
  color: black;
  font-size: 1rem;
`;

const InputBox = styled.div`
  position: relative;
  width: 200px;
  margin: 0 auto;
  &.emailInput, &.newPassword {
    margin-bottom: 1rem;
  }
`;

const Input = styled.input`
  outline: none; 
  border: none;
  border-bottom: 2px solid ${color.thickDark};
  position: relative;
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  letter-spacing: 0.05rem;
  &:valid ~ span,
  &:focus ~ span {
    transform: translateX(80%);
    opacity: 0;
  };
`;

const Input2 = styled.input`
  outline: none; 
  border: none;
  border-bottom: 2px solid ${color.thickDark};
  position: relative;
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  letter-spacing: 0.05rem;
  text-align: center;
  &:valid ~ span,
  &:focus ~ span {
    transform: translateX(80%);
    opacity: 0;
  };
`;

const Placeholder = styled.span`
  position: absolute;
  padding: 0.5rem;
  font-size: 1.2rem;
  color: lightgrey;
  pointer-events: none;
  letter-spacing: 0.05rem;
  transition: 0.25s;
  font-weight: ${font.weight.bold};
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
`;

const P = styled.p`
  font-size: 0.75rem;
  width: 150px;
  text-align: center;
  margin: 8px auto 0 auto;
  color: ${color.darkGrey};
  font-weight: ${font.weight.bold};
`;

export default AdminPasswordChangePopup;