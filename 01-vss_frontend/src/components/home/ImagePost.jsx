import React, { memo } from 'react';
import styled, { css } from 'styled-components';
import color from '../../styles/color';
import media from '../../styles/media';
import { useNavigate } from 'react-router-dom';
import routePathMap from '../../route/path';
import moment from 'moment/moment';
import 'moment/locale/ko';
import { usePopupStore } from '../../stores/usePopupStore';
import popupType from '../../lib/popupType';

const ImagePost = memo(({ imgUrl, idx, info, postHeight, styles }) => {
  const navigate = useNavigate();
  const openPopup = usePopupStore((state) => state.open);

  return (
    <PostWrapper
      onClick={() => {
        // dummy post의 경우는 네비게이션 동작 안하도록 수정
        if (typeof idx === 'string' && idx.indexOf('dummy') >= 0) {
          openPopup({
            type: popupType.MESSAGE,
            props: { message: '접근할 수 없는 대회 정보 입니다.' }
          })
          return;
        }

        navigate({
          pathname: `/${routePathMap.COMPETITION.INDEX}`,
          search: `?id=${idx}`,
        }, {
          state: {
            index: idx,
            menuIndex: 0,
          }
        })
      }}
      postHeight={postHeight}
      styles={styles}
    >
      <Image
        className='image'
        imgUrl={imgUrl}
        postHeight={postHeight}
        styles={styles}
      />
      {
        info && (
          <Typo className='type'>
            {/* <div className='content'>
              {info.event_name}
            </div> */}
            <div className='date'>
              <p>
                {moment(info.recruit_start_date).format('LL')}
              </p>
              <p className='right'>
                ~ {moment(info.event_end_time).format('LL')}
              </p>
            </div>
          </Typo>
        )
      }
    </PostWrapper>
  )
});

const PostWrapper = styled.article`
  position: relative;
  box-shadow: none;
  overflow: hidden;
  isolation: isolate;
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
  ${props => props.styles && css`${props.styles}`}
  height: ${props => props.postHeight};
  &:hover {
    -webkit-transform: translateY(-0.5rem);
    transform: translateY(-0.5rem);
    box-shadow: 0px 16px 8px -1px ${color.grey};
    .image {
      -webkit-transform: scale(1.1);
      transform: scale(1.1);
    }
    .type {
      bottom: 0;
    }
  }
`;

const Typo = styled.div`
  background-color: ${color.commonDark};
  color: white;
  position: absolute;
  width: 100%;
  letter-spacing: 0.05rem;
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
  /* height: 160px;
  bottom: -160px; */
  height: 25%;
  bottom: -25%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  p.right {
    text-align: right;
  }
  .content {
    text-align: center;
    font-size: 0.8rem;
    margin-bottom: 10px;

    overflow: hidden;
    white-space: normal;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    /* word-break: keep-all;   // 문단으로 끊어져서 줄바꿈 됨 */
    word-break: break-all;
  }
  .date {
    font-size: 0.7rem;
  }
  ${media.small} {
    .content {
      font-size: 1.1rem;
    }
    .date {
      font-size: 1rem;
    } 
  }
  ${media.custom(500)} {
    height: 25%;
    bottom: -25%;
    .content {
      font-size: 0.75rem;
    }
    .date {
      font-size: 0.65rem;
    }
  }
`

const Image = styled.article`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.imgUrl});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  ${props => props.styles && css`${props.styles}`}
  height: ${props => props.postHeight};
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
`;

export default ImagePost;