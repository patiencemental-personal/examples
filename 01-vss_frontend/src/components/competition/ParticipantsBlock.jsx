import React, { useEffect, useState, useCallback } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import color from '../../styles/color';
import font from '../../styles/font';
import BaseContentBlock from './BaseContentBlock';
import { usePopupStore } from '../../stores/usePopupStore';
import popupType from '../../lib/popupType';
import { useAdminStore } from '../../stores/useAdminStore';
import { AiOutlineDownload } from 'react-icons/ai';
import { TiDeleteOutline } from 'react-icons/ti';
import { BsCheckCircleFill } from "react-icons/bs";
import media from '../../styles/media';
import { getCompetitionInfo, getParticipant, getTeamParticipant, getETCInformation } from '../../api/competition';
import { getManagerParticipant, getManagerTeamParticipant, getManagerParticipantExcelFile, getManagerTeamParticipantExcelFile, acceptParticipant, rejectParticipant } from '../../api/management';



const ParticipantsBlock = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get('id');
  const logined = useAdminStore((state) => state.logined);
  const logout = useAdminStore((state) => state.logout);
  const { apiKey, setAPIKey } = useAdminStore();

  const openPopup = usePopupStore((state) => state.open);
  const closePopup = usePopupStore((state) => state.close);

  const [approveUsers, setApproveUsers] = useState([]);
  const [noApproveUsers, setNoApproveUsers] = useState([]);
  const [rejectUsers, setRejectUsers] = useState([]);

  const { viewportWidth } = useOutletContext();

  const [isTeamFight, setIsTeamFight] = useState(null);
  const [compeId, setCompeId] = useState(0);
  const [eventName, setEventName] = useState(null);
  const [etcValue, setETCValues] = useState(null);
  const [isTotal, setIsTotal] = useState(false);
  const [participantsData, setParticipantsData] = useState([]);

  const getParticipantsInfo = useCallback(async () => {
    let participant;
    let participantArray = [];

    const compeInfo = await getCompetitionInfo(id);
    const etcValues = await getETCInformation(id);
    if (etcValues !== undefined) {
      setETCValues(etcValues);
    }
    setCompeId(id);
    if (compeInfo !== undefined) {
      setEventName(compeInfo[0].event_name);
      let approveData = [];
      switch (compeInfo[0].is_teamfight) {
        case "1":
          if (logined) {
            participant = await getManagerTeamParticipant(compeInfo[0].competition_index, apiKey);
          } else {
            participant = await getTeamParticipant(compeInfo[0].competition_index);
          }

          if (participant !== undefined && typeof participant === 'object') {
            participant && Object.values(participant)?.map((entrie) => {
              let newPtpt = entrie.participants;
              for (let i in newPtpt) {
                if (newPtpt[i].acceptance === 1) {
                  approveData = [...approveData, Object.assign(newPtpt[i])];
                }
              }
              return participantArray.push(entrie.participants);
            })
            setIsTeamFight(true);
            setApproveUsers(approveData);
            setNoApproveUsers([]);
            setParticipantsData(participantArray);
          }
          break;
        case "0":
          if (logined) {
            participant = await getManagerParticipant(compeInfo[0].competition_index, apiKey);
          } else {
            participant = await getParticipant(compeInfo[0].competition_index);
          }
          if (participant !== undefined && typeof participant === 'object') {
            for (let i in participant) {
              if (participant[i].acceptance === 1) {
                approveData = [...approveData, Object.assign(participant[i])];
              }
            }

            setApproveUsers(approveData);
            setNoApproveUsers([]);
            setParticipantsData([participant]);
          }
          break;
        default:
          break;
      }
      if (typeof participant === 'object') { // 200
        return;
      }

      if (participant === 204) { // 데이터 없는 경우
        return;
      }

      if (participant === 400) { // 매개변수 잘못 넣은 경우
        return;
      }

      if (participant === 401) { // 세션 만료
        openPopup({
          type: popupType.MESSAGE,
          props: {
            message: `세션이 만료되었습니다.`,
            buttons: [
              {
                name: '확인',
                onClick: () => {
                  logout();
                  setAPIKey(null);
                  closePopup();
                }
              }
            ]
          }
        });
        return;
      }

      if (participant === undefined || participant === 500) { // 에러
        openPopup({
          type: popupType.MESSAGE,
          props: {
            message: `에러가 발생하였습니다.`,
            buttons: [
              {
                name: '확인',
                onClick: () => {
                  closePopup();
                }
              }
            ]
          }
        });
        return;
      }
    }
  }, [id, logined, logout, apiKey, setAPIKey, openPopup, closePopup])

  const updateApproveAndRejectUsers = () => {
    if (approveUsers.length === 0) {
      closePopup();
      openPopup({
        type: popupType.MESSAGE,
        props: {
          message: `저장할 명단이 없습니다.`,
          buttons: [
            {
              name: '확인',
              onClick: () => {
                closePopup();
              }
            }
          ]
        }
      })
    } else {
      acceptParticipantInfo();
    }
  }

  const getCompetitionInfo2 = useCallback(async (p_index) => {
    let participant = {};
    let participantArray = [];
    if (isTeamFight) {
      if (logined) {
        participant = await getManagerTeamParticipant(compeId, apiKey);
      } else {
        participant = await getTeamParticipant(compeId);
      }
      if (participant !== undefined && typeof participant === 'object') {
        participant && Object.values(participant)?.map((entrie) => {
          return participantArray.push(entrie.participants);
        })
        setParticipantsData(participantArray);
      }
    } else {
      if (logined) {
        participant = await getManagerParticipant(compeId, apiKey);
      } else {
        participant = await getParticipant(compeId);
      }
      if (participant !== undefined && typeof participant === 'object') {
        setParticipantsData([participant]);
      }
    }

    if(approveUsers.length !== 0) {
      const filteringApproveUsers = approveUsers.filter(user => user.participant_index !== p_index);
      setApproveUsers(filteringApproveUsers);
    }
    if(noApproveUsers.length !== 0) {
      const filteringNoApproveUsers = noApproveUsers.filter(user => user.participant_index !== p_index);
      setNoApproveUsers(filteringNoApproveUsers);
    }


    if (typeof participant === 'object') { // 200
      return;
    }

    if (participant === 204) { // 데이터 없는 경우
      return;
    }

    if (participant === 400) { // 매개변수 잘못 넣은 경우
      return;
    }

    if (participant === 401) { // 세션 만료
      openPopup({
        type: popupType.MESSAGE,
        props: {
          message: `세션이 만료되었습니다.`,
          buttons: [
            {
              name: '확인',
              onClick: () => {
                logout();
                setAPIKey(null);
                closePopup();
              }
            }
          ]
        }
      });
      return;
    }

    if (participant === undefined || participant === 500) { // 에러
      openPopup({
        type: popupType.MESSAGE,
        props: {
          message: `에러가 발생하였습니다.`,
          buttons: [
            {
              name: '확인',
              onClick: () => {
                closePopup();
              }
            }
          ]
        }
      });
      return;
    }
  }, [logined, logout, compeId, apiKey, setAPIKey, isTeamFight, openPopup, closePopup, approveUsers, noApproveUsers])

  const acceptParticipantInfo = useCallback(async () => {
    let newData = approveUsers.concat(noApproveUsers);
    let response;
    if (approveUsers.length !== 0) {
      openPopup({ type: popupType.LOADING })
      for (let i in newData) {
        response = await acceptParticipant(compeId, newData[i].participant_index, newData[i].acceptance, apiKey);
      }
      closePopup();
      if (response === 201) {
        openPopup({
          type: popupType.MESSAGE,
          props: {
            message: `저장되었습니다.`,
            buttons: [
              {
                name: '확인',
                onClick: () => {
                  getParticipantsInfo();
                  closePopup();
                }
              }
            ]
          }
        })
      } else if (response === 401) {
        openPopup({
          type: popupType.MESSAGE,
          props: {
            message: `세션이 만료되었습니다.`,
            buttons: [
              {
                name: '확인',
                onClick: () => {
                  logout();
                  setAPIKey(null);
                  closePopup();
                }
              }
            ]
          }
        });
      } else {
        openPopup({
          type: popupType.MESSAGE,
          props: {
            message: `에러가 발생하였습니다.`,
            buttons: [
              {
                name: '확인',
                onClick: () => {
                  closePopup();
                }
              }
            ]
          }
        })
      }
    }
  }, [compeId, apiKey, setAPIKey, logout, approveUsers, noApproveUsers, getParticipantsInfo, openPopup, closePopup])

  const rejectParticipantInfo = useCallback(async (compeId, p_index) => {
    const response = await rejectParticipant(compeId, p_index, apiKey);
    if (response === 200) {
      getCompetitionInfo2(p_index);
      closePopup();
    } else if (response === 401) {
      closePopup();
      openPopup({
        type: popupType.MESSAGE,
        props: {
          message: `세션이 만료되었습니다.`,
          buttons: [
            {
              name: '확인',
              onClick: () => {
                logout();
                setAPIKey(null);
                closePopup();
              }
            }
          ]
        }
      });
    } else {
      closePopup();
      openPopup({
        type: popupType.MESSAGE,
        props: {
          message: `에러가 발생하였습니다.`,
          buttons: [
            {
              name: '확인',
              onClick: () => {
                closePopup();
              }
            }
          ]
        }
      })
    }
  }, [apiKey, setAPIKey, logout, getCompetitionInfo2, openPopup, closePopup])

  const getParticipantExcelFile = useCallback(async () => {
    let response;
    if (eventName !== null || eventName !== undefined) {
      if (isTeamFight) {
        response = await getManagerTeamParticipantExcelFile(compeId, apiKey, eventName);
      } else {
        response = await getManagerParticipantExcelFile(compeId, apiKey, eventName);
      }

      if (response === 401) {
        openPopup({
          type: popupType.MESSAGE,
          props: {
            message: `세션이 만료되었습니다.`,
            buttons: [
              {
                name: '확인',
                onClick: () => {
                  logout();
                  setAPIKey(null);
                  closePopup();
                }
              }
            ]
          }
        });
      }
    } else {
      openPopup({
        type: popupType.MESSAGE,
        props: {
          message: `에러가 발생하였습니다.`,
          buttons: [
            {
              name: '확인',
              onClick: () => {
                closePopup();
              }
            }
          ]
        }
      });
    }
  }, [apiKey, compeId, eventName, isTeamFight, openPopup, closePopup, logout, setAPIKey])

  useEffect(() => {
    getParticipantsInfo();
  }, [getParticipantsInfo])

  useEffect(() => {
    setIsTotal(viewportWidth >= 1024);
  }, [viewportWidth]);

  return (
    <BaseContentBlock>
      {
        logined && (
          <UpdateAndDownloadBlock>
            <Update onClick={() => updateApproveAndRejectUsers()}>저장하기</Update>
            <Download>
              <DownloadIcon />
              <DownloadButton onClick={() => getParticipantExcelFile()}>명단 다운로드</DownloadButton>
            </Download>
          </UpdateAndDownloadBlock>
        )
      }

      <GuideText>관리자가 승인한 참가자만 명단 확인에 나타납니다.</GuideText>

      <TableWrapper>
        <Table cellSpacing={0} cellPadding={0}>
          <TableHead logined={logined} isTeamFight={isTeamFight} />
          {participantsData &&
            participantsData?.map((participants, index) => {
              return (
                participants &&
                <TableBody
                  etcValue={etcValue}
                  isTeamFight={isTeamFight}
                  key={new Date().getTime() + index}
                  participants={participants}
                  openPopup={openPopup}
                  closePopup={closePopup}
                  logined={logined}
                  approveUsers={approveUsers}
                  rejectUsers={rejectUsers}
                  setApproveUsers={setApproveUsers}
                  setRejectUsers={setRejectUsers}
                  rejectParticipantInfo={rejectParticipantInfo}
                  participantsData={participantsData}
                  setParticipantsData={setParticipantsData}
                  noApproveUsers={noApproveUsers}
                  setNoApproveUsers={setNoApproveUsers}
                  compeId={compeId}
                />
              )
            })
          }
        </Table>
      </TableWrapper>
    </BaseContentBlock>
  );
};

const TableHead = ({ logined, isTeamFight }) => {
  return (
    <thead>
      {
        <tr>
          {
            isTeamFight && <th>팀명</th>
          }
          <th>이름</th>
          <th>닉네임</th>
          <th>상세</th>
          {
            logined && (
              <React.Fragment>
                <th>승인</th>
                <th>거절</th>
              </React.Fragment>
            )
          }
        </tr>
      }
    </thead>
  );
};

const TableBody = ({
  participants, logined, openPopup, closePopup, approveUsers, rejectUsers, setApproveUsers, setRejectUsers, isTeamFight, etcValue, rejectParticipantInfo, compeId, noApproveUsers, setNoApproveUsers
}) => {

  const openParticipantDetailPopup = (participant) => {
    openPopup({
      type: popupType.PARTICIPANT_DETAIL,
      props: { participant, isTeamFight, etcValue },
    });
  };

  /**
   * @returns true 반환 시, checked 됨을 의미. false 반환 시 unchecked 됨을 의미 
   */
  const toggleCheckOfDataset = useCallback((target, reject, p) => {
    const checkValue = target.dataset['check'];
    const nextCheckValue = checkValue === 'checked' ? '' : 'checked';

    if (nextCheckValue === 'checked') {
      const currentApproveOrReject = target.dataset['approveOrReject'];
      const noCurrentApproveOrReject = currentApproveOrReject === 'approve' ? 'reject' : 'approve';
      const noCurrentTarget = target.parentElement.parentElement.querySelector(`[data-approve-or-reject='${noCurrentApproveOrReject}']`);
      const noCurrentTargetCheckValue = noCurrentTarget.dataset['check'];

      if (reject) {
        const { name, participant_index } = p;
        if (noCurrentTargetCheckValue !== 'checked') {
          openPopup({
            type: popupType.MESSAGE,
            props: {
              message: `${name}님을 승인 거절하시겠습니까?`,
              buttons: [
                {
                  name: '거절',
                  onClick: () => {
                    rejectParticipantInfo(compeId, participant_index);
                  }
                },
                {
                  name: '취소',
                  onClick: () => {
                    closePopup();
                  }
                }
              ]
            }
          })
        } else {
          target.dataset['check'] = nextCheckValue;
          return true;
        }
      } else {
        if (noCurrentTargetCheckValue !== 'checked') {
          target.dataset['check'] = nextCheckValue;
          return true;
        }
      }

    }
    else {
      target.dataset['check'] = '';
    }

    return false;
  }, [compeId, rejectParticipantInfo, openPopup, closePopup])

  // 'p' is user parameter
  const processApproveOrReject = useCallback((p, checked, approveOrRejectUsers, setApproveOrRejectUsers) => {
    if (checked) {
      p.acceptance = 1;
      setApproveOrRejectUsers([...approveOrRejectUsers, p]);

      const filteringNoApproveUsers = noApproveUsers.filter(user => user !== p);
      setNoApproveUsers(filteringNoApproveUsers);

    } else {
      p.acceptance = 0;
      const filtered = approveOrRejectUsers.filter(user => user !== p);
      setApproveOrRejectUsers([...filtered]);
      if (noApproveUsers.length === 0) {
        setNoApproveUsers([...noApproveUsers, p]);
      } else {
        const filteringNoApproveUsers = noApproveUsers.filter(user => user !== p);
        const resultUsers = [...filteringNoApproveUsers, p];
        setNoApproveUsers(resultUsers)
      }
    }
  }, [noApproveUsers, setNoApproveUsers]);

  const approveOrUnApprove = useCallback((event, p) => {
    const checked = toggleCheckOfDataset(event.currentTarget);
    processApproveOrReject(p, checked, approveUsers, setApproveUsers);
  }, [approveUsers, setApproveUsers, toggleCheckOfDataset, processApproveOrReject]);

  const rejectOrUnReject = useCallback((event, p) => {
    const checked = toggleCheckOfDataset(event.currentTarget, true, p);
    processApproveOrReject(p, checked, rejectUsers, setRejectUsers);
  }, [rejectUsers, setRejectUsers, toggleCheckOfDataset, processApproveOrReject])

  if (Array.isArray(participants)) {
    return (
      <tbody>
        {
          participants?.map((p, index) => {
            const { game_nickname, name, team_name, acceptance } = p;
            return (
              <tr key={new Date().getTime() + index}>
                {
                  isTeamFight && <td>{team_name}</td>
                }
                <td>
                  {
                    isTeamFight && (p.is_leader === 1) && <CrownIcon><i className="fa-solid fa-crown"></i></CrownIcon>
                  } {name}
                </td>
                <td>{game_nickname}</td>
                <td>
                  <DetailRowButton onClick={() => { openParticipantDetailPopup(p) }}>
                    <i className="fa-solid fa-circle-info" />
                  </DetailRowButton>
                </td>
                {
                  logined && (
                    <React.Fragment>
                      <td>
                        <CheckButton
                          data-approve-or-reject='approve'
                          data-check={acceptance === 1 ? "checked" : ''}
                          onClick={(event) => approveOrUnApprove(event, p)}
                        >
                          <BsCheckCircleFill />
                        </CheckButton>
                      </td>
                      <td>
                        <DeleteButton
                          data-approve-or-reject='reject'
                          data-check=''
                          onClick={(event) => rejectOrUnReject(event, p)}
                        >
                          <TiDeleteOutline />
                        </DeleteButton>
                      </td>
                    </React.Fragment>
                  )
                }
              </tr>
            )
          })
        }
      </tbody>
    );
  }
};

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

const DetailRowButton = styled.button`
  font-size: 1.2rem;
  color: ${color.darkGrey};
  cursor: pointer;
  &:hover {
    svg {
      opacity: .7;
    }
  }
  ${media.mobile} {
    font-size: 0.9rem;
  }
`;

const CheckButton = styled.button`
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  margin: 0 auto;
  svg {
    color: ${color.darkGrey};
  }
  &[data-check="checked"] svg {
    color: ${color.checkGreen}
  }
  :hover svg {
    opacity: .7;
  }
  ${media.mobile} {
    font-size: 1.1rem;
  }
`

const DeleteButton = styled.button`
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  margin: 0 auto;
  svg {
    color: ${color.blushRed};
  }
  &[data-check="checked"] svg {
    color: ${color.blushRed};
  }
  :hover svg {
    opacity: .7;
  }
  ${media.mobile} {
    font-size: 1.2rem;
  }
`;

const GuideText = styled.div`
  text-align: center;
  color: ${color.teamLeader};
  font-size: 1rem;
  margin-bottom: 2rem;
`;

const TableWrapper = styled.div`
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
      font-size: 0.7rem;
    }
    td {
      font-size: 0.5rem;
    }
  }
`;

const Download = styled.div`
  color: ${color.dark};
  :hover {
    color: ${color.grey};
  }
  font-weight: ${font.weight.bold};
  position: absolute;
  right: 0.7rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
`

const Update = styled.div`
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

const UpdateAndDownloadBlock = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const DownloadButton = styled.button`
  letter-spacing: 0.5px;
  cursor: pointer;
  margin-left: 5px;
  font-size: 1.2rem;
  ${media.mobile} {
    font-size: 0.9rem;
  }
`;

const DownloadIcon = styled(AiOutlineDownload)`
  cursor: pointer;
  font-size: 1.6rem;
  ${media.mobile} {
    font-size: 1.1rem;
  }
`

export default ParticipantsBlock;