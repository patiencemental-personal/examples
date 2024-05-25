import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowButton from '../common/ArrowButton';
import React, { memo, useMemo, useRef } from 'react';
import { useGameListStore } from '../../stores/useReadonlyStateStore';
import styled, { css } from 'styled-components';
import color from '../../styles/color';
import { useState } from 'react';
import { useEffect } from 'react';
import media from '../../styles/media';

const settings = {
  dots: false,
  infinite: false,
  draggable: true,
  speed: 500,
  // slidesToShow: 5,
  // rows: 3,
  slidesToScroll: 1,
  arrows: false
};

const arrowButtonStyles = {
  backgroundColor: `${color.commonDark}` 
}

const GameMenuSlider = memo(({ onClick, viewportWidth }) => {
  const sliderRef = useRef();
  const { gameList } = useGameListStore();
  const [slidesToShow, setSlidesToShow] = useState(1);
  const [rows, setRows] = useState(2);
  
  const gameMenuList = useMemo(() => {
    return ['전체 대회', ...gameList].map((item, index) => { 
      return { id: index, name: item };
    });
  }, [gameList]);
  const [activeMenuId, setActiveMenuId] = useState(gameMenuList[0].id);

  useEffect(() => {
    let slides = 4;
    // slides = viewportWidth < 1532 ? 4 : slides;
    slides = viewportWidth < 1420 ? 3 : slides;
    slides = viewportWidth < 994 ? 2 : slides;
    // slides = viewportWidth < 750 ? 1 : slides;
    setSlidesToShow(slides);

    // let rows = viewportWidth < 1200 ? 3 : 2
    setRows(rows);
  }, [viewportWidth]);

  return (
    <GameMenu>
        <ArrowButton
          regular
          leftOrRight={'left'}
          handleClick={() => sliderRef.current.slickPrev()}
          styles={arrowButtonStyles}
        />
        <Slider ref={sliderRef} {...settings} slidesToShow={slidesToShow} rows={rows}>
        {
          gameMenuList.map(item => {
            return (
              <GameSlideWrapper
                key={item.id}
                onClick={() => {
                  onClick(item.name);
                  // onClick(item.name.split(' ').join(''));
                }}
              >
                <GameSlide 
                  active={activeMenuId === item.id} 
                  onClick={() => { setActiveMenuId(item.id) }}
                >{item.name}</GameSlide>
              </GameSlideWrapper>
            );
          })
        }
        </Slider>
        <ArrowButton
          regular
          leftOrRight={'right'}
          handleClick={() => sliderRef.current.slickNext()}
          styles={arrowButtonStyles}
        />
      </GameMenu>
  );
});

const GameMenu = styled.div`
  position: relative;
  background-color: ${color.commonDark};
  padding: 0.5rem 4rem;
  margin: 0 -1rem;
`;

const GameSlideWrapper = styled.span``;

const GameSlide = styled.div`
  line-height: 35px;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 300;
  margin: 1px;
  border-radius: 10px;
  cursor: pointer;
  color: white;
  transition: all .2s ease-in-out;
  &:hover {
    color: ${color.whiteSmoke};
    background-color: ${color.blushRed};
  };
  ${props => 
    props.active && css`
    background-color: ${color.blushRed};
    color: ${color.whiteSmoke};
  `};
  ${media.mobile} {
    font-size: 1rem;
  }
  ${media.custom(450)} {
    font-size: 0.7rem;
  }
  ${media.custom(360)} {
    font-size: 0.6rem;
  }
`;
export default GameMenuSlider;