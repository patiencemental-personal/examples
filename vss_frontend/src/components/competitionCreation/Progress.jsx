import React from 'react';
import styled from 'styled-components';
import color from '../../styles/color';
import media from '../../styles/media';

const Progress = ({stepsInfo, currentStep}) => {
  return (
    <ProgressStatus>
      <ProgressBar 
        width={`${(100 / (stepsInfo.length - 1)) * (currentStep - 1)}%`}
      />
      {
        stepsInfo.map((stepItem, index) => {
          return (
            <Circle
              key={index}
              className={(stepItem.step <= currentStep) ? 'active' : ''}
            >
              <span className='step'>{stepItem.step}</span>
              <span className='title'>{stepItem.circleTitle}</span>
            </Circle>
          )
        })
      }
    </ProgressStatus>
  );
};

const ProgressStatus = styled.div`
  padding: 3rem 0;
  margin: auto;
  width: 80%;
  
  z-index: 1;
  position: relative;
  display: flex;
  justify-content: space-between;
  ::before {
    content: '';
    background-color: #e0e0e0;
    width: 100%;

    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    height: 4px;
  }
`
const ProgressBar = styled.div`
  background-color: ${color.successGreen};
  width: ${props => props.width};
  transition: 0.4s ease;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  height: 4px;
`;

const Circle = styled.div`
  position: relative;
  z-index: 2;
  background-color: #fff;
  color: #999;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  border: 3px solid #e0e0e0;
  transition: 0.4s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  span.title {
    position: absolute;
    width: 500%;
    top: 130%;
    left: 50%;
    transform: translateX(-50%);
  }
  &.active {
    border-color: ${color.successGreen};
    color: ${color.darkGrey}
  }
  ${media.small} {
    span.title {
      font-size: 0.9rem;
    }
  }
`

export default Progress;