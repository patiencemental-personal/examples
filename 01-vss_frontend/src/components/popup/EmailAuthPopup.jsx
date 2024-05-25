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
import { emailAuthCode, emailAuthCodeConfirm } from '../../api/user';
import popupType from '../../lib/popupType';

const templateStylesOnSpinner = {
  width: 'auto',
};

const MessageStyles = {
  color: color.blushRed,
};

const EmailAuthPopup = ({ email, onCompleteEmailChange }) => {

  const open = usePopupStore((state) => state.open)
  const close = usePopupStore((state) => state.close)
  const [applyMediaQuery, setApplyMediaQuery] = useState(false);
  const [loading, startLoading, endLoading] = useLoading(false);
  const [tempalteStyles, setTemplateStyles] = useState(null);

  const emailAuthNumberInputRef = useRef();
  const [isRequestAuthNumber, setIsRequestAuthNumber] = useState(false);
  const [message, setMessage] = useState('')

  const requestEmailAuthCode = async (event) => {
    event?.preventDefault();
    setMessage('')
    startLoading()
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
            <PopupHead title='이메일 인증' />
            <PopupBody>
              <Text>{email}</Text>
              <InputBox>
                <Input
                  ref={emailAuthNumberInputRef}
                  type='password'
                  required
                />
                <Placeholder>인증 번호</Placeholder>
              </InputBox>
              <P>
                <button onClick={requestEmailAuthCode}>
                재전송
                {/* {isRequestAuthNumber ? '재전송' : '전송'} */}
                </button>
              </P>
            </PopupBody>
            { message && <Message message={message} styles={MessageStyles} /> }
            <PopupFooter>
              <Button 
                name='인증'
                onClick={async () => {
                  startLoading();
                  const inputedAuthNumber = emailAuthNumberInputRef.current.value;

                  if (inputedAuthNumber === '') {
                    setMessage('인증 번호를 입력해주세요.')
                    endLoading()
                    return ;
                  } else if (!isRequestAuthNumber) {
                    setMessage('전송 버튼을 눌러주세요.')
                    endLoading()
                    return ;
                  } else {
                    try {
                      await emailAuthCodeConfirm({
                        authentication_key: inputedAuthNumber,
                        email,
                      })
                      onCompleteEmailChange(true);
                      open({
                        type: popupType.MESSAGE,
                        props: { message: '이메일 인증 성공<br>대회 수정을 수행하시면 이메일이 변경됩니다.' }
                      })
                    } catch (error) {
                      setMessage(error.data.message)
                      endLoading()
                      return ;
                    }
                  }
                }}
              />
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
  width: 150px;
  margin: 0 auto;
  margin-bottom: 1rem;
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

export default EmailAuthPopup;