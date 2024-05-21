import React from 'react';
import { useState } from 'react';
import styled from 'styled-components';
import PhoneContainer from '../components/common/PhoneContainer';
import BasicLayout from '../components/layouts/BasicLayout';
import color from '../styles/color';
import media from '../styles/media';
import CompetitonCreationHeadBlock from '../components/competitionCreation/CompetitonCreationHeadBlock';
import Progress from '../components/competitionCreation/Progress';
import TermsAgreeForm from '../components/competitionCreation/form/TermsAgreeForm';
import EmailAuthForm from '../components/competitionCreation/form/EmailAuthForm';
import CreationOrUpdationCompetitionForm from '../components/competitionCreation/form/CreationOrUpdationCompetitionForm';
import CompletionForm from '../components/competitionCreation/form/CompletionForm';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import routePathMap from '../route/path';
import { useEffect } from 'react';
import { useAdminStore } from '../stores/useAdminStore';
import popupType from '../lib/popupType';
import { usePopupStore } from '../stores/usePopupStore';

const stepsInfo = [
  {
    step: 1,
    type: 'terms-agree',
    title: '약관 동의',
    circleTitle: '약관 동의',
  },
  {
    step: 2,
    type: 'email',
    title: '이메일 인증',
    circleTitle: '이메일 인증',
  },
  {
    step: 3,
    type: 'new-competition',
    title: '새로운 대회 생성',
    subTitle: '*(별표 기호) 부분은 필수 입력 항목란 입니다.',
    circleTitle: '대회 생성',
  },
  {
    step: 4,
    type: 'completion',
    title: '대회 생성 완료',
    circleTitle: '생성 완료',
  }
]

const CREATION_MODE = 'creation';
const UPDATION_MODE = 'updation';

const CompetitionCreationOrUpdationPage = () => {
  
  const competition_id = useAdminStore((state) => state.competition_id)

  const openPopup = usePopupStore((state) => state.open);
  const closePopup = usePopupStore((state) => state.close);

  const logined = useAdminStore((state) => state.logined);
  const logout = useAdminStore((state) => state.logout);
  const setCompetitionId = useAdminStore((state) => state.setCompetitionId);
  const setAPIKey = useAdminStore((state) => state.setAPIKey);

  const [authedEmail, setAuthedEmail] = useState();
  const [createdCompetitionTitle, setCreatedCompetitionTitle] = useState();

  // const [currentStep, setCurrentStep] = useState(stepsInfo[0].step);
  const [currentStep, setCurrentStep] = useState(1);

  const getCurrentStep = useCallback(() => {
    return stepsInfo[currentStep - 1];
  }, [currentStep]);

  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState();

  // 새로고침 및 페이지 종료 제어
  const preventClose = useCallback((event) => {
    event.preventDefault(); // beforeunload 이벤트 기본 동작 방지
    event.returnValue = ''; // for only chrome
  }, []);


  // 뒤로가기 제어
  const preventGoBack = useCallback(() => {
    // 브라우저 세션 기록 상태에 현재 상태의 복사본을 추가
    window.history.pushState(null, '', location.href);
    
    const { pathname } = location;
    let yesActionHandler = null;
    let questionMessage = '사항이 저장되지 않습니다.</br>뒤로 이동 하시겠습니까?';
    if (pathname.indexOf(CREATION_MODE) >= 0) {
      questionMessage = `진행${questionMessage}`
      yesActionHandler = () => {
        navigate(`/${routePathMap.HOME.INDEX}`);
        closePopup();
      }
    } else {
      questionMessage = `변경${questionMessage}`
      yesActionHandler = () => {
        navigate({
          pathname: `/${routePathMap.COMPETITION.INDEX}`,
          search: `?id=${competition_id}`,
        }, {
          replace: true,
          state: { 
            index: competition_id, 
            menuIndex: 0, 
          } 
        })
        closePopup();
      }
    }

    openPopup({
      type: popupType.MESSAGE,
      props: {
        message: questionMessage,
        buttons: [
          {
            name: '네',
            styles: { width: '100px' },
            onClick: yesActionHandler
          },
          {
            name: '아니오',
            styles: { width: '100px' },
            onClick: () => closePopup(),
          }
        ]
      }
    })
  }, [competition_id, location, navigate, openPopup, closePopup]);

  useEffect(() => {
    /**
     * @beforeunload 
     * 새로고침 혹은 페이지 종료 시 발생하는 이벤트
     * useEffect 내에서는 즉시 실행 함수를 통해 실행해야 동작이 명확해짐
     */
    (() => {
      window.addEventListener('beforeunload', preventClose);
    })();

    /**
     * @popstate
     * 뒤로가기 막기를 위해 활용하려는 이벤트
     * popstate 이벤트는 사용자의 세션 기록 탐색으로 인해 현재 활성화된 기록 항목이 바뀔 때 발생
     */
    // 브라우저 세션 기록 상태에 현재 상태의 복사본을 추가
    window.history.pushState(null, '', location.href);
    window.addEventListener('popstate', preventGoBack);

    return () => {
      window.removeEventListener('beforeunload', preventClose);
      window.removeEventListener('popstate', preventGoBack)
    };
  },[location, preventClose, preventGoBack]);

  useEffect(() => {
    openPopup({ type: popupType.FULL_SCREEN })
    const currentPathname = location.pathname;
    if (currentPathname.indexOf(CREATION_MODE) >= 0) {
      setMode(CREATION_MODE);
      closePopup();
    } else if (currentPathname.indexOf(UPDATION_MODE) >= 0) {
      setMode(UPDATION_MODE);
    }

  }, [location, openPopup, closePopup])

  const prevStep = useCallback(() => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }, [currentStep]);

  const nextStep = useCallback(() => {
    if (currentStep === stepsInfo.length) {
      navigate(`${routePathMap.INDEX}`)
      return ;
    }
    setCurrentStep(currentStep + 1);
  }, [currentStep, navigate]);

  const getHeaderRightButtons = () => {
    const buttons = [];
    if (mode === UPDATION_MODE && logined) {
      buttons.push({
        id: 0,
        name: 'logined',
        handleClick: () => {
          openPopup({
            type: popupType.MESSAGE,
            props: {
              message: '변경사항이 저장되지 않습니다.</br>정말 로그아웃 하시겠습니까?',
              buttons: [
                {
                  name: '예',
                  onClick: () => {
                    navigate({
                      pathname: `/${routePathMap.COMPETITION.INDEX}`,
                      search: `?id=${competition_id}`,
                    }, {
                      replace: true,
                      state: { 
                        index: competition_id, 
                        menuIndex: 0, 
                      } 
                    })
                    closePopup();

                    logout();
                    setCompetitionId(null);
                    setAPIKey(null);
                  },
                  styles: { width: '120px' }
                },
                {
                  name: '아니오',
                  onClick: () => {
                    closePopup();
                  },
                  styles: { width: '120px' }
                }
              ]
            }
          })
        }
      })
    }
    return buttons;
  }

  return (
    <BasicLayout headerRightButtons={getHeaderRightButtons()} >
      <DummyContainer />
      <WrapperPhoneContainer>
        <PhoneContainer>
          {
            <React.Fragment>
              {
                mode === CREATION_MODE && (
                  <React.Fragment>
                    <CompetitonCreationHeadBlock
                      title={getCurrentStep().title}
                      subTitle={getCurrentStep().subTitle}
                    />
                    <Progress
                      stepsInfo={stepsInfo}
                      currentStep={currentStep}
                    />
                  </React.Fragment>
                )
              }
              {
                mode === UPDATION_MODE && (
                  <CompetitonCreationHeadBlock
                    title='대회 수정'
                    subTitle='*(별표 기호) 부분은 필수 입력 항목란 입니다.'
                  />
                )
              }
            </React.Fragment>
          }
          <AnyStepContentWrapper>
            {
              mode === CREATION_MODE && getCurrentStep().step === 1 && (
                <TermsAgreeForm nextStep={nextStep} />
              )
            }
            {
              mode === CREATION_MODE && getCurrentStep().step === 2 && (
                <EmailAuthForm
                  setAuthedEmail={setAuthedEmail}
                  prevStep={prevStep}
                  nextStep={nextStep}
                />
              )
            }
            {
              mode === CREATION_MODE && getCurrentStep().step === 3 && (
                <CreationOrUpdationCompetitionForm
                  mode={mode}
                  setCreatedCompetitionTitle={setCreatedCompetitionTitle}
                  authedEmail={authedEmail}
                  prevStep={prevStep}
                  nextStep={nextStep}
                />
              )
            }
            {
              mode === CREATION_MODE && getCurrentStep().step === 4 && (
                <CompletionForm
                  createdCompetitionTitle={createdCompetitionTitle}
                  nextStep={nextStep}
                />
              )
            }
            {
              mode === UPDATION_MODE && (
                <CreationOrUpdationCompetitionForm
                  mode={mode}
                  // endLoading={endLoading}
                />
              )
            }
          </AnyStepContentWrapper>
        </PhoneContainer>
        <DummyContainerForButtons />
      </WrapperPhoneContainer>
    </BasicLayout>
  );
};

// const SpinnerWrapper = styled.main`  
//   height: 100vh;
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `; 

const AnyStepContentWrapper = styled.section`
  margin: 0 5%;
`

const WrapperPhoneContainer = styled.section`
  padding-bottom: 3.7rem;
  /* background-color: ${color.thickGrey}; */
  background-color: white;
`

const DummyContainer = styled.section`
  height: 8rem;
  background-color: white;
  ${media.mobile} {
    height: 6rem;
  }
`;

const DummyContainerForButtons = styled.section`
  height: 4rem;
  /* background-color: ${color.thickGrey}; */
  background-color: white;
`;

export default CompetitionCreationOrUpdationPage;