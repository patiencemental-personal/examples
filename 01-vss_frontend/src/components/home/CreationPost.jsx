import React from 'react';
import styled, { css } from 'styled-components';
import media from '../../styles/media';
import font from '../../styles/font';
import color from '../../styles/color';
import { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import routePathMap from '../../route/path';

const CreationPost = forwardRef(({ styles, postHeight }, ref) => {
  const navigate = useNavigate();
  return (
    <Post 
      ref={ref}
      postHeight={postHeight}
      styles={styles}
      onClick={() => { navigate(`${routePathMap.COMPETITION_CREATION.INDEX}`) }}
    >
      <PostBlock postHeight={postHeight}>
        <div><button><i className="fa-solid fa-plus"></i></button></div>
        <span>새로운 대회 생성</span>
      </PostBlock>
    </Post>
  );
});

const Post = styled.article`
  ${props => props.styles && css`${props.styles}`}
  height: ${props => props.postHeight};
  color: ${color.commonDark};
  border: 3px solid ${color.commonDark};
  background-color: ${color.feelGrey};
  position: relative;
  transition: all .4s linear;
  :hover {
    background-color: ${color.commonDark};
    button {
      border-color: ${color.white};
      background-color: ${color.white};
    };
    span {
      color: ${color.white};
    };
  };
`;

const PostBlock = styled.div`
  ${props => props.styles && css`${props.styles}`}
  height: ${props => props.postHeight};
  width: 100%;
  transition: all .4s linear;
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  div {
    flex: 1 1 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  button {
    width: 120px;
    height: 120px;
    svg {
      font-size: 3rem;
    }
    border-radius: 50%;
    font-weight: ${font.weight.bold};
    border: 6px solid ${color.commonDark};
  };
  span {
    flex: 1 1 40%;
    text-align: center;
    font-weight: ${font.weight.bold};
    font-size: 1rem;
  };
  ${media.custom(800)} {
    button {
      width: 140px;
      height: 140px;
    }
    span {
      font-size: 1.4rem;
    }
  };
  ${media.custom(500)} {
    div {
      /* flex: 1 1 70%; */
    }
    button {
      width: 100px;
      height: 100px;
      border: 4px solid ${color.commonDark};
      svg {
        font-size: 1.2rem;
      }
    }
    span {
      font-size: 0.9rem;
    }
  };
`;

export default CreationPost;