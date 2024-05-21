import React, { useCallback, useEffect, useRef, useState } from 'react';
import useLoading from '../../hooks/useLoading';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from 'styled-components';
import color from '../../styles/color';
import media from '../../styles/media';
import ArrowButton from '../common/ArrowButton';
import { getBannerList } from '../../api/competition';
import transition from '../../styles/transition';
import routePathMap from '../../route/path';
import { useNavigate } from 'react-router-dom';
import { bannerDataSortSetting } from '../../refactoring/BannerSliderContainer_Refactoring';


const settings = {
  dots: true,
  infinite: true,
  speed: 700,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  // https://react-slick.neostack.com/docs/api#appendDots
  appendDots: dots => (
    <DotsContainer>
      <Dots>{dots}</Dots>
    </DotsContainer>
  ),
};

const arrowButtonStyles = {
  backgroundColor: `${color.commonDark}` 
}

const BannerSliderContainer = ({ viewportWidth, slideHeight }) => {

  const navigate = useNavigate();

  const sliderRef = useRef();   
  const [bannerContentList, setBannerContentList] = useState([]);
  const [loading, startLoading, endLoading] = useLoading();

  const [bannerMouseDownXY, setBannerMouseDownXY] = useState(null);
  
  const getBannerType = useCallback(() => {
    return viewportWidth <= 768 ? 'mobile' : 'desktop'
  }, [viewportWidth]);

  const search = useCallback(async () => {
    try {
      startLoading();
      const bannerList = await getBannerList();
      const resultBannerList = bannerDataSortSetting(bannerList);
      setBannerContentList(resultBannerList);
      endLoading();
    } catch (error) {
      // ...
    }
  }, [startLoading, endLoading]);
  
  useEffect(() => {
    search();
  }, [search]);

  useEffect(() => {
    const intervalID = setInterval(() => {
      sliderRef.current.slickNext()
    }, 5000)

    return () => {
      clearInterval(intervalID)
    }
  }, [])
  
  return (
    <Container>
      <CustomSlider ref={sliderRef} {...settings}>
        {
          loading ? (
            <SkeletonBannerSlide slideHeight={slideHeight} />
          ) : (
            bannerContentList[getBannerType()]?.map(item => (
              <BannerSlide
                key={item.competitionId}
                imgUrl={item.imgUrl}
                slideHeight={slideHeight}
                onMouseDown={(event) => {
                  setBannerMouseDownXY({ x: event.clientX, y: event.clientY })
                }}
                onClick={(event) => {
                  if (bannerMouseDownXY.x === event.clientX && bannerMouseDownXY.y === event.clientY) {
                    const { competitionId } = item;
                    if (competitionId === -1) { // defulat banner인 경우
                      // navigate(`${routePathMap.USER_GUIDE.INDEX}`);
                    } else {
                      navigate(
                        {
                          pathname: `/${routePathMap.COMPETITION.INDEX}`,
                          search: `?id=${competitionId}`,
                        },
                        {
                          state: { 
                            index: competitionId,
                            menuIndex: 0, 
                          }
                        }
                      )
                    }
                  }
                }}
              />
            ))
          )
        }
      </CustomSlider>
      <ArrowButton
        regular
        leftOrRight={'left'}
        handleClick={() => sliderRef.current.slickPrev()}
        styles={arrowButtonStyles}
      />
      <ArrowButton
        regular
        leftOrRight={'right'}
        handleClick={() => sliderRef.current.slickNext()}
        styles={arrowButtonStyles}
      />
    </Container>
  );
};

const CustomSlider = styled(Slider)`
  .slick-slide {
    margin-bottom: -5px;
  };
`;

const BannerSlide = styled.div`
  background-image: url(${props => props.imgUrl});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 100%;
  height: ${props => props.slideHeight};
  cursor: pointer;
  -webkit-transition: all 0.3s ease-in-out;
  transition: all 0.3s ease-in-out;
  :hover {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
`;

const SkeletonBannerSlide = styled.div`
  opacity: .7s;
  height: ${props => props.slideHeight};
  animation: ${transition.skeletonLoading} 1s linear infinite alternate;
`;

const Container = styled.section`
  position: relative;
  background-color: ${color.white};
`;

const DotsContainer = styled.div`
  padding: 0 5%;
  bottom: 5%;
  ${media.small} {
    bottom: 2%;
  }
`;

const Dots = styled.ul`
  display: flex;
  justify-content: center;
  max-width: 500px;
  min-width: 250px;
  margin: 0 auto;
  li {
    background-color: dimgray;
    position: relative;
    display: inline-block;
    width: 100%;
    height: 7px;
    margin: 0 3px;
    padding: 0;
    cursor: pointer;
  };
  li.slick-active {
    background-color: red;
  };
  li button {
    width: 100%;
    height: inherit;
    padding: 0;
    cursor: pointer;
  };
  li.slick-active button:before, li button:before {
    color: transparent;
  }
  ${media.small} {
    max-width: 150px;
    min-width: 75px;
    li {
      height: 5px;
    }
  }
`;

export default BannerSliderContainer;