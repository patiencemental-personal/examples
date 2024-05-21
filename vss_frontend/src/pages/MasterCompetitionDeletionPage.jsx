import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PhoneContainer from '../components/common/PhoneContainer';
import MasterLayout from '../components/layouts/MasterLayout';
import color from '../styles/color';
import media from '../styles/media';
import { TiDeleteOutline } from 'react-icons/ti';
import { usePopupStore } from '../stores/usePopupStore';
import { useMasterStore } from '../stores/useMasterStore';
import popupType from '../lib/popupType'
import routePathMap from '../route/path';
import moment from 'moment/moment';
import { getCompetitionList, getCompetitionLastPage } from '../api/competition';
import { deleteCompetition } from '../api/admin';
import { sortBannerList } from '../refactoring/MasterCompetitionDeletionPage_refactoring';

const MasterCompetitionDeletionPage = () => {
  const navigate = useNavigate();
  const openPopup = usePopupStore((state) => state.open)
  const closePopup = usePopupStore((state) => state.close);
  const { logined, logout, apiKey } = useMasterStore();

  const headerLeftMenu = [
    {
      id: 0,
      active: false,
      name: '배너관리',
      to: routePathMap.MASTER_BANNER_MANAGEMENT.INDEX
    },
    {
      id: 1,
      active: true,
      name: '대회삭제',
      to: routePathMap.MASTER_COMPETITION_DELETION.INDEX
    },
  ]

  const headerRightButton = useMemo(() => {
    if (logined) {
      return [
        {
          id: 0,
          name: 'logined',
          type: "admin_logined",
          handleClick: () => {
            openPopup({
              type: popupType.MESSAGE,
              props: {
                message: '정말 로그아웃 하시겠습니까?',
                buttons: [
                  {
                    name: '예',
                    onClick: () => {
                      logout();
                      navigate(`/${routePathMap.HOME.INDEX}`)
                      closePopup();
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
        }
      ]
    }
  }, [logined, logout, navigate, openPopup, closePopup]);

  const [competitions, setCompetitions] = useState([]);

  const getCompetitions = useCallback(async ()=>{
    let allCompetitions = [];
    const lastPage = await getCompetitionLastPage();
    for(let i =1;i<=lastPage;i++) {
      const competitionList = await getCompetitionList(i);
      allCompetitions = [...allCompetitions].concat(competitionList);
    }

    if(allCompetitions.length !== 0) {
      allCompetitions = sortBannerList(allCompetitions).reverse();
      setCompetitions(allCompetitions);
    }
  }, [])

  const setResponse = useCallback((response)=>{
    if(response === 200) {
      getCompetitions();
      openPopup({
        type: popupType.MESSAGE,
        props: {
          message: `삭제되었습니다.`,
          buttons: [
            {
              name: '확인',
              onClick: () => {
                closePopup();
                window.location.reload(); 
              }
            }
          ]
        }
      });
      return;
    }

    if(response === 400) {
      openPopup({
        type: popupType.MESSAGE,
        props: {
          message: `다시 시도해주시기 바랍니다.`,
          buttons: [
            {
              name: '확인',
              onClick: () => {
                closePopup();
              }
            }
          ]
        }
      });
      return;
    }

    if(response === 401) {
      openPopup({
        type: popupType.MESSAGE,
        props: {
          message: `세션이 만료되었습니다.`,
          buttons: [
            {
              name: '확인',
              onClick: () => {
                logout();
                closePopup();
              }
            }
          ]
        }
      });
      return;
    }

    if(response === 500 || response === undefined) {
        openPopup({
        type: popupType.MESSAGE,
        props: {
          message: `에러가 발생하였습니다.`,
          buttons: [
            {
              name: '확인',
              onClick: () => {
                closePopup();
              }
            }
          ]
        }
      });
      return;
    }
  }, [getCompetitions, logout, openPopup, closePopup])

  const funcDeleteCompetition = useCallback(async (competition)=>{
    const { competition_index, event_name } = competition;
    openPopup({
      type: popupType.MESSAGE,
      props: {
        message: `${event_name} 대회를 삭제하시겠습니까?`,
        buttons: [
          {
            name: '확인',
            onClick: async () => {
              closePopup();
              openPopup({ type: popupType.LOADING })
              const response = await deleteCompetition(competition_index, apiKey);
              closePopup();
              setResponse(response);
            }
          },
          {
            name: '취소',
            onClick: () => {
              closePopup();
            }
          },
        ]
      }
    });
  }, [openPopup, closePopup, apiKey, setResponse]);
  
  useEffect(() => {
    if (!logined) {
      navigate(`/${routePathMap.HOME.INDEX}`);
      return;
    } else {
      getCompetitions();
    }
  }, [logined, navigate, getCompetitions])

  return (
    <MasterLayout headerLeftMenu={headerLeftMenu} headerRightButtons={headerRightButton}>
      <DummyContainer />
      <WrapperPhoneContainer>
        <PhoneContainer>
          <Head><Title>대회 삭제</Title></Head>
          <Competitions>
            {
              competitions?.map((item) => (
                <CompetitionInfoBlock  key={new Date().getTime() + item.competition_index}>
                  <CompetitionInfo>
                    <h3>{item.event_name}</h3>
                    <span>
                      {moment(item.recruit_start_date).format('LL')} ~ {moment(item.event_end_time).format('LL')}
                    </span>
                  </CompetitionInfo>
                  <DeleteButton onClick={()=> funcDeleteCompetition(item) }><TiDeleteOutline/></DeleteButton>
                </CompetitionInfoBlock>
              ))
            }
          </Competitions>
        </PhoneContainer>
        <DummyContainerForButtons />
      </WrapperPhoneContainer>
    </MasterLayout>
  );
};

const DeleteButton = styled.button`
  position: absolute;
  color: ${color.blushRed};
  right: -10%;
  top: 25%;
  font-size: 2.5rem;
`;

const CompetitionInfoBlock = styled.div`
  width: 85%;
  display: flex;
  position: relative;
`;

const CompetitionInfo = styled.div`
  border-radius: 8px;
  border: 1px solid black;
  width: 100%;
  height: auto;
  padding: 1rem;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 0.5rem;
  h3 {
    margin-bottom: 10px;
  }
  span {
    color: ${color.stoneGrey};
  }
`;

const Competitions = styled.div`
  border-radius: 8px;
  box-shadow: 0px 5px 7px 1px ${color.grey};
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
  .first {
    border: 1px solid white;
  }
`;

const Head = styled.div`
  width: 100%;
  position: relative;
  margin-top: 1rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h3`
  letter-spacing: 0.05rem;
  font-size: 1.75rem;
  font-weight: 600;
`;

const DummyContainer = styled.section`
  height: 8rem;
  background-color: white;
  ${media.mobile} {
    height: 6rem;
  }
`;

const DummyContainerForButtons = styled.section`
  height: 4rem;
  background-color: white;
`;

const WrapperPhoneContainer = styled.section`
  padding-bottom: 3.7rem;
  background-color: white;
`;

export default MasterCompetitionDeletionPage;