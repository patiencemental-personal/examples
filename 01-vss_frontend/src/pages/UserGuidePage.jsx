import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import styled from 'styled-components';
import BasicLayout from '../components/layouts/BasicLayout';
import useWindowResize from '../hooks/useWindowResize';
import media from '../styles/media';

const UserGuidePage = () => {

  const viewportWidth = useWindowResize();

  const [guideImage, setGuideImage] = useState(viewportWidth <= 750 ? 
    `${process.env.PUBLIC_URL}/images/guide/service_mobile_image.jpg` 
    : `${process.env.PUBLIC_URL}/images/guide/service_web_image.jpg`);
  
  useEffect(() => {
    setGuideImage(() => {
      const guideImageUrl = viewportWidth <= 750 ? 
      `${process.env.PUBLIC_URL}/images/guide/service_mobile_image.jpg` 
      : `${process.env.PUBLIC_URL}/images/guide/service_web_image.jpg`;
      return guideImageUrl;
    });
  }, [viewportWidth, setGuideImage]);

  return (
    <BasicLayout><GuideImage imgUrl={guideImage} /></BasicLayout>
  );
};

const GuideImage = styled.div`
  background-image: url(${props => props.imgUrl});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 2332px;
  ${media.custom(750)} {
    height: 2649px;
  }
`

export default UserGuidePage;