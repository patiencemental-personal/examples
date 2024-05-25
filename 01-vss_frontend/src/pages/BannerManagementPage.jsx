import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PhoneContainer from '../components/common/PhoneContainer';
import PcBannerSliderContainer from '../components/bannerManagement/PcBannerSliderContainer';
import MobileBannerSliderContainer from '../components/bannerManagement/MobileBannerSliderContainer';
import MasterLayout from '../components/layouts/MasterLayout';
import color from '../styles/color';
import font from '../styles/font';
import { BiCheckCircle } from 'react-icons/bi';
import { TiDeleteOutline } from 'react-icons/ti';
import { usePopupStore } from '../stores/usePopupStore';
import { useMasterStore } from '../stores/useMasterStore';
import popupType from '../lib/popupType'
import useLoading from '../hooks/useLoading';
import routePathMap from '../route/path';
import { getBannerList } from '../api/competition';
import { deletePCBanner, deleteMobileBanner, putPCPriority, putMobilePriority } from '../api/admin';
import { PCBannerDataSetting, MobileBannerDataSetting, Order_Or_NotOrder_BannerData } from '../refactoring/BannerManagementPage_Refactoring';

const BannerManagementPage = () => {
  const navigate = useNavigate();

  const modeType = useMemo(() => {
    return {
      "MODE_PC": 'PC',
      "MODE_MOBILE": 'MOBILE'
    }
  }, [])

  const [banners, setBanners] = useState([]);
  const [orderBanners, setOrderBanners] = useState([]);
  const [deleteBanners, setDeleteBanners] = useState([]);
  const [pcBanners, setPcBanners] = useState([]);
  const [mobileBanners, setMobileBanners] = useState([]);

  const [mode, setMode] = useState(modeType["MODE_PC"]);
  const [isEdit, setIsEdit] = useState(false)

  const [loading, startLoading, endLoading] = useLoading(); // eslint-disable-line no-unused-vars

  const openPopup = usePopupStore((state) => state.open)
  const closePopup = usePopupStore((state) => state.close);
  const { logined, logout, apiKey } = useMasterStore();
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  const setBannerInfoType = useMemo(() => {
    return {
      async PC(bannerInfo) {
        let newBannerData = await PCBannerDataSetting(bannerInfo);
        let checkOrderData = Order_Or_NotOrder_BannerData(newBannerData[0]);
        setOrderBanners(checkOrderData[0])
        setBanners(checkOrderData[1]);

        setPcBanners(newBannerData[1]);
      },
      async MOBILE(bannerInfo) {
        let newBannerData = await MobileBannerDataSetting(bannerInfo);
        let checkOrderData = Order_Or_NotOrder_BannerData(newBannerData[0]);
        setOrderBanners(checkOrderData[0])
        setBanners(checkOrderData[1]);

        setMobileBanners(newBannerData[1]);
      }
    }
  }, [])

  const getBannerInfo = useCallback(async () => {

    const bannerInfo = await getBannerList();
    if (bannerInfo !== undefined) {
      setBannerInfoType[mode](bannerInfo);
    }
  }, [setBannerInfoType, mode]);

  const setResponseType = useCallback((response) => {
    if (response === 201) {
      getBannerInfo();
      window.location.reload(); 
    } else if (response === 401) {
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
    } else {
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
    }
  }, [openPopup, closePopup, logout, getBannerInfo])

  const funcDeletePCBanner = useCallback(async (banner) => {
    let response = await deletePCBanner(banner, apiKey);
    setResponseType(response);
  }, [apiKey, setResponseType]);
  
  const funcDeleteMobileBanner = useCallback(async (banner) => {
    let response = await deleteMobileBanner(banner, apiKey);
    setResponseType(response);
  }, [apiKey, setResponseType]);

  const deleteBanner = useMemo(() => {
    return {
      PC(banner) {
        funcDeletePCBanner(banner);
      },
      MOBILE(banner) {
        funcDeleteMobileBanner(banner);
      }
    }
  }, [funcDeletePCBanner, funcDeleteMobileBanner]);

  const deletePermanently = (banner) => {
    setDeleteBanners([...deleteBanners, banner])
    const filtered = banners.filter(bannerItem => bannerItem.index !== banner.index)
    setBanners([...filtered])
  }

  const deleteBannerType = useCallback((banner) => {
    deleteBanner[mode](banner);
  }, [deleteBanner, mode]);

  const funcPutPCBannerPriority = useCallback(async(newOrderBanners) => {
    let response = await putPCPriority(newOrderBanners, apiKey);
    setResponseType(response);
  }, [apiKey, setResponseType]);

  const funcPutMobileBannerPriority = useCallback(async(newOrderBanners) => {
    let response = await putMobilePriority(newOrderBanners, apiKey);
    setResponseType(response);
  }, [apiKey, setResponseType]);

  const changeBannerPriority = useMemo(() => {
    return {
      PC(newOrderBanners) {
        funcPutPCBannerPriority(newOrderBanners);
      },
      MOBILE(newOrderBanners) {
        funcPutMobileBannerPriority(newOrderBanners);
      }
    }
  }, [funcPutPCBannerPriority, funcPutMobileBannerPriority]);

  const changeBannerPriorityType = useCallback((newOrderBanners) => {
    changeBannerPriority[mode](newOrderBanners);
  }, [changeBannerPriority, mode]);

  const handleResize = useCallback(() => {
    setViewportWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize])

  const sortBannerType = useMemo(() => {
    return {
      PC(banners) {
        setPcBanners(banners);
      },
      MOBILE(banners) {
        setMobileBanners(banners);
      }
    }
  }, [setPcBanners, setMobileBanners]);

  const deleteOrderBanner = (banner) => {
    banner.check = false;
    const filtered = orderBanners.filter(orderBanner => orderBanner.index !== banner.index);
    setBanners([...banners, banner])
    setOrderBanners([...filtered])
  }

  const addOrderBanner = (banner) => {
    const found = orderBanners.find(orderBanner => orderBanner.index === banner.index);
    const filteredBanners = banners.filter(bannerItem => bannerItem.index !== banner.index)
    if (found) {
      openPopup({
        type: popupType.MESSAGE,
        props: { message: '이미 추가된 배너 입니다.' }
      })
    } else {
      banner.check = true;
      setBanners([...filteredBanners]);
      setOrderBanners([...orderBanners, banner])
    }
  }

  const update = useCallback(() => {
    let newOrderBanners = {};
    let deleteBannerIndexs = [];

    const deleteBannerList = () => {
      deleteBanners.forEach(item => {
        deleteBannerIndexs = [...deleteBannerIndexs, item.index];
      })
      deleteBannerType(deleteBannerIndexs);
      setIsEdit(false);
    }

    if(orderBanners.length === 0) {
      for (let i in banners) {
        let j = Number(i) + 1;
        newOrderBanners = { ...newOrderBanners, [banners[i].index]: j + 50 }
      }
      changeBannerPriorityType(newOrderBanners);
      setIsEdit(false);
      if(deleteBanners.length !== 0) {
        deleteBannerList();
      }
      return;
    }

    if(banners.length === 0) {
      for (let i in orderBanners) {
        let j = Number(i) + 1;
        newOrderBanners = { ...newOrderBanners, [orderBanners[i].index]: j }
      }
      changeBannerPriorityType(newOrderBanners);
      setIsEdit(false);
      if(deleteBanners.length !== 0) {
        deleteBannerList();
      }
      return;
    }

    if(orderBanners.length !== 0 && banners.length !== 0) {
      for (let i in orderBanners) {
        let j = Number(i) + 1;
        newOrderBanners = { ...newOrderBanners, [orderBanners[i].index]: j }
      }

      for (let i in banners) {
        let j = Number(i) + 1;
        newOrderBanners = { ...newOrderBanners, [banners[i].index]: j + 50 }
      }
      changeBannerPriorityType(newOrderBanners);
      setIsEdit(false);
      if(deleteBanners.length !== 0) {
        deleteBannerList();
      }
      return;
    }

  }, [changeBannerPriorityType, deleteBannerType, orderBanners, deleteBanners, openPopup])

  const [draggedItemIndex, setDraggedItemIndex] = useState(null)
  const [draggedOverItemIndex, setDraggedOverItemIndex] = useState(null);

  const sortDragItems = () => {
    const copiedOrderBanners = [...orderBanners]
    const draggedOrderBanner = copiedOrderBanners[draggedItemIndex]
    const draggedOverOrderBanner = copiedOrderBanners[draggedOverItemIndex]
    copiedOrderBanners[draggedItemIndex] = draggedOverOrderBanner
    copiedOrderBanners[draggedOverItemIndex] = draggedOrderBanner

    // clear
    setDraggedItemIndex(null)
    setDraggedOverItemIndex(null)

    sortBannerType[mode](copiedOrderBanners);
    setOrderBanners(copiedOrderBanners)
  }

  const headerLeftMenu = [
    {
      id: 0,
      active: true,
      name: '배너관리',
      to: routePathMap.MASTER_BANNER_MANAGEMENT.INDEX
    },
    {
      id: 1,
      active: false,
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

  useEffect(() => {
    if (!logined) {
      navigate(`/${routePathMap.HOME.INDEX}`);
      return;
    } else {
      getBannerInfo();
      setIsEdit(false);
    }
  }, [logined, navigate, getBannerInfo])

  useEffect(()=>{
    if (orderBanners.length !== 0 && banners.length !== 0) {
      sortBannerType[mode]([...orderBanners].concat([...banners]))
      return;
    }

    if(orderBanners.length === 0) {
      sortBannerType[mode]([...banners])
      return;
    }
    
    if(banners.length === 0) {
      sortBannerType[mode]([...orderBanners])
      return;
    }
    
  }, [mode, sortBannerType, orderBanners, banners])

  return (
    <MasterLayout headerLeftMenu={headerLeftMenu} headerRightButtons={headerRightButton}>
      {
        (mode === modeType["MODE_PC"]) && (pcBanners.length > 0) && (
          <PcBannerSliderContainer
            banners={pcBanners}
            loading={loading}
            viewportWidth={viewportWidth}
          />
        )
      }
      {
        (mode === modeType["MODE_MOBILE"]) && (mobileBanners.length > 0) && (
          <MobileBannerSliderContainer
            banners={mobileBanners}
            loading={loading}
            viewportWidth={viewportWidth}
          />
        )
      }
      <DummyContainer />
      <WrapperPhoneContainer>
        <PhoneContainer>
          <Head><Title>배너 관리</Title></Head>
          <ModeSelect>
            <button
              className={mode === modeType["MODE_PC"] ? 'selected' : ''}
              onClick={() => {
                startLoading(300)
                setMode(modeType["MODE_PC"])
              }}
            >
              웹페이지
            </button>
            <button
              className={mode === modeType["MODE_MOBILE"] ? 'selected' : ''}
              onClick={() => {
                startLoading(300)
                setMode(modeType["MODE_MOBILE"])
              }}
            >
              모바일
            </button>
          </ModeSelect>
          <BannerOrderInfo>
            <BannerInfo className='first'>
              <BannerTitle className='first'>제목</BannerTitle>
              <BannerOrder className='first'>순서</BannerOrder>
            </BannerInfo>
            {/* order banner list */}
            {
                orderBanners?.map((banner, index) => {
                  return (
                    <BannerInfoBlock
                      key={new Date().getTime()+index}
                      draggable={isEdit}
                      onDragStart={() => setDraggedItemIndex(index)}
                      onDragEnter={() => setDraggedOverItemIndex(index)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => sortDragItems()}
                    >
                      <BannerInfo className='order'>
                        <BannerTitle>{banner.title}</BannerTitle>
                        <BannerOrder>{index+1}</BannerOrder>
                      </BannerInfo>

                      {
                        isEdit &&
                        (
                          banner.check !== true ?
                            <CheckButton onClick={() => addOrderBanner(banner)}><BiCheckCircle /></CheckButton>
                            :
                            <OrderDeleteButton onClick={() => deleteOrderBanner(banner)}><TiDeleteOutline /></OrderDeleteButton>
                        )
                      }
                    </BannerInfoBlock>
                  )
                })
            }
            {/* banner list */}
            {
                banners?.map((banner, index) => {
                  return (
                    <BannerInfoBlock key={index}>
                      {
                        isEdit === true ? (
                          <DeleteButton onClick={() => deletePermanently(banner)}>ㅡ</DeleteButton>
                        ) : <></>
                      }
                      <BannerInfo>
                        <BannerTitle>{banner.title}</BannerTitle>
                        <BannerOrder></BannerOrder>
                      </BannerInfo>
                      {
                        isEdit &&
                        (
                          banner.check !== true ?
                            <CheckButton onClick={() => addOrderBanner(banner)}><BiCheckCircle /></CheckButton>
                            :
                            <OrderDeleteButton onClick={() => deleteOrderBanner(banner)}><TiDeleteOutline /></OrderDeleteButton>
                        )
                      }
                    </BannerInfoBlock>
                  )
                })
            }
          </BannerOrderInfo>
          <ButtonsBlock>
            {
              isEdit ? (<Button onClick={update}>저장하기</Button>)
                : (<Button onClick={() => setIsEdit(true)}>수정하기</Button>)
            }
          </ButtonsBlock>
        </PhoneContainer>
        <DummyContainerForButtons />
      </WrapperPhoneContainer>
    </MasterLayout>
  );
};

const DeleteButton = styled.button`
  color: ${color.blushRed};
  background-color: white;
  box-shadow: 0px 5px 7px 1px ${color.grey};
  left: 5%;
  :hover {
    box-shadow: 0px 5px 7px 1px ${color.blushRed};
  }

  position: absolute;
  font-weight: 900;
  display: flex;
  justify-content: center;
  align-content: center;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
`

const CommonRightButtonSytle = styled.button`
  right: 5%;
  font-size: 2.5rem;
  position: absolute;
  display: flex;
  justify-content: center;
  align-content: center;
`

const OrderDeleteButton = styled(CommonRightButtonSytle)`
  color: ${color.blushRed};
`

const CheckButton = styled(CommonRightButtonSytle)`
  color: #00B71C;
`

const BannerInfoBlock = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;

`

const BannerTitle = styled.div`
  &.first {
    width: 20%;
    text-align: center;
  }
`

const BannerOrder = styled.div`
  width: 20%;
  text-align: center;
`

const BannerInfo = styled.div`
  border-radius: 8px;
  border: 1px solid black;
  width: 75%;
  height: 70px;
  padding: 1rem;
  display: flex;
  align-items: center;
  display: flex;
  justify-content: space-between;
`

const BannerOrderInfo = styled.div`
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
`

const ModeSelect = styled.div`
  font-size: 1.2rem;
  text-align: center;
  padding: 1.5rem 0;
  margin: 0 -1rem;
  margin-bottom: 3rem;
  background-color: ${color.commonDark};
  button {
    letter-spacing: 0.05rem;
    margin: 0 2.5%;
    border-radius: 8px;
    color: white;
    padding: 1.2rem 2.5rem;
    width: 200px;
    transition: .3s;
  }
  button.selected {
    background-color: ${color.blushRed};
  }
`

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
  height: 6rem;
  background-color: white;
`;

const DummyContainerForButtons = styled.section`
  height: 4rem;
  background-color: white;
`;

const WrapperPhoneContainer = styled.section`
  padding-bottom: 3.7rem;
  background-color: white;
`

const ButtonsBlock = styled.section`
  position: relative;
  top: 8rem;
  width: 66%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  background-color: white;
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

export default BannerManagementPage;