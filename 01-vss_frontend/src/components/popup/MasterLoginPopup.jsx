import React, { useEffect, useState, useRef, useCallback } from 'react';
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
import useInput from '../../hooks/useInput';
import { useNavigate, useLocation } from 'react-router-dom';
import font from '../../styles/font';
import { loginMaster } from '../../api/user';
import routePathMap from '../../route/path';
import { useMasterStore } from '../../stores/useMasterStore';
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

const MasterLoginPopup = () => {

  const [applyMediaQuery, setApplyMediaQuery] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const passwordRef = useRef();
  const [loading, startLoading, endLoading] = useLoading(false);
  const [password, changePassword] = useInput('');
  const [tempalteStyles, setTemplateStyles] = useState(null);
  const [message, setMessage] = useState(null);

  const restorePassword = useCallback(() => passwordRef.current.value = password, [password]);

  const loginSuccess = useMasterStore((state) => state.login)

  useEffect(() => {
    if (!loading) restorePassword();
    setApplyMediaQuery(!loading);
    setTemplateStyles(loading ? templateStylesOnSpinner : null);
  }, [loading, restorePassword]);

  const login = async () => {
    if (password === '') {
      setMessage('비밀번호를 입력 하세요.')
      return ;
    }

    try {
      const response = await loginMaster(password)

      if (response) {
        if (response.data === 'login failed') {
          setMessage('비밀번호를 다시 확인해주세요.');
        } else {
          const jwt = response.data
          loginSuccess(jwt)
          navigate(`${routePathMap.MASTER_BANNER_MANAGEMENT.INDEX}`);
        }
      } else {
        setMessage('에러 발생')
      }
    } catch (error) {
      setMessage(error.data.message)
    }
    
  }

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
            <PopupHead title='Admin 로그인' />
            <PopupBody>
              <InputBox>
                <Input
                  ref={passwordRef}
                  type='password'
                  required
                  onChange={(event) => {
                    changePassword(event);
                    setMessage(null);
                  }}
                />
                <Placeholder>비밀번호 입력</Placeholder>
              </InputBox>
            </PopupBody>
              { message && <Message message={message} styles={MessageStyles} /> }
            <PopupFooter>
              <Button 
                name='로그인'
                onClick={async () => {
                  startLoading();
                  await login();
                  setTimeout(() => {
                    endLoading();
                  }, 1000);
                }}
              />
            </PopupFooter>
          </React.Fragment>
        )
      }
    </PopupTemplate>
  );
};

const InputBox = styled.div`
  position: relative;
  width: 250px;
  margin: 0 auto;
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
    transform: translate(-82%, -1.7rem);
    opacity: 1;
    font-size: 0.75rem;
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

export default MasterLoginPopup;