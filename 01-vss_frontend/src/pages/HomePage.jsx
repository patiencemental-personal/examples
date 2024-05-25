import React, { useState, useCallback, useEffect } from 'react';
import BasicLayout from '../components/layouts/BasicLayout';
import BannerSliderContainer from '../components/home/BannerSliderContainer';
import HomeCompetitionPostContainer from '../components/home/HomeCompetitionPostContainer';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import routePathMap from '../route/path';

const HomePage = () => {

  const navigate = useNavigate();
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  const getSlideHeightRatio = useCallback(() => {
    // return viewportWidth <= 768 ? 1.06 : 3.31
    return viewportWidth <= 768 ? 1.06 : 4.8
  }, [viewportWidth])

  const [slideHeight, setSlideHeight] = useState(`${viewportWidth / getSlideHeightRatio()}px`);

  const handleResize = useCallback(() => {
    setViewportWidth(window.innerWidth);
  }, []);

  const headerRightButtons = [
    {
      id: 0,
      name: '서비스 소개',
      handleClick: () => navigate(routePathMap.USER_GUIDE.INDEX)
    }
  ]

  useEffect(() => {
    setSlideHeight(`${viewportWidth / getSlideHeightRatio()}px`);
  }, [viewportWidth, getSlideHeightRatio]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize])

  return (
    <BasicLayout headerRightButtons={headerRightButtons}>
      <BannerSliderContainer viewportWidth={viewportWidth} slideHeight={slideHeight} />
      <DummyContainer />
      <HomeCompetitionPostContainer viewportWidth={viewportWidth} />
    </BasicLayout>
  );
};

const DummyContainer = styled.section`
  height: 6rem;
  background-color: white;
`;

export default HomePage;