import React from 'react';
import styled, { css } from 'styled-components';
import transition from '../../styles/transition';

const SkeletonPost = ({ postHeight, styles }) => {
  return <Post postHeight={postHeight} styles={styles} />;
};

const Post = styled.article`
  ${props => props.styles && css`${props.styles}`}
  height: ${props => props.postHeight};
  opacity: .7s;
  animation: ${transition.skeletonLoading} 1s linear infinite alternate;
`;

export default SkeletonPost;