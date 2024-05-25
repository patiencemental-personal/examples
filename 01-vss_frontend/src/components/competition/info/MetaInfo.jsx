import React from 'react';
import styled from 'styled-components';
import color from '../../../styles/color';
import media from '../../../styles/media';
import moment from 'moment/moment';
import 'moment/locale/ko';
import { decode } from 'html-entities';

const MetaInfo = ({ data }) => {
  return (
    <Block>
      <Item>
        <ItemTitle>대회 일정</ItemTitle>
        <ItemContent>
          <p>[모집 기간]</p>
          {
            data && <p style={{'wordBreak': 'keep-all'}}>{`${moment(data.recruit_start_date).format('LL')} ~ ${moment(data.recruit_end_date).format('LL')}`}</p>
          }
          
          <p>[대회 기간]</p>
          {
            data && <p style={{'wordBreak': 'keep-all'}}>{`${moment(data.event_start_time).format('LL')} ~ ${moment(data.event_end_time).format('LL')}`}</p>
          }
          
        </ItemContent>
      </Item>
      <Item>
        <ItemTitle>대회 장소</ItemTitle>
        <ItemContent>
          {
            [1, 2].includes(data.competition_index) ? (
              data?.place.split(',').map((placeItem, index) => {
                return <p key={index}>{placeItem.trim()}</p>
              })
            ) : (
              decode(data.place)
            )
          }
        </ItemContent>
      </Item>
      <Item>
        <ItemTitle>대회 상금</ItemTitle>
        <ItemContent>
          {
            [1, 2].includes(data.competition_index) ? (
              data?.price.split(',').map((priceItem, index) => {
                return <p key={index}>{priceItem.trim()}</p>
              })
            ) : (
              decode(data.price)
            )
          }
        </ItemContent>
      </Item>
    </Block>
  );
};

const Block = styled.div`
  display: flex;
  padding: 2rem 1rem;
  margin-bottom: 2rem;
  background-color: ${color.white};
  box-shadow: 0px 5px 7px 1px ${color.grey};
  border-radius: 8px;
  & > div:not(:last-child) {
    border-right: 2px solid ${color.grey};
  };
  ${media.medium} {
    flex-direction: column;
    & > div:not(:last-child) {
      border-right: none;
    };
  };
  ${media.mobile} {
    padding: 0.8rem 1rem;
    width: 95%;
    margin-left: auto;
    margin-right: auto;
  }
`;

const Item = styled.div`
  flex: 1 1 33.3%;
`;

const ItemTitle = styled.h4`
  margin-left: 5%;
  margin-right: 5%;
  padding-bottom: 3px;
  border-bottom: 3px solid ${color.blushRed};
  text-align: center;
  font-size: 1.2rem;
  ${media.mobile} {
    font-size: 0.9rem;
  }
`;

const ItemContent = styled.div`
  white-space: pre-line; /* 여러 개의 공백은 하나로 표시됨. 긴 행은 필요시 wrap. 개행문자를 만나도 개행됨 */
  margin: 1rem 2%;
  padding: 0 12px;
  overflow-wrap: break-word;
  letter-spacing: 1px;
  font-size: 0.9rem;
  p {
    margin-bottom: 6px;
  }
  ${media.mobile} {
    margin: 1rem 4%;
    padding: 0 20px;
    font-size: 0.8rem;
    p {
      margin-bottom: 6px;
    }
  }
`;

export default MetaInfo;