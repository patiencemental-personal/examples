import React, { useEffect, useState } from 'react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import routePathMap from '../../route/path';
import { useAdminStore } from '../../stores/useAdminStore';
import color from '../../styles/color';
import font from '../../styles/font';
import media from '../../styles/media';
import { usePopupStore } from '../../stores/usePopupStore';
import popupType from '../../lib/popupType';
import { isDateTimeRange } from '../../lib/date';

const GameBannerContainer = ({ compeInfo, index, title }) => {
  const openPopup = usePopupStore((state) => state.open)
  const navigate = useNavigate();
  const [compeBanner, setCompeBanner] = useState("");

  const logined = useAdminStore((state) => state.logined);
  // https://stackoverflow.com/questions/49618618/copy-current-url-to-clipboard
  const copyCompetitionInfoLink = () => {
    const tempInput = window.document.createElement('input');
    const link = window.location.href;

    window.document.body.appendChild(tempInput);
    tempInput.value = link;
    tempInput.select();
    window.document.execCommand('copy');
    window.document.body.removeChild(tempInput);
  };

  const userApplyOrCompetitionUpdateButton = useCallback(()=> {
    if(logined) {
      return (
        <Button onClick={() => {
          navigate({
            pathname: routePathMap.COMPETITION_UPDATION.INDEX,
            state: { competitionIndex: index }
          })
        }}>수정하기</Button>
      )
    } else {
      return(
        <Button onClick={() => {
          const { recruit_start_date, recruit_end_date } = compeInfo;
          if (!isDateTimeRange(new Date(recruit_start_date), new Date(recruit_end_date))) {
            openPopup({
              type: popupType.MESSAGE,
              props: { message: `대회 모집 기간이 아닙니다.`, }
            })
          } else {
            navigate({
              pathname: routePathMap.USER_APPLY.INDEX,
              search: `?id=${index}`
            })
          }
        }}>참가하기</Button>
      )
    }
  }, [logined, index, navigate, compeInfo, openPopup]);

  useEffect(()=> {
    if(index === 1) {
      setCompeBanner(`${process.env.PUBLIC_URL}/images/test/kb_e_content_game_banner_lol.jpg`);
    } else {
      setCompeBanner(`${process.env.PUBLIC_URL}/images/test/kb_e_content_game_banner_star.jpg`);
    }
  }, [index])

  return (
    <Container>
      {/* {compeBanner && <img src={compeBanner} alt="game banner" />} */}
      <BackgroundColor />
      <Block>
        <Title>{title}</Title>
        {userApplyOrCompetitionUpdateButton()}
        <div className='copy-buttons'>
          <span
            className='buttonItem' 
            onClick={() => {
              copyCompetitionInfoLink();
              toast.success('링크가 복사되었습니다.')
            }}
          >
            <i className="fa-solid fa-link"></i>
            <span className='linkText'>초대링크 복사</span>
          </span>
          <span
            className='buttonItem' 
            onClick={() => {
              openPopup({ 
                type: popupType.QRCODE,
                props: { qrValue: window.location.href, title: title }
              })
            }}
          >
            <i className="fa-solid fa-qrcode"></i>
            <span className='linkText'>QR 코드 복사</span>
          </span>
        </div>
      </Block>
    </Container>
  );
};

const Container = styled.section`
  position: relative;
  height: 250px;
  overflow: hidden;
  img {
    position: absolute;
    height: 150%;
  };
  @media (min-width: 1200px) {
    width: 100%;
  };
  display: flex;
  justify-content: center;
`;

const BackgroundColor = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  /* background-color: ${color.stoneGrey}; */
  background-color: ${color.commonDark};
  /* opacity: .5; */
`;

const Block = styled.div`
  position: absolute;
  width: 810px;
  ${media.custom(810)} {
    width: 100%;
  }
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .copy-buttons {
    display: flex;
    flex-direction: row;
    color: red;
    position: absolute;
    right: 1rem;
    bottom: 10px;
    font-weight: ${font.weight.semiBold};
    color: ${color.white};
    span.buttonItem {
      display: flex;
      align-items: center;
      margin-left: 1.2rem;
    }
    span {
      margin-left: 8px;
      cursor: pointer;
      font-size: 0.8rem;
    }
    svg {
      background-color: ${color.blushRed};
      border-radius: 50%;
      padding: 0.3rem;
    }
    span.linkText:hover {
      color: ${color.blushRed}
    }
    ${media.mobile} {
      right: 0.6rem;
      span.buttonItem {
        margin-left: 0.6rem;
      }
      span {
        font-size: 0.7rem
      }
      svg {
        font-size: 0.55rem;
      }
    }
  }
`;

const Title = styled.p`
  text-align: center;
  margin-bottom: 2.5rem;
  padding: 0 1rem;
  font-weight: ${font.weight.bold};
  font-size: 1.7rem;
  color: ${color.white};
  ${media.mobile} {
    font-size: 1.2rem;
  }
`;

const Button = styled.button`
  border-radius: 8px;
  font-size: 1.3rem;
  font-weight: ${font.weight.semiBold};
  width: 120px;
  height: 50px;
  background-color: ${color.blushRed};
  color: ${color.white};
  transition: .2s;
  &:hover {
    opacity: .9;
  };
  ${media.mobile} {
    width: 90px;
    height: 37.5px;
    font-size: 1rem;
  }
`;

export default GameBannerContainer;