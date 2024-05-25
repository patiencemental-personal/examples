import React, { useCallback, useEffect, useRef, useState } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from 'styled-components';
import color from '../../styles/color';
import ArrowButton from '../common/ArrowButton';
import transition from '../../styles/transition';


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

const PcBannerSliderContainer = ({ banners, loading, viewportWidth }) => {
  const getSlideHeight = useCallback(() => {
    return viewportWidth / 3.31
  }, [viewportWidth])

  const sliderRef = useRef();
  const [slideHeight, setSlideHeight] = useState(`${getSlideHeight()}px`);

  useEffect(() => {
    setSlideHeight(`${getSlideHeight()}px`);
  }, [viewportWidth, getSlideHeight]);

  return (
    <Container>
      <CustomSlider ref={sliderRef} {...settings}>
        {
          loading ? (
            <SkeletonBannerSlide slideHeight={slideHeight} />
          ) : (
            banners.map(item => (
              <BannerSlide
                key={new Date().getTime() + 7}
                imgUrl={item.url}
                slideHeight={slideHeight}
              />
            ))
          )
        }
      </CustomSlider>
      <ArrowButton
        regular
        leftOrRight={'left'}
        handleClick={() => sliderRef.current.slickPrev()}
      />
      <ArrowButton
        regular
        leftOrRight={'right'}
        handleClick={() => sliderRef.current.slickNext()}
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
  margin-bottom: 2rem;
`;

const DotsContainer = styled.div`
  padding: 0 5%;
  bottom: 5%;
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
`;

export default PcBannerSliderContainer;