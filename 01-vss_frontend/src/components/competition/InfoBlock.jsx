import React from 'react';
import styled from 'styled-components';
import Introduction from './info/Introduction';
import MetaInfo from './info/MetaInfo';
import BaseContentBlock from './BaseContentBlock';
import media from '../../styles/media';
import { useOutletContext } from 'react-router-dom';

const InfoBlock = () => {
  const { compeInfo } = useOutletContext();

  return (
    <BaseContentBlock>
      {
        compeInfo && <MetaInfo data={compeInfo[0]} />
      }
      <PostWrapper>
      {
        compeInfo && <Post src={`${process.env.REACT_APP_BASE_ORIGIN2}${compeInfo[0].poster}`} alt='post' />
      }
      </PostWrapper>
      {
        compeInfo && <Introduction data={compeInfo[0]} />
      }
    </BaseContentBlock>
  );
};

const PostWrapper = styled.div`
  text-align: center;
`;

const Post = styled.img`
  width: 80%;
  margin-bottom: 2rem;
  ${media.mobile} {
    width: 95%;
  }
`;

export default InfoBlock;