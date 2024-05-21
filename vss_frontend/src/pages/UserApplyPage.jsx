import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { flushSync } from 'react-dom';
import styled from 'styled-components';
import TermHtmlViewer from '../components/common/TermHtmlViewer';
import PhoneContainer from '../components/common/PhoneContainer';
import BasicLayout from '../components/layouts/BasicLayout';
import personalInfoHtml from '../lib/terms/personalInfoHtml';
import color from '../styles/color';
import media from '../styles/media';
import font from '../styles/font';
import CheckBox from '../components/common/CheckBox';
import { usePopupStore } from '../stores/usePopupStore';
import popupType from '../lib/popupType';
import { useNavigate, useSearchParams } from 'react-router-dom';
import routePathMap from '../route/path';
import { getCompetitionInfo, getETCInformation, postApplyIndividual, postApplyGroup } from '../api/competition';
import { isDateTimeRange } from '../lib/date';

const blockStyles = (readonly = false) => {
  const styles = {
    margin: '0 auto 1rem auto',
    overflow: 'auto',
  }
  styles['maxHeight'] = readonly ? '250px' : '250px';
  return styles;
}

const UserApplyPage = ({ readonly }) => {
  
  const [searchParams, setSearchParams] = useSearchParams();

  const [compeInfo, setCompeInfo] = useState(null);
  // const [category, setCategory] = useState(null);
  const [etcName, setETCName] = useState([]);
  const [isTeamfight, setIsTeamfight] = useState(null);

  const openPopup = usePopupStore((state) => state.open);
  const closePopup = usePopupStore((state) => state.close);

  const navigate = useNavigate();

  const formRef = useRef();
  const nicknameRef = useRef();
  const emailRef = useRef();
  const nameRef = useRef();
  const phoneRef = useRef();
  const birthdayRef = useRef();
  const etcRef1 = useRef();
  const etcRef2 = useRef();
  const etcRef3 = useRef();
  const etcRef4 = useRef();
  const teamRef = useRef();
  const teamLeaderCheckRef = useRef();
  const agreeCheckRef = useRef();
  const etcRefArray = useMemo(()=> {
    return [etcRef1, etcRef2, etcRef3, etcRef4];
  }, [])

  const [warningMessageMap, setWarningMessageMap] = useState({
    nickname: '',
    email: '',
    name: '',
    phone: '',
    birthday: '',
    etc1: '',
    etc2: '',
    etc3: '',
    etc4: '',
    team: '',
  });

  const getCompeInfo = useCallback(async (index) => {
    const response = await getCompetitionInfo(index);
    const response2 = await getETCInformation(index);
    if (response !== undefined) {
      if (response[0].is_teamfight === "1") {
        setIsTeamfight(true);
      }
      setCompeInfo(response[0]);
      if(response2 !== undefined) {
        setETCName(response2);
      }
    }

  }, []);

  const onChange = (event) => {
    if(isTeamfight) {
      const { name } = event.currentTarget;
      const { convert } = formInfo[name];
      if (convert) {
        const converted = convert()
        event.currentTarget.value = converted;
      }
    } else {
      const { name } = event.currentTarget;
        const { convert } = formInfoIndividual[name];
        if (convert) {
          const converted = convert()
          event.currentTarget.value = converted;
        }
    }
  }

  const sendApply = useCallback(async (index, isTeamfight, birth, isLeader) => {
    let response = null;
    let nickname = nicknameRef.current.value.trim();
    let name = nameRef.current.value.trim();
    let email = emailRef.current.value.trim();

    if (isTeamfight) {
      let team = teamRef.current.value.trim();
      response = await postApplyGroup(index, nickname, name, birth, email, phoneRef.current.value, team, isLeader, etcRef1.current, etcRef2.current, etcRef3.current, etcRef4.current);
    } else {
      response = await postApplyIndividual(index, nickname, name, birth, email, phoneRef.current.value, etcRef1.current, etcRef2.current, etcRef3.current, etcRef4.current);
    }

    if (response.status === 201) {
      openPopup({
        type: popupType.MESSAGE,
        props: {
          message: `${compeInfo.event_name}<br>참가신청이 완료되었습니다!`,
          buttons: [
            {
              name: '메인으로',
              onClick: () => {
                closePopup();
                navigate(`/${routePathMap.HOME.INDEX}`);
              }
            }
          ]
        }
      })
    } else if (response.status === 400) {
      openPopup({
        type: popupType.MESSAGE,
        props: {
          message: `${response.data.message}`,
          buttons: [
            {
              name: '확인',
              onClick: () => {
                closePopup();
              }
            }
          ]
        }
      })
    } else {
      openPopup({
        type: popupType.MESSAGE,
        props: {
          message: `참가신청 실패! 다시 시도해주세요.`,
          buttons: [
            {
              name: '확인',
              onClick: () => {
                closePopup();
              }
            }
          ]
        }
      })
    }
  }, [openPopup, closePopup, compeInfo, navigate]);

  function replaceAll(str, searchStr, replaceStr) {
    return str.split(searchStr).join(replaceStr);
  }

  const formInfo = {
    nickname: {
      validate: () => {
        const result = getValidResult(nicknameRef.current);
        if (nicknameRef.current.value.length === 0) {
          result.warningMessage = '값을 입력해주세요.'
          return result;
        }

        result.valid = true;
        return result;
      },
    },
    email: {
      validate: () => {
        const result = getValidResult(emailRef.current);
        if (emailRef.current.value.length === 0) {
          result.warningMessage = '값을 입력해주세요.';
          return result;
        } else if (!emailRef.current.value.includes('@')) {
          result.warningMessage = '@를 포함해야 합니다.';
          return result;
        }

        result.valid = true;
        return result;
      },
                    },
    name: {
      validate: () => {
        const result = getValidResult(nameRef.current);
        if (nameRef.current.value.length === 0) {
          result.warningMessage = '값을 입력해주세요.'
          return result;
        }

        result.valid = true;
        return result;
      },
    },
    phone: {
      validate: () => {
        const result = getValidResult(phoneRef.current);
        if (phoneRef.current.value.length === 0) {
          result.warningMessage = '값을 입력해주세요.'
          return result;
        } else if (phoneRef.current.value.length < 13) {
          result.warningMessage = '값을 모두 입력해주세요.'
          return result;
        }

        result.valid = true;
        return result;
      },
      convert: () => {
        // https://cublip.tistory.com/326
        return phoneRef.current.value
          .replace(/[^0-9]/g, "")
          .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3")
          .replace("--", "-");
      },
    },
    birthday: {
      validate: () => {
        const result = getValidResult(birthdayRef.current);
        let checkBirth = birthdayRef.current.value.split(".");
        let maxYear = new Date().getFullYear();

        if (birthdayRef.current.value.length === 0) {
          result.warningMessage = '값을 입력해주세요.'
          return result;
        } else if (birthdayRef.current.value.length < 10) {
          result.warningMessage = '값을 모두 입력해주세요.'
          return result;
        } else if (Number(checkBirth[0]) < 1900 || Number(checkBirth[0]) >= maxYear) {
          result.warningMessage = '날짜를 다시 확인해주세요.'
          return result;
        } else if (Number(checkBirth[1]) === 0 || Number(checkBirth[1]) > 12) {
          result.warningMessage = '날짜를 다시 확인해주세요.'
          return result;
        } else if (Number(checkBirth[1]) === 1 || Number(checkBirth[1]) === 3 || Number(checkBirth[1]) === 5 || Number(checkBirth[1]) === 7 || Number(checkBirth[1]) === 8 || Number(checkBirth[1]) === 10 || Number(checkBirth[1]) === 12) {
          if (Number(checkBirth[2]) === 0 || Number(checkBirth[2]) > 31) {
            result.warningMessage = '날짜를 다시 확인해주세요.'
            return result;
          }
        } else if (Number(checkBirth[1]) === 2) {
          if (Number(checkBirth[2]) === 0 || Number(checkBirth[2]) > 29) {
            result.warningMessage = '날짜를 다시 확인해주세요.'
            return result;
          }
        } else if (Number(checkBirth[1]) === 4 || Number(checkBirth[1]) === 6 || Number(checkBirth[1]) === 9 || Number(checkBirth[1]) === 11) {
          if (Number(checkBirth[2]) === 0 || Number(checkBirth[2]) > 30) {
            result.warningMessage = '날짜를 다시 확인해주세요.'
            return result;
          }
        }
        result.valid = true;
        return result;
      },
      convert: () => {
        // todo 정규식 활용하여 바로 변환되도록 수정 해야 함
        const birthday = birthdayRef.current.value;
        const length = birthday.length;

        if (length >= 11) {
          return birthday.substring(0, 10);
        }

        if (isNaN(birthday[length - 1])) {
          return birthday.substring(0, length - 1);
        }

        if (length === 5 && birthday.charAt(4) !== '.') { // '19950' -> '1995.0'
          return birthday.substring(0, 4) + '.' + birthday.charAt(4);
        } else if (length === 8 && birthday.charAt(7) !== '.') { // '1995.071' -> '1995.07.1'
          return birthday.substring(0, 7) + '.' + birthday.charAt(7);
        } else if (length === 5 && birthday.charAt(4) === '.') {
          return birthday.substring(0, 4);
        } else if (length === 8 && birthday.charAt(7) === '.') {
          return birthday.substring(0, 7);
        }

        return birthday;
      },
    },
    etc1: {
      validate: () => {
          let result;
          if (etcRef1.current !== undefined) {
            result = getValidResult(etcRef1.current);
            if (etcRef1.current.value.length === 0) {
              result.warningMessage = '값을 입력해주세요.'
              return result;
            }

            result.valid = true;
            return result;
          } else {
            result = { ref: "", name: "etc1", valid: true, warningMessage: "" };
            return result;
          }
        },
      },
    etc2: {
      validate: () => {
        let result;
        if (etcRef2.current !== undefined) {
          result = getValidResult(etcRef2.current);
          if (etcRef2.current.value.length === 0) {
            result.warningMessage = '값을 입력해주세요.'
            return result;
          }

          result.valid = true;
          return result;
        } else {
          result = { ref: "", name: "etc2", valid: true, warningMessage: "" };
          return result;
        }
      },
    },
    etc3: {
      validate: () => {
        let result;
        if (etcRef3.current !== undefined) {
          result = getValidResult(etcRef3.current);
          if (etcRef3.current.value.length === 0) {
            result.warningMessage = '값을 입력해주세요.'
            return result;
          }

          result.valid = true;
          return result;
        } else {
          result = { ref: "", name: "etc3", valid: true, warningMessage: "" };
          return result;
        }
      },
    },
    etc4: {
      validate: () => {
        let result;
        if (etcRef4.current !== undefined) {
          result = getValidResult(etcRef4.current);
          if (etcRef4.current.value.length === 0) {
            result.warningMessage = '값을 입력해주세요.'
            return result;
          }

          result.valid = true;
          return result;
        } else {
          result = { ref: "", name: "etc4", valid: true, warningMessage: "" };
          return result;
        }
      },
    },
    team: {
      validate: () => {
        const result = getValidResult(teamRef.current);
        if (teamRef.current.value.length === 0) {
          result.warningMessage = '값을 입력해주세요.'
          return result;
        }

        result.valid = true;
        return result;
      },
      convert: () => {
        return teamRef.current.value.trim();
      },
    },
  }

const formInfoIndividual = {
    nickname: {
      validate: () => {
        const result = getValidResult(nicknameRef.current);
        if (nicknameRef.current.value.length === 0) {
          result.warningMessage = '값을 입력해주세요.'
          return result;
        }

        result.valid = true;
        return result;
      },
    },
    email: {
      validate: () => {
        const result = getValidResult(emailRef.current);
        if (emailRef.current.value.length === 0) {
          result.warningMessage = '값을 입력해주세요.';
          return result;
        } else if (!emailRef.current.value.includes('@')) {
          result.warningMessage = '@를 포함해야 합니다.';
          return result;
        }

        result.valid = true;
        return result;
      },
                    },
    name: {
      validate: () => {
        const result = getValidResult(nameRef.current);
        if (nameRef.current.value.length === 0) {
          result.warningMessage = '값을 입력해주세요.'
          return result;
        }

        result.valid = true;
        return result;
      },
    },
    phone: {
      validate: () => {
        const result = getValidResult(phoneRef.current);
        if (phoneRef.current.value.length === 0) {
          result.warningMessage = '값을 입력해주세요.'
          return result;
        } else if (phoneRef.current.value.length < 13) {
          result.warningMessage = '값을 모두 입력해주세요.'
          return result;
        }

        result.valid = true;
        return result;
      },
      convert: () => {
        // https://cublip.tistory.com/326
        return phoneRef.current.value
          .replace(/[^0-9]/g, "")
          .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3")
          .replace("--", "-");
      },
    },
    birthday: {
      validate: () => {
        const result = getValidResult(birthdayRef.current);
        let checkBirth = birthdayRef.current.value.split(".");
        let maxYear = new Date().getFullYear();

        if (birthdayRef.current.value.length === 0) {
          result.warningMessage = '값을 입력해주세요.'
          return result;
        } else if (birthdayRef.current.value.length < 10) {
          result.warningMessage = '값을 모두 입력해주세요.'
          return result;
        } else if (Number(checkBirth[0]) < 1900 || Number(checkBirth[0]) >= maxYear) {
          result.warningMessage = '날짜를 다시 확인해주세요.'
          return result;
        } else if (Number(checkBirth[1]) === 0 || Number(checkBirth[1]) > 12) {
          result.warningMessage = '날짜를 다시 확인해주세요.'
          return result;
        } else if (Number(checkBirth[1]) === 1 || Number(checkBirth[1]) === 3 || Number(checkBirth[1]) === 5 || Number(checkBirth[1]) === 7 || Number(checkBirth[1]) === 8 || Number(checkBirth[1]) === 10 || Number(checkBirth[1]) === 12) {
          if (Number(checkBirth[2]) === 0 || Number(checkBirth[2]) > 31) {
            result.warningMessage = '날짜를 다시 확인해주세요.'
            return result;
          }
        } else if (Number(checkBirth[1]) === 2) {
          if (Number(checkBirth[2]) === 0 || Number(checkBirth[2]) > 29) {
            result.warningMessage = '날짜를 다시 확인해주세요.'
            return result;
          }
        } else if (Number(checkBirth[1]) === 4 || Number(checkBirth[1]) === 6 || Number(checkBirth[1]) === 9 || Number(checkBirth[1]) === 11) {
          if (Number(checkBirth[2]) === 0 || Number(checkBirth[2]) > 30) {
            result.warningMessage = '날짜를 다시 확인해주세요.'
            return result;
          }
        }
        result.valid = true;
        return result;
      },
      convert: () => {
        // todo 정규식 활용하여 바로 변환되도록 수정 해야 함
        const birthday = birthdayRef.current.value;
        const length = birthday.length;

        if (length >= 11) {
          return birthday.substring(0, 10);
        }

        if (isNaN(birthday[length - 1])) {
          return birthday.substring(0, length - 1);
        }

        if (length === 5 && birthday.charAt(4) !== '.') { // '19950' -> '1995.0'
          return birthday.substring(0, 4) + '.' + birthday.charAt(4);
        } else if (length === 8 && birthday.charAt(7) !== '.') { // '1995.071' -> '1995.07.1'
          return birthday.substring(0, 7) + '.' + birthday.charAt(7);
        } else if (length === 5 && birthday.charAt(4) === '.') {
          return birthday.substring(0, 4);
        } else if (length === 8 && birthday.charAt(7) === '.') {
          return birthday.substring(0, 7);
        }

        return birthday;
      },
    },
    etc1: {
      validate: () => {
          let result;
          if (etcRef1.current !== undefined) {
            result = getValidResult(etcRef1.current);
            if (etcRef1.current.value.length === 0) {
              result.warningMessage = '값을 입력해주세요.'
              return result;
            }

            result.valid = true;
            return result;
          } else {
            result = { ref: "", name: "etc1", valid: true, warningMessage: "" };
            return result;
          }
      },
    },
    etc2: {
      validate: () => {
        let result;
        if (etcRef2.current !== undefined) {
          result = getValidResult(etcRef2.current);
          if (etcRef2.current.value.length === 0) {
            result.warningMessage = '값을 입력해주세요.'
            return result;
          }

          result.valid = true;
          return result;
        } else {
          result = { ref: "", name: "etc2", valid: true, warningMessage: "" };
          return result;
        }
      },
    },
    etc3: {
      validate: () => {
        let result;
        if (etcRef3.current !== undefined) {
          result = getValidResult(etcRef3.current);
          if (etcRef3.current.value.length === 0) {
            result.warningMessage = '값을 입력해주세요.'
            return result;
          }

          result.valid = true;
          return result;
        } else {
          result = { ref: "", name: "etc3", valid: true, warningMessage: "" };
          return result;
        }
      },
    },
    etc4: {
      validate: () => {
        let result;
        if (etcRef4.current !== undefined) {
          result = getValidResult(etcRef4.current);
          if (etcRef4.current.value.length === 0) {
            result.warningMessage = '값을 입력해주세요.'
            return result;
          }

          result.valid = true;
          return result;
        } else {
          result = { ref: {}, name: "etc4", valid: true, warningMessage: "" };
          return result;
        }
      },
    }
}

  const getValidResult = (ref, valid = false, warningMessage = null) => { // 병합할 떄 삭제된 부분
    return { ref, name: ref.name, valid, warningMessage };
  };

  const onSubmit = (event) => {
    setWarningMessageMap(
      {
      nickname: '',
      email: '',
      name: '',
      phone: '',
      birthday: '',
      etc1: '',
      etc2: '',
      etc3: '',
      etc4: '',
      team: ''}
      );

    const { recruit_start_date, recruit_end_date } = compeInfo;
    if (!isDateTimeRange(new Date(recruit_start_date), new Date(recruit_end_date))) {
      openPopup({
        type: popupType.MESSAGE,
        props: { message: `대회 모집 기간이 아닙니다.`, }
      })
      return ;
    }
    let birth = replaceAll(birthdayRef.current.value, ".", "-");
    let isLeader = 0;

    event.preventDefault();

    let formValid = true;

    if (!agreeCheckRef.current.checked) {
      openPopup({
        type: popupType.MESSAGE,
        props: {
          message: '약관에 동의해야 대회에 참가할 수 있습니다.'
        }
      })
      return;
    }

    const tempWarningMessageMap = {};
    let firstInvalidRef = null;

    if (isTeamfight) {
      if (teamLeaderCheckRef.current.checked) {
        isLeader = 1;
      }
      Object.keys(formInfo).forEach((key) => {
        const { validate } = formInfo[key];
        const { valid, ref, name, warningMessage } = validate?.();
        if (!valid) {
          tempWarningMessageMap[name] = warningMessage;
          formValid = false;
          if (!firstInvalidRef) {
            firstInvalidRef = ref;
          }
        }
      })
    } else {
      Object.keys(formInfoIndividual).forEach((key) => {
        const { validate } = formInfoIndividual[key];
        const { valid, ref, name, warningMessage } = validate?.();
        if (!valid) {
          tempWarningMessageMap[name] = warningMessage;
          formValid = false;
          if (!firstInvalidRef) {
            firstInvalidRef = ref;
          }
        }
      })
    }
    if (formValid) {
      openPopup({ type: popupType.LOADING, })
      setTimeout(() => {
        sendApply(compeInfo.competition_index, isTeamfight, birth, isLeader);
      }, 500);
    } else {
      // force rerendering
      flushSync(() => {
        setWarningMessageMap(tempWarningMessageMap);
      })

      const to = firstInvalidRef.parentElement.parentElement;
      window.scroll({
        top: to.offsetTop + 50,
        behavior: 'smooth'
      });
    }
  }

  useEffect(() => {
    const id = searchParams.get('id');
    getCompeInfo(id);
  }, [searchParams, getCompeInfo])

  return (
    <BasicLayout >
      <DummyContainer />
      <PhoneContainer>
        <Title>참가 신청</Title>
        {
          compeInfo && <GameTitleContainer >{compeInfo.event_name}</GameTitleContainer>
        }
        <Form ref={formRef}>
          <div className='input-item'>
            <InputBox className='input-box'>
              <Label htmlFor='nickname'>게임 닉네임</Label>
              <input
                ref={nicknameRef}
                maxLength={20}
                onChange={onChange}
                name='nickname'
                id='nickname'
                type='text'
                placeholder='탑 장인 잭스'
                autoComplete='off'
              />
            </InputBox>
            <Warning>{warningMessageMap.nickname}</Warning>
          </div>
          <div className='input-item'>
            <InputBox className='input-box'>
              <Label htmlFor='email'>이메일</Label>
              <input
                ref={emailRef}
                maxLength={100}
                onChange={onChange}
                name='email'
                id='email'
                type='email'
                placeholder='example@vss.gg.com'
                autoComplete='off'
              />
            </InputBox>
            <Warning>{warningMessageMap.email}</Warning>
          </div>
          <div className='input-item'>
            <InputBox className='input-box'>
              <Label htmlFor='name'>이름</Label>
              <input
                ref={nameRef}
                maxLength={45}
                onChange={onChange}
                name='name'
                id='name'
                type='text'
                placeholder='홍길동'
                autoComplete='off'
              />
            </InputBox>
            <Warning>{warningMessageMap.name}</Warning>
          </div>
          <div className='input-item'>
            <InputBox className='input-box'>
              <Label htmlFor='phone'>휴대폰 번호</Label>
              <input
                ref={phoneRef}
                maxLength={13}
                onChange={onChange}
                name='phone'
                id='phone'
                type='text'
                placeholder='010-0000-0000'
                autoComplete='off'
              />
            </InputBox>
            <Warning>{warningMessageMap.phone}</Warning>
          </div>
          <div className='input-item'>
            <InputBox className='input-box'>
              <Label htmlFor='birthday'>생년월일</Label>
              <input
                ref={birthdayRef}
                maxLength={11}
                onChange={onChange}
                name='birthday'
                id='birthday'
                type='text'
                placeholder='2000.01.01'
                autoComplete='off'
              />
            </InputBox>
            <Warning>{warningMessageMap.birthday}</Warning>
          </div>

          {
            isTeamfight &&
            <>
              <div className='input-item input-item-team'>
                <InputBox className='input-box'>
                  <Label htmlFor='team'>팀명</Label>
                  <input
                    ref={teamRef}
                    maxLength={20}
                    onChange={onChange}
                    name='team'
                    id='team'
                    type='text'
                    placeholder='우승은 우리'
                    autoComplete='off'
                  />
                  <CheckBox
                    reference={teamLeaderCheckRef}
                    name='teamLeaderCheck'
                    label='* 팀장 체크'
                    beforeOrAfter='after'
                    fontSize='.8rem !important'
                    styles={{
                      position: 'absolute',
                      right: '1px',
                      color: color.teamLeader,
                      top: '1rem',
                      flexDirection: 'column',
                      
                      '@media (max-width: 3000px)': {
                        transform: 'none',
                      },
                      '@media (max-width: 1200px)': {
                        marginRight: '0',
                      },
                    }}
                    checkboxSize={{
                      width: '0.7rem',
                      height: '0.7rem'
                    }}
                    checkboxColor={color.grey}
                  />
                </InputBox>
                <Warning>{warningMessageMap.team}</Warning>
              </div>

            </>
          }
          {
            Object.values(etcName)?.map((etc, index) => {
              if (etc !== null) {
                return (
                  <div key={index} className='input-item'>
                    <InputBox className='input-box'>
                      <Label htmlFor='etc'>{etc}</Label>
                      <input
                        ref={etcRefArray[index]}
                        maxLength={100}
                        onChange={onChange}
                        name={"etc"+(index+1)}
                        id={"etc"+(index+1)}
                        type='text'
                        placeholder={etc}
                        autoComplete='off'
                      />
                    </InputBox>
                    <Warning>{warningMessageMap["etc"+(index+1)]}</Warning>
                  </div>
                )
              }
              return <div key={index}></div>;
            })
          }
          <div className='input-item dummy' />
        </Form>

        <GuideTextBox>
          <GuideText>대회 참가 안내는 문자 메시지로 발송됩니다.</GuideText>
          <br/>
          <GuideText>070 번호를 스팸 번호로 등록하였거나 수신 차단했을 경우 대회 안내 메시지를 받지 못할 수 있습니다.</GuideText>
          <br/>
          <GuideText>VSS.GG의 대회 문의 사항 및 공지 사항을 확인해 주시면 감사하겠습니다.</GuideText>
        </GuideTextBox>


        <h4 style={{
          textAlign: 'center',
          marginBottom: '1rem',
        }}>
          서비스 이용약관 및 개인정보 수집⦁이용 동의
        </h4>
        <TermHtmlViewer
          html={personalInfoHtml}
          blockStyles={blockStyles(readonly)}
        />
        <CheckBox
          reference={agreeCheckRef}
          name='agreeCheck'
          label='모든 약관 및 규정을 확인하고 동의합니다.'
          beforeOrAfter='before'
          fontSize='1rem'
          checkboxSize={{
            width: '.9rem',
            height: '.9rem'
          }}
        />
      </PhoneContainer>
      <JoinButtonWrapper>
        <JoinButton onClick={onSubmit}>참가하기</JoinButton>
      </JoinButtonWrapper>
    </BasicLayout>
  );
};

const Label = styled.label`
  background-color: ${color.td};
  ${media.minCustom(9999)} {
    margin-right: 10px;
  }
`;

const Warning = styled.p`
  margin-bottom: 10px;
  margin-left: 40%;
  color: ${color.blushRed};
  padding-left: 5px;
  padding-right: 5px;
  word-break: break-all;
  ${media.custom(9999)} {
    margin-left: 0;
  }
`;

const Form = styled.form`
  width: 80%;
  margin: 0 auto;
  margin-bottom: 3rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .chk-team-leader {
    position: absolute;
    border: 1px solid red;
    right: 3.3rem;
  }

  /* input-item */
  .input-item {
    padding-right: 10%;
    flex: 1 1 50%;
    max-width: 50%;
    position: relative;
  }
  .input-item:nth-child(even) {
    padding-left: 5%;
  }
  ${media.custom(9999)} {
    .input-item {
      padding-right: 0;
    }
  }
  ${media.mobile} {
    .input-item, .input-item:nth-child(even) {
      flex: 1 1 100%;
      max-width: 100%;
      padding-right: 0;
      padding-left: 0;
      margin-right: 10vw;
      min-width: 300px;
    }
  }
  ${media.custom(1200)} {
    ${media.mobile} {
      .input-item, .input-item:nth-child(even) {
        margin-right: 0;
      }
    }
  }
  .input-item .dummy {
    opacity: 0;
  }
`;

const InputBox = styled.div`
  display: flex;
  padding: 1rem 0 0 0;
  margin-bottom: 5px;
  label {
    flex: 0 0 40%;
    font-weight: ${font.weight.bold};
    font-size: 1rem;
    padding-bottom: 3px;
  }
  input {
    flex: 0 0 60%;
    outline: none;
    border: none;
    border-bottom: 1px solid ${color.grey};
    color: ${color.dark};
    font-weight: ${font.weight.regular};
    letter-spacing: 0.05rem;
    font-size: 0.8rem;
    padding: 0 5px 3px 5px;
  }
  ${media.custom(9999)} {
    flex-direction: column;
    label {
      margin-bottom: 10px;
      padding-left: 5px;
    } 
  }
`;


const GuideTextBox = styled.div`
  text-align: center;
  margin-Top: 5px;
  margin-Bottom: 60px;
`;

const GuideText = styled.label`
  color: ${color.teamLeader};
  font-size: 1rem;
`;

const DummyContainer = styled.section`
  background-color: ${color.white};
  height: 6rem;
`;

const GameTitleContainer = styled(DummyContainer)`
  background-color: ${color.feelDark};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 -1rem;
  margin-bottom: 3rem;
  padding: 2rem;
  height: auto;
  font-size: 1.4rem;
  text-align: center;
  letter-spacing: 0.05rem;
`;

const Title = styled.h3`
  margin-top: 1rem;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: 0.05rem;
`;

const JoinButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 3rem;
  color: white;
`;

const JoinButton = styled.button`
  background-color: ${color.blushRed};
  color: white;
  font-size: 1.2rem;
  font-weight: ${font.weight.bold};
  letter-spacing: 0.4px;
  width: 140px;
  height: 60px;
  border-radius: 8px;
  :hover {
    opacity: .9;
  }
`

export default UserApplyPage;