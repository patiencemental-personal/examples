import React from 'react';
import styled from 'styled-components';
import color from '../../../styles/color';
import media from '../../../styles/media';

const DateDivider = ({date}) => {
  return (
    <Divider>
      <Line/>
      <DateTime>{date}</DateTime>
    </Divider>
  );
};

const Divider = styled.div`
  position: relative;
  text-align: center;
  display: flex;
  justify-content: center;
  margin: 1rem 0;
`;

const Line = styled.div`
  position: absolute;
  top: 50%;
  width: 100%;
  border: 0.5px solid ${color.grey};
`;

const DateTime = styled.div`
  padding: 0 10px;
  position: relative;
  background-color: #e0e0e0;
  font-size: 14.5px;
  ${media.mobile} {
      background-color: ${color.lightGrey};
  }
  color: ${color.stoneGrey};
  ${media.mobile} {
    font-size: 13px;
  };
`;

export default DateDivider;