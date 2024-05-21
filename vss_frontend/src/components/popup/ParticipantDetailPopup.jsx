import React from 'react';
import styled from 'styled-components';
import color from '../../styles/color';
import font from '../../styles/font';
import { usePopupStore } from '../../stores/usePopupStore';
import {
  PopupTemplate, 
  PopupHead, 
  PopupBody, 
  PopupFooter, 
  Button
} from './common/index';

const templateStyles = {
  width: '400px',
  height: 'auto',
};

const ParticipantDetailPopup = ({ participant, isTeamFight, etcValue }) => {
  let etcValueArray = [];
  let etcValueArray2 = [];
  if(etcValue) {
    Object.values(etcValue)?.forEach((etc) => {
      if (etc) {
        return etcValueArray.push(etc);
      }
    });
  }

  if(participant) {
    Object.keys(participant)?.forEach((p) => {
      if (p.includes("etc_value") && participant[p] !== null) {
        return etcValueArray2.push(participant[p]);
      }
    });
  }

  const close = usePopupStore((state) => state.close);
  const { game_nickname, name, phone, birth_YMD, email, team_name } = participant;

  return (
    <PopupTemplate styles={templateStyles}>
      <PopupHead title={'참가자 상세 정보'} />
      <PopupBody>
        <PopupTable cellSpacing={0} cellPadding={0}>
          <colgroup>
            <col style={{ width: '30%', }} />
            <col style={{ width: '70%', }} />
          </colgroup>
          <tbody><tr><td className={'item'}>닉네임</td><td className={'value'}>{game_nickname}</td></tr></tbody>
          <tbody><tr><td className={'item'}>이름</td><td className={'value'}>{name}</td></tr></tbody>
          <tbody><tr><td className={'item'}>전화번호</td><td className={'value'}>{phone}</td></tr></tbody>
          <tbody><tr><td className={'item'}>생년월일</td><td className={'value'}>{birth_YMD}</td></tr></tbody>
          <tbody><tr><td className={'item'}>이메일</td><td className={'value'}>{email}</td></tr></tbody>
          {
            isTeamFight && <tbody><tr><td className={'item'}>팀명</td><td className={'value'}>{team_name}</td></tr></tbody>
          }
          {
            etcValueArray?.map((item, index)=>{
              return <tbody key={index}><tr key={index+1}><td className={'item'} key={index+2}>{item}</td><td className={'value'} key={index+3}>{etcValueArray2[index]}</td></tr></tbody>
            })
          }
        </PopupTable>
      </PopupBody>
      <PopupFooter>
        <Button onClick={close} name='확 인' />
      </PopupFooter>
    </PopupTemplate>
  );
};

const PopupTable = styled.table`
  font-size: 0.9rem;
  border: 1px solid ${color.stoneGrey};
  text-align: left;
  width: 100%;
  border-collapse: collapse;
  tbody:not(:last-child) {
    border-bottom: 1px solid ${color.stoneGrey};
  };
  td.item {
    border-right: 1px solid ${color.stoneGrey};
    padding: 0.8rem;
    font-weight: ${font.weight.semiBold};
    background-color: ${color.td};
  };
  td.value {
    border-right: 1px solid ${color.stoneGrey};
    padding: 0.8rem;
    font-weight: ${font.weight.semiBold};
  };
`;

export default ParticipantDetailPopup;