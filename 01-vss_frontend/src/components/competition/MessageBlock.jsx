import React, { useState, useEffect } from 'react';
import BaseContentBlock from './BaseContentBlock';
import { useAdminStore } from '../../stores/useAdminStore';
import { usePopupStore } from '../../stores/usePopupStore';
import styled from 'styled-components';
import font from '../../styles/font';
import color from '../../styles/color';
import media from '../../styles/media';
import { getTestParticipantsData } from '../../lib/testData/participants';
import { BsCheckCircleFill } from 'react-icons/bs';
import popupType from '../../lib/popupType';
import { getManagerParticipantsData } from '../../api/management';
import { useCallback } from 'react';
import useCompetitionStore from '../../stores/useCompetitionStore';

const MessageBlock = () => {
  const competitionInfo = useCompetitionStore((state) => state.info[0]);
  const competitionId = useAdminStore((state) => state.competition_id);
  const apiKey = useAdminStore((state) => state.apiKey);

  const openPopup = usePopupStore((state) => state.open);
  const [etcValue, setETCValues] = useState(null);

  const [prevAlarmTalkWritingInfo, setPrevAlarmTalkWritingInfo] = useState({ message: '' });

  const [isTeamFight, setIsTeamFight] = useState(null);
  const [participantIndexMap, setParticipantIndexMap] = useState();
  const [participantsData, setParticipantsData] = useState();
  useEffect(() => {
    if (participantsData) {
      return setParticipantIndexMap(() => {
        const obj = {};
        Object.values(participantsData).forEach(({ participants }) => {
          participants.forEach((p) => obj[p.participant_index] = p);
        });
        return obj;
      });
    }
  }, [participantsData])

  const [targetIndexSetOfAlarmTalk, setTargetIndexSetOfAlarmTalk] = useState(new Set([]));
  const [allTargetOfAlarmTalkState, setAllTargetOfAlarmTalkState] = useState(false);

  const updateTargetIndexSetOfAlarmTalk = (participantIndex) => {
    setTargetIndexSetOfAlarmTalk((prev) => {
      const clonedPrevSet = new Set(prev);
      if (clonedPrevSet.has(participantIndex)) {
        clonedPrevSet.delete(participantIndex)
      } else {
        clonedPrevSet.add(participantIndex)
      }
      return clonedPrevSet;
    });
  };

  const toggleAllTargetOfAlarmTalk = () => {
    if (!allTargetOfAlarmTalkState) {
      setTargetIndexSetOfAlarmTalk(() => {
        const pIndexs = [];
        Object.values(participantsData).forEach(({ participants }) => {
          participants.forEach(({ participant_index }) => pIndexs.push(participant_index));
        });
        return new Set(pIndexs);
      });
    } else {
      setTargetIndexSetOfAlarmTalk(new Set([]));
    }
    setAllTargetOfAlarmTalkState(!allTargetOfAlarmTalkState);
  };

  const actionAlarmTalkSuccess = () => {
    setTargetIndexSetOfAlarmTalk(new Set());
    setPrevAlarmTalkWritingInfo({ message: '' });
  }

  const processOpenAlarmTalkWritingPopup = (usePrevData = false) => {
    openPopup({ 
      type: popupType.ALARM_TALK_WRITING,
      props: {
        participantIndexMap: participantIndexMap,
        targetIndexSet: targetIndexSetOfAlarmTalk,
        usePrevData: usePrevData,
        prevAlarmTalkWritingInfo: prevAlarmTalkWritingInfo,
        setPrevAlarmTalkWritingInfo: setPrevAlarmTalkWritingInfo,
        actionAlarmTalkSuccess: actionAlarmTalkSuccess
      }
    });
  }

  const openAlarmTalkWritingPopup = () => {
    const { message } = prevAlarmTalkWritingInfo;
    
    if (message !== '') {
      openPopup({
        type: popupType.MESSAGE,
        props: { 
          message: '이전 작성하던 메시지가 있습니다.<br>계속 작성하시겠습니까?',
          buttons: [
            {
              name: '네',
              styles: { width: '120px' },
              onClick: () => {
                processOpenAlarmTalkWritingPopup(true)
              }
            },
            {
              name: '아니요',
              styles: { width: '120px' },
              onClick: () => {
                setPrevAlarmTalkWritingInfo({ message: '' });
                processOpenAlarmTalkWritingPopup();
              }
            }
          ]
        }
      })
    } else {
      processOpenAlarmTalkWritingPopup();
    }
  }

  const openRefundPolicyPopup = () => {
    const size = targetIndexSetOfAlarmTalk.size;
    if (size > 0) {
      openPopup({
        type: popupType.MESSAGE,
        props: {
          // message: `
          //   <div style='text-align: left;'>
          //     알림톡 취소/환불 규정
          //     </br>
          //     <div style='font-size: 1rem; font-weight: 400'>
          //     - 결제 후 알림톡이 즉시 발송됩니다. 발송된 알림톡에 대해서는 취소/환불이 적용되지 않습니다. 알림톡이 발송되고 나면 취소/환불이 불가하오니 신중한 결제 안내드립니다.
          //     </div>
          //     </br>
          //     </br>
          //     1) 취소 규정
          //     </br>
          //     <div style='font-size: 1rem; font-weight: 400'>
          //       - 알림톡 발송 구매과정에서 결제하지 않는 경우와 결제 도중 취소하는 경우 금액이 부과되지 않습니다.
          //       </br>
          //       - 구매 후 발송 성공된 알림톡에 대해서는 결제 취소가 불가함을 안내드립니다.
          //     </div>
          //     </br>
          //     </br>
          //     2) 환불 규정
          //     </br>
          //     <div style='font-size: 1rem; font-weight: 400'>
          //       - 발송된 알림톡이 네트워크 오류로 인해 발송 실패 처리될 경우 '1건 당 금액 x 실패 건수' 금액 만큼 환불됩니다.
          //       </br>
          //       - 발송 실패된 알림톡을 제외한 발송 성공 알림톡에 대해서는 환불이 불가함을 안내드립니다.
          //     </div>
          //   </div>
          // `,
          // message: `
          //   <div style='text-align: left;'>
          //     문자 취소/환불 규정
          //     </br>
          //     <div style='font-size: 1rem; font-weight: 400'>
          //     - 결제 후 문자가 즉시 발송됩니다. 발송된 문자에 대해서는 취소/환불이 적용되지 않습니다. 문자가 발송되고 나면 취소/환불이 불가하오니 신중한 결제 안내드립니다.
          //     </div>
          //     </br>
          //     </br>
          //     1) 취소 규정
          //     </br>
          //     <div style='font-size: 1rem; font-weight: 400'>
          //       - 문자 발송 구매과정에서 결제하지 않는 경우와 결제 도중 취소하는 경우 금액이 부과되지 않습니다.
          //       </br>
          //       - 구매 후 발송 성공된 문자에 대해서는 결제 취소가 불가함을 안내드립니다.
          //     </div>
          //     </br>
          //     </br>
          //     2) 환불 규정
          //     </br>
          //     <div style='font-size: 1rem; font-weight: 400'>
          //       - 발송된 문자가 네트워크 오류로 인해 발송 실패 처리될 경우 '1건 당 금액 x 실패 건수' 금액 만큼 환불됩니다.
          //       </br>
          //       - 발송 실패된 문자을 제외한 발송 성공 문자에 대해서는 환불이 불가함을 안내드립니다.
          //     </div>
          //   </div>
          // `,
          message: `
            <div style='text-align: left;'>
              <p style='text-align: center;'>단체 문자 보내기 취소/환불에 대한 규정</p>
              </br>
              <ol style='list-style-type: decimal; margin-left: 1.4rem; font-size: 1rem; font-weight: 400' start='1'>  
                <li class='custom-list-item'>
                  <p>작성된 문자 내용은 결제 후 대회 관리자에게도 자동 전송됩니다.</p>
                </li>
                <li class='custom-list-item'>
                  <p>결제 후 즉시 문자가 발송됩니다. 발송된 문자에 대해서는 취소/환불이 불가하오니 신중한 결제 부탁드립니다.</p>
                </li>
                <li class='custom-list-item'>
                  <p>단체 문자 보내기는 070 번호로 발송됩니다. 대회 참가자 또는 관리자가 070 번호를 스팸 번호로 등록하였거나 수신 차단했을 경우 문자를 받지 못할 수 있습니다. 이런 경우 결제 금액에 대한 취소/환불이 불가하오니 신중한 결제 부탁드립니다.</p>
                </li>
                <li class='custom-list-item'>
                  <p>결제 과정에서 결제하지 않는 경우와 결제 도중 취소하는 경우 금액이 부과되지 않습니다.</p>
                </li>
                <li class='custom-list-item'>
                  <p>단체 문자 보내기 및 결제 관련 문의</p>
                  <ul style='list-style-type: disc; margin-left: 1.2rem;'>
                    <li class='custom-list-item'>natural0334@naver.com</li>
                    <li class='custom-list-item'>hyh203@naver.com</li>
                  </ul>
                </li>
              </ol>
            </div>
          `,
          buttons: [
            {
              name: '메시지 작성',
              onClick: openAlarmTalkWritingPopup
            }
          ]
        }
      })
    } else {
      openPopup({
        type: popupType.MESSAGE,
        props: { message: '메시지 보낼 대상을 선택해주세요.' }
      })
    }
  }

  const initParticipantsData = useCallback(async () => {
    try {
      const response = await getManagerParticipantsData(competitionId, apiKey, competitionInfo.is_teamfight === '1');
      const { isTeamFight, participantsData } = response.data;
      
      Object.keys(participantsData).forEach((teamNameKey) => {
        participantsData[teamNameKey].participants = participantsData[teamNameKey].participants.filter(p => p.acceptance === 1);
        if (participantsData[teamNameKey].participants.length === 0) delete participantsData[teamNameKey];
      });

      setIsTeamFight(isTeamFight);
      setParticipantsData(participantsData);
    } catch (error) {
      openPopup({ type: popupType.MESSAGE, props: { message: '참가자 데이터를 불러오는데 실패했습니다.' } })
    }
  }, [competitionId, apiKey, competitionInfo]);

  useEffect(() => {
    initParticipantsData();
  }, []);

  return (
    <BaseContentBlock>
      <SendButtonBlock>
        <SendButton onClick={openRefundPolicyPopup}>메시지 작성</SendButton>
      </SendButtonBlock>

      <GuideText>메시지를 전송할 참가자를 선택한 후 메시지 작성 버튼을 클릭하세요.</GuideText>

      <TableWrapper>
        {/* <TotalCheckButton onClick={toggleAllTargetOfAlarmTalk}>전체 선택</TotalCheckButton> */}
        <Table cellSpacing={0} cellPadding={0}>
          <TableHead
            isTeamFight={isTeamFight}
            toggleAllTargetOfAlarmTalk={toggleAllTargetOfAlarmTalk}
          />
          {
            participantsData && Object.values(participantsData).map(({ participants }, index) => {
              return (
                <TableBody
                  key={new Date().getTime() + index}
                  etcValue={etcValue}
                  isTeamFight={isTeamFight}
                  participants={participants}
                  targetIndexSetOfAlarmTalk={targetIndexSetOfAlarmTalk}
                  updateTargetIndexSetOfAlarmTalk={updateTargetIndexSetOfAlarmTalk}
                />
              )
            })
          }
        </Table>
      </TableWrapper>
    </BaseContentBlock>
  );
};

const GuideText = styled.div`
  text-align: center;
  color: ${color.lightRed};
  font-size: 1rem;
  margin-bottom: 2rem;
`;

const TableHead = ({ isTeamFight, toggleAllTargetOfAlarmTalk }) => {
  return (
    <thead>
      {
        <tr>
          { isTeamFight && <th>팀명</th> }
          <th>이름</th>
          <th>닉네임</th>
          <th onClick={toggleAllTargetOfAlarmTalk} style={{'cursor': 'pointer', 'color': color.successGreen}}>전체 선택</th>
        </tr>
      }
    </thead>
  );
};

const TableBody = ({ isTeamFight, participants, targetIndexSetOfAlarmTalk, updateTargetIndexSetOfAlarmTalk }) => {
    return (
      <tbody>
        {
            participants?.map((p, index) => {
              const { game_nickname, name, team_name } = p;
            return (
              <tr key={new Date().getTime() + index}>
                {
                  isTeamFight && <td>{team_name}</td>
                }
                <td>
                  {
                    isTeamFight && (p.is_leader === 1) && <CrownIcon><i className="fa-solid fa-crown"></i></CrownIcon>
                  } 
                  {name}
                </td>
                <td>{game_nickname}</td>
                <td>
                  {
                    <CheckButton
                      className={targetIndexSetOfAlarmTalk.has(p.participant_index) && 'active'} 
                      onClick={() => { updateTargetIndexSetOfAlarmTalk(p.participant_index) }}
                    >
                      <BsCheckCircleFill />
                    </CheckButton>
                  }
                </td>
              </tr>
            )
          })
        }
      </tbody>
    );
}

const TotalCheckButton = styled.button`
  background-color: ${color.successGreen};
  color: white;
  border-radius: 5px;
  padding: 0.5rem;
  width: 15%;
  margin-bottom: 1rem;
`

const CheckButton = styled.button`
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  margin: 0 auto;
  svg {
    color: ${color.darkGrey};
  }
  &.active svg {
    color: ${color.successGreen};
  }
  :hover svg {
    opacity: .7;
  }
  ${media.mobile} {
    font-size: 1.1rem;
  }
`

const CrownIcon = styled.span`
  color: white;
  background-color: red;
  font-size: 0.8rem;
  padding: 0.1rem;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

const TableWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  background-color: ${color.white};
  margin: 0 0.7rem 3rem 0.7rem;
  padding: 1.5rem 2rem 1.5rem 2rem;
  border-radius: 5px;
  box-shadow: 0 5px 7px 1px ${color.grey};
  ${media.mobile} {
    padding: 0.8rem;
  }
`;

const Table = styled.table`
  width: 100%;
  margin-bottom: 2rem;
  border-collapse: collapse;
  th {
    padding: 0.8rem 0;
    margin-bottom: 0.8rem;
  };
  td {
    text-align: center;
    color: ${color.stoneGrey};
    padding: 0.6rem 0;
  };
  tbody {
    border-top: 1px solid ${color.stoneGrey};
  }
  tbody:first-of-type {
    border-top: 3px solid ${color.blushRed};
  }
  tbody > tr:first-child > td  {
    padding-top: 1rem;
  }

  ${media.mobile} {
    th {
      font-size: 0.7rem
    }
    td {
      font-size: 0.5rem;
    }
  }
`;

const SendButtonBlock = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const SendButton = styled.button`
  cursor: pointer;
  font-size: 1.3rem;
  font-weight: ${font.weight.bold};
  background-color: ${color.blushRed};
  padding: 1rem;
  text-align: center;
  border-radius: 8px;
  color: white;
  :hover {
    opacity: .9;
  }
  ${media.mobile} {
    font-size: 1rem;
    padding: 0.7rem;
  }
`

export default MessageBlock;