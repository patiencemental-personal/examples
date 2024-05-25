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
import { usePopupStore } from '../../stores/usePopupStore';
import { useAdminStore } from '../../stores/useAdminStore';
import { emailAuthCode, emailAuthCodeConfirm } from '../../api/user';
// import popupType from '../../lib/popupType';
import useInputRef from '../../hooks/useInputRef';
import { updatePassword } from '../../api/user';
import popupType from '../../lib/popupType';

const templateStylesOnSpinner = {
  width: 'auto',
};

const MessageStyles = {
  color: color.blushRed,
};

const STEP_EMAIL_AUTH = 1;
const STEP_NEW_PASSWORD = 2;

const AdminPasswordChangePopup = ({ email }) => {

  const [step, setStep] = useState(STEP_EMAIL_AUTH);

  const competitionId = useAdminStore((state) => state.competition_id)

  const open = usePopupStore((state) => state.open)
  const close = usePopupStore((state) => state.close)
  const [applyMediaQuery, setApplyMediaQuery] = useState(false);
  const [loading, startLoading, endLoading] = useLoading(false);
  const [tempalteStyles, setTemplateStyles] = useState(null);

  const emailAuthNumberInputRef = useRef();
  const [message, setMessage] = useState('')
  const [isRequestAuthNumber, setIsRequestAuthNumber] = useState(false);

  const passwordInputRef = useInputRef({validRules: [
    {
      rule: 'require',
      warning: '새로운 비밀번호를 입력해 주세요.'
    },
    {
      rule: 'password',
      warning: '영문과 숫자, 특수 문자 조합 8~15 자리를 입력해 주세요.'
    }
  ]});
  const passwordCheckInputRef = useInputRef();


  const requestEmailAuthCode = async (event) => {
    event?.preventDefault();
    setMessage('')
    startLoading();
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
    startLoading()

    if (!passwordInputRef.validate()) {
      endLoading()
      return ;
    }

    if (passwordInputRef.get() !== passwordCheckInputRef.get()) {
      endLoading()
      passwordCheckInputRef.setWarningMessage('비밀번호가 다릅니다');
      return ;
    } else {
      passwordCheckInputRef.setWarningMessage('')
    }

    // 요청
    const payload = {
      password: passwordInputRef.get(),
      email, competitionId
    }
    try {
      await updatePassword(payload);
      open({
        type: popupType.MESSAGE,
        props: { message: '비밀번호 변경이 완료되었습니다.' }
      })
    } catch (error) {
      setMessage(error.data.message)
      return;
    } finally {
      endLoading()
    }
  }

  useEffect(() => {
    requestEmailAuthCode();
  }, []);

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
            <PopupHead title='비밀번호 변경' />
            {
              step === STEP_EMAIL_AUTH && (
                <PopupBody>
                  <Text>{email}</Text>
                  <InputBox>
                    <Input
                      ref={emailAuthNumberInputRef}
                      type='password'
                      required
                    />
                    <Placeholder>이메일 인증 번호</Placeholder>
                  </InputBox>
                  <P>
                    <button onClick={requestEmailAuthCode}>
                      재전송
                      {/* {isRequestAuthNumber ? '재전송' : '전송'} */}
                    </button>
                  </P>
                </PopupBody>
              )
            }
            {
              step === STEP_NEW_PASSWORD && (
                <PopupBody>
                  <Text>{email}</Text>
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
            {passwordInputRef.warningMessage && <Message message={passwordInputRef.warningMessage} styles={MessageStyles} />}
            {!passwordInputRef.warningMessage && passwordCheckInputRef.warningMessage && <Message message={passwordCheckInputRef.warningMessage} styles={MessageStyles} />}
            <PopupFooter>
              {
                step === STEP_EMAIL_AUTH && (
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
                            authentication_key: inputedAuthNumber,
                            email,
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
              <Button name='닫기' onClick={close} />
            </PopupFooter>
          </React.Fragment>
        )
      }
    </PopupTemplate>
  );
};

const InputBox = styled.div`
  position: relative;
  width: 200px;
  margin: 0 auto;
  &.newPassword {
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

const Text = styled.p`
  font-size: 1rem;
  margin-bottom: 1rem;
`;

export default AdminPasswordChangePopup;