import React, { memo } from 'react';
import styled from 'styled-components';
import media from '../../styles/media';
import color from '../../styles/color';
import ImagePost from './ImagePost';
import { useEffect } from 'react';
import { useState, useRef } from 'react';
import SkeletonPost from './SkeletonPost';
import CreationPost from './CreationPost';

const dummyPosts =   [
  {
    idx: 'dummy_1',
    imgUrl: `${process.env.PUBLIC_URL}/images/poster/defaultPoster_5.png`,
    info: {
      event_name: '보은군 청소년 E-Sports 대회',
      recruit_start_date: '2022-10-08T17:00:16',
      event_end_time: '2022-10-25T17:00:16',
    }
  },
  {
    idx: 'dummy_2',
    imgUrl: `${process.env.PUBLIC_URL}/images/poster/defaultPoster_4.jpg`,
    info: {
      event_name: '수성대학교 X 이스포츠코리아 스쿨 토너먼트',
      recruit_start_date: '2022-09-20T17:00:16',
      event_end_time: '2022-10-01T17:00:16',
    }
  },
  {
    idx: 'dummy_3',
    imgUrl: `${process.env.PUBLIC_URL}/images/poster/defaultPoster_3.jpg`,
    info: {
      event_name: '꿈을 Job 축제 E-Sports 게임대회',
      recruit_start_date: '2022-09-03T17:00:16',
      event_end_time: '2022-09-28T17:00:16',
    }
  },
  {
    idx: 'dummy_4',
    imgUrl: `${process.env.PUBLIC_URL}/images/poster/defaultPoster_2.jpg`,
    info: {
      event_name: '수성구청년축제 E-Sports 게임대회',
      recruit_start_date: '2022-09-18T17:00:16',
      event_end_time: '2022-09-18T17:00:16',
    }
  },
  {
    idx: 'dummy_5',
    imgUrl: `${process.env.PUBLIC_URL}/images/poster/defaultPoster_1.jpg`,
    info: {
      event_name: '종로 e스포츠대회 꿈을 e루어드림',
      recruit_start_date: '2022-08-21T17:00:16',
      event_end_time: '2022-08-27T17:00:16',
    }
  },
]

const defaultPostStyles = {
  display: 'inline-block',
  width: '100%',
  borderRadius: '24px',
  boxShadow: `0px 5px 7px 1px ${color.grey}`,
  cursor: 'pointer',
}

const PostListBlock = memo(({ competitionList, loading }) => {

  const creationPostRef = useRef();
  const [postHeight, setPostHeight] = useState();

  const updatePostHeight = () => {
    setPostHeight(`${creationPostRef.current.getBoundingClientRect().width * 1.5}px`)
  }

  useEffect(() => {
    updatePostHeight();
    window.addEventListener('resize', updatePostHeight);
    return () => window.removeEventListener('resize', updatePostHeight);
  }, []);

  return (
    <PostList>
      <CreationPost
        ref={creationPostRef}
        postHeight={postHeight}
        styles={defaultPostStyles}
      />
      {
        loading ? (
          Array(7).fill(0).map((item, index) => {
            return (
              <SkeletonPost
                key={index}
                postHeight={postHeight}
                styles={defaultPostStyles}
              />
            )
          })
        ) : (
          <React.Fragment>
            {
              competitionList.map(((item, index) => {
                return (
                  <ImagePost
                    info={competitionList[index]}
                    idx={item.competition_index}
                    key={item.competition_index}
                    index={item.competition_index}
                    imgUrl={`${process.env.REACT_APP_BASE_ORIGIN2}${item.poster}`}
                    postHeight={postHeight}
                    styles={defaultPostStyles}
                  />
                );
              }))
            }
            {/* dummy posters */}
            {
              dummyPosts.slice(0, 7 - competitionList.length).map((item) => {
                return (
                  <ImagePost
                    info={item.info}
                    idx={item.idx}
                    key={item.idx}
                    index={item.idx}
                    imgUrl={item.imgUrl}
                    postHeight={postHeight}
                    styles={defaultPostStyles}
                  />
                )
              })
            }
          </React.Fragment>
        )
      }
    </PostList>
  );
});

const PostList = styled.div`
  display: grid;
  justify-items: center;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
  padding: 1rem 0rem;
  ${media.small} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export default PostListBlock;