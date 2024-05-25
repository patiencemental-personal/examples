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
import { useAdminStore } from '../../stores/useAdminStore';
import { useNavigate, useLocation } from 'react-router-dom';
import routePathMap from '../../route/path';
import font from '../../styles/font';
import useCompetitionStore from '../../stores/useCompetitionStore';
import { loginManager } from '../../api/user';
import { usePopupStore } from '../../stores/usePopupStore';
import popupType from '../../lib/popupType';
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

const AdminLoginPopup = () => {

  const openPopup = usePopupStore((state) => state.open)
  // const closePopup = usePopupStore((state) => state.close)

  const [applyMediaQuery, setApplyMediaQuery] = useState(false);
  const location = useLocation();
  const { info } = useCompetitionStore();
  const {competition_index} = info[0];
  const { setAPIKey, setCompetitionId, setName } = useAdminStore();
  const login = useAdminStore((state) => state.login);
  const navigate = useNavigate();
  
  const passwordRef = useRef();
  const [loading, startLoading, endLoading] = useLoading(false);
  const [password, changePassword] = useInput('');
  const [tempalteStyles, setTemplateStyles] = useState(null);
  const [message, setMessage] = useState(null);

  const restorePassword = useCallback(() => passwordRef.current.value = password, [password]);

  const getLoginResponse = useCallback(async (index, pw) => {  
    const responseInfo = await loginManager(index, pw);
    if(responseInfo !== "login failed") {
      const { state } = location;
      const { jwt, name } = responseInfo;
      login();
      setCompetitionId(state.compeIndex);
      setAPIKey(jwt);
      setName(name)
      navigate({
        pathname: `/${routePathMap.COMPETITION.INDEX}`,
        search: `?id=${state.compeIndex}`,
      }, {
        state: {
          loginSuccss: true,
        }
      });
    }
    else if(responseInfo === undefined) {
        setMessage('에러 발생');
      } else {
        setMessage('비밀번호를 다시 확인해주세요.');
      }
  }, [location, login, navigate, setAPIKey, setName, setCompetitionId]);

  useEffect(() => {
    if (!loading) restorePassword();
    setApplyMediaQuery(!loading);
    setTemplateStyles(loading ? templateStylesOnSpinner : null);
  }, [loading, restorePassword]);

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
            <PopupHead title='관리자 로그인' />
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
              <P><button onClick={() => {
                openPopup({ type: popupType.ADMIN_PASSWORD_FIND, })
              }}>비밀번호 찾기</button></P>
            </PopupBody>
              { message && <Message message={message} styles={MessageStyles} /> }
            <PopupFooter>
              <Button 
                name='로그인'
                onClick={() => {
                  startLoading();
                  setTimeout(() => {
                    getLoginResponse(competition_index, password);
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
  color: ${color.placeHolder};
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

export default AdminLoginPopup;