import React, { useState, useEffect, useCallback, useRef } from 'react';
import BasicLayout from '../components/layouts/BasicLayout';
import { Outlet, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import routePathMap from '../route/path';
import GameBannerContainer from '../components/competition/GameBannerContainer';
import PhoneContainer from '../components/common/PhoneContainer';
import styled from 'styled-components';
import color from '../styles/color';
import font from '../styles/font';
import { getCompetitionInfo } from '../api/competition';
import useCompetitionStore from '../stores/useCompetitionStore';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowButton from '../components/common/ArrowButton';
import useWindowResize from '../hooks/useWindowResize';
import { usePopupStore } from '../stores/usePopupStore';
import popupType from '../lib/popupType';
import { useAdminStore } from '../stores/useAdminStore';
import media from '../styles/media';
import { FaRegEnvelope } from 'react-icons/fa'

const menuIndexMap = {
  INFO: 0, NOTICE: 1, HELP: 2, SCRUM: 3,
  JOB: 4, PARTICIPANTS: 5, SCHEDULE: 6, MESSAGE: 7,
};

const menuItemList = [
  {
    index: menuIndexMap.INFO,
    name: '대회 정보',
    resourceName: 'info',
    routePath: routePathMap.COMPETITION.CHILD.INFO,
  },
  {
    index: menuIndexMap.NOTICE,
    name: '공지 사항',
    resourceName: 'notice',
    routePath: routePathMap.COMPETITION.CHILD.NOTICE,
  },
  {
    index: menuIndexMap.HELP,
    name: '문의 사항',
    resourceName: 'help',
    routePath: routePathMap.COMPETITION.CHILD.HELP,
  },
  {
    index: menuIndexMap.SCRUM,
    name: '스크림 모집',
    resourceName: 'scrum',
    routePath: routePathMap.COMPETITION.CHILD.SCRUM,
  },
  {
    index: menuIndexMap.JOB,
    name: '팀원 모집',
    resourceName: 'job',
    routePath: routePathMap.COMPETITION.CHILD.JOB,
  },
  {
    index: menuIndexMap.PARTICIPANTS,
    name: '명단 확인',
    resourceName: 'participants',
    routePath: routePathMap.COMPETITION.CHILD.PARTICIPANTS,
  },
  {
    index: menuIndexMap.SCHEDULE,
    name: '대진표',
    resourceName: 'schedule',
    routePath: routePathMap.COMPETITION.CHILD.SCHEDULE,
  },
  {
    index: menuIndexMap.MESSAGE,
    // name: '알림톡',
    name: '문자 전송',
    resourceName: 'message',
    routePath: routePathMap.COMPETITION.CHILD.MESSAGE,
  },
];

const menuItemListExceptMessage = menuItemList.filter(menuItem => menuItem.index !== menuIndexMap.MESSAGE);
const messageMenuItem = menuItemList.find(menuItem => menuItem.index === menuIndexMap.MESSAGE);

const settings = {
  dots: false,
  infinite: false,
  draggable: true,
  speed: 500,
  rows: 1,
  slidesToScroll: 1,
  arrows: false
};

const arrowButtonStyles = {
  backgroundColor: `${color.commonDark}`,
};

const CompetitionPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [id, setId] = useState(0);

  const openPopup = usePopupStore((state) => state.open);
  const closePopup = usePopupStore((state) => state.close);
  const location = useLocation();
  const { info, changeInfo, menuIndex, changeMenuIndex } = useCompetitionStore();
  const [compeInfo, setCompeInfo] = useState(info);
  const navigate = useNavigate();
  const viewportWidth = useWindowResize();
  const [slidesToShow, setSlidesToShow] = useState(7);
  const [arrowButtonVisibility, setArrowButtonVisibility] = useState('hidden');

  const [currentMenu, setCurrentMenu] = useState(menuItemList[menuIndex]);
  const sliderRef = useRef();

  const { setAPIKey, competition_id, setCompetitionId } = useAdminStore();
  const logined = useAdminStore((state) => state.logined);
  const logout = useAdminStore((state) => state.logout);

  const competitionInfo = useCallback(async (index) => {
    const responsedInfo = await getCompetitionInfo(index);
    if (responsedInfo !== undefined || responsedInfo !== null) {
      setCompeInfo(responsedInfo);
      changeInfo(responsedInfo);
    }
  }, [setCompeInfo, changeInfo]);

  const getHeaderRightButton = useCallback(() => {
    if (logined) {
      return {
        id: 0,
        name: 'logined',
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
                    setCompetitionId(null);
                    setAPIKey(null);
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
    } else {
      return {
        id: 0,
        name: '관리자 로그인',
        handleClick: () =>
          navigate({
            pathname: routePathMap.ADMIN_LOGIN.INDEX,
          }, {
            state: {
              compeIndex: id,
            }
          })
      }
    }
  }, [logined, logout, setAPIKey, setCompetitionId, openPopup, closePopup, id, navigate]); // add id, navigate 
  const [headerRightButtons, setHeaderRightButtons] = useState([getHeaderRightButton()]);
  useEffect(() => {
    setHeaderRightButtons([getHeaderRightButton()])
  }, [getHeaderRightButton])

  useEffect(() => {
    const idx = searchParams.get('id');
    setId(idx);
    const { pathname } = location;
    competitionInfo(idx);
    if (pathname === `/${routePathMap.COMPETITION.INDEX}`) {
      const navigateOption = {
        replace: true,
        state: { index: idx }
      }
      switch (menuIndex) {
        case menuIndexMap.INFO:
          navigate({
            pathname: routePathMap.COMPETITION.CHILD.INFO,
            search: `?id=${idx}`,
          }, navigateOption);
          break;
        case menuIndexMap.NOTICE:
          navigate({
            pathname: routePathMap.COMPETITION.CHILD.NOTICE,
            search: `?id=${idx}`,
          }, navigateOption);
          break;
        case menuIndexMap.HELP:
          navigate({
            pathname: routePathMap.COMPETITION.CHILD.HELP,
            search: `?id=${idx}`,
          }, navigateOption);
          break;
        case menuIndexMap.SCRUM:
          navigate({
            pathname: routePathMap.COMPETITION.CHILD.SCRUM,
            search: `?id=${idx}`,
          }, navigateOption);
          break;
        case menuIndexMap.JOB:
          navigate({
            pathname: routePathMap.COMPETITION.CHILD.JOB,
            search: `?id=${idx}`,
          }, navigateOption);
          break;
        case menuIndexMap.PARTICIPANTS:
          navigate({
            pathname: routePathMap.COMPETITION.CHILD.PARTICIPANTS,
            search: `?id=${idx}`,
          }, navigateOption);
          break;
        case menuIndexMap.SCHEDULE:
          navigate({
            pathname: routePathMap.COMPETITION.CHILD.SCHEDULE,
            search: `?id=${idx}`,
          }, navigateOption);
          break;
        case menuIndexMap.MESSAGE:
          navigate({
            pathname: routePathMap.COMPETITION.CHILD.MESSAGE,
            search: `?id=${idx}`,
          }, navigateOption);
          break;
        default:
          break;
      }

      if (location.state?.loginSuccss) {
        openPopup({
          type: popupType.MESSAGE,
          props: {
            message: '로그인 성공',
            styles: {
              fontSize: '2rem',
              fontWeight: `${font.weight.bold}`,
            }
          }
        })
      }
    }
  }, [location, navigate, id, competitionInfo, openPopup, closePopup, menuIndex, searchParams, logined, logout, competition_id, setCompetitionId]);

  useEffect(() => {
    let slides = 8;
    slides = viewportWidth < 1000 ? 5 : slides;
    slides = viewportWidth < 750 ? 3 : slides;
    slides = viewportWidth < 450 ? 2 : slides;
    slides = viewportWidth < 300 ? 1 : slides;
    setSlidesToShow(slides);
    if (slides <= 5) {
      const findMenuIndex = (menuItem) => currentMenu.name === menuItem.name;
      sliderRef.current.slickGoTo(menuItemList.findIndex(findMenuIndex));
    }
    setArrowButtonVisibility(viewportWidth < 1000 ? 'visible' : 'hidden');
  }, [viewportWidth, currentMenu]);

  return (
    <BasicLayout headerRightButtons={headerRightButtons}>
      {
        compeInfo && (
          <GameBannerContainer
            index={compeInfo[0].competition_index}
            compeInfo={compeInfo[0]}
            title={compeInfo[0].event_name}
          />
        )
      }
      <DummyContainer />
      {/*
      - https://reactrouter.com/en/main/hooks/use-outlet-context
      - https://stackoverflow.com/questions/63765196/pass-props-to-outlet-in-react-router-v6
      */}
      {/* 
      - <Outlet> 컴포넌트는 <AnyContentBlock> 컴포넌트로 대체
      - 즉 <ContentContainer> 컴포넌트가 <AnyContentBlock> 컴포넌트를 감싸고 있는 형태로 구현
      <ContentContainer>
        <AnyContentBlock />
      </ContentContainer>
      */}
      <PhoneContainer>
        <Head>
          <Title>{currentMenu.name}</Title>
          {
            logined && (
              <MessageMenu 
                className={`${messageMenuItem.name === currentMenu.name ? 'active' : ''}`}
                onClick={() => {
                  setCurrentMenu(messageMenuItem);
                  changeMenuIndex(messageMenuItem.index);
                  navigate({
                    pathname: messageMenuItem.routePath,
                    search: `?id=${id}`,
                  });
                }}
              >
                <FaRegEnvelope />
                {/* <h4>알림톡</h4> */}
                <h4>단체 문자 보내기</h4>
              </MessageMenu>
            )
          }
        </Head>
        <MenuBlock>
          <ArrowButton
            leftOrRight={'left'}
            handleClick={() => sliderRef.current.slickPrev()}
            styles={{
              ...arrowButtonStyles,
              visibility: arrowButtonVisibility
            }}
          />
          <CustomSlider ref={sliderRef} {...settings} slidesToShow={slidesToShow}>
            {
              menuItemListExceptMessage.map((item) => {
                return (
                  <MenuItem
                    key={item.index}
                    className={`menu-item ${item.name === currentMenu.name ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentMenu(item);
                      changeMenuIndex(item.index);
                      navigate({
                        pathname: item.routePath,
                        search: `?id=${id}`,
                      });
                    }}
                  >
                    {item.name}
                  </MenuItem>
                );
              })
            }
          </CustomSlider>
          <ArrowButton
            leftOrRight={'right'}
            handleClick={() => sliderRef.current.slickNext()}
            styles={{
              ...arrowButtonStyles,
              visibility: arrowButtonVisibility
            }}
          />
        </MenuBlock>
        <Outlet context={{ headerRightButtons, compeInfo, viewportWidth }} />
      </PhoneContainer>
    </BasicLayout>
  );
};

const CustomSlider = styled(Slider)`
  text-align: center;
  .slick-track {
    display: flex;
    align-items: center;
  };
  .slick-list {
    width: 100%;
    margin: 0 auto;
  }
  .menu-item {
    display: inline-flex !important;
    justify-content: center;
    align-items: center;
    margin: 0 1px;
    width: 95% !important;
  };
  ${media.custom(1000)} {
    .slick-list {
      width: 85%;
    }
  }
  ${media.custom(450)} {
    .slick-list {
      width: 75%;
    }
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
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: 0.05rem;
`;

const MessageMenu = styled.div`
  display: flex;
  position: absolute;
  right: 5%;
  color: ${color.stoneGrey};
  top: 0;
  height: 100%;
  align-items: center;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.3rem;
  cursor: pointer;
  svg {
    font-size: 1.2rem;
  }
  h4 {
    line-height: 1.3rem;
    font-size: 1rem;
    margin-left: 5px;
  }
  ${media.custom(500)} {
    svg {
      font-size: 0.8rem;
    }
    h4 {
      line-height: 1.3rem;
      font-size: 0.7rem;
      margin-left: 5px;
    }
  }
  ${media.custom(400)} {
    svg {
      font-size: 0;
    }
    h4 {
      line-height: 1.3rem;
      font-size: 0.7rem;
      margin-left: 5px;
    }
  }
  :hover, &.active {
    color: black;
  }
`

const MenuBlock = styled.div`
  position: relative;
  background-color: ${color.commonDark};
  font-size: 0.8rem;
  font-weight: ${font.weight.bold};
  color: ${color.white};
  padding: 1rem;
  margin: 0 -1rem;
`;

const MenuItem = styled.div`
  cursor: pointer;
  padding: 0.5rem;
  height: 50px;
  border-radius: 10px;
  transition: all .2s ease-in-out;
  &:hover {
    background-color: ${color.blushRed};
  };
  &.active {
    background-color: ${color.blushRed};
    color: ${color.whiteSmoke};
    font-weight: ${font.weight.bold};
  };
`;

const DummyContainer = styled.section`
  background-color: white;
  height: 6rem;
`;

export default CompetitionPage;