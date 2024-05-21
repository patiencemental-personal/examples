import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import useLoading from '../../../hooks/useLoading';
import styled from 'styled-components';
import color from '../../../styles/color';
import AdminChat from './AdminChat';
import ChatInput from './ChatInput';
import font from '../../../styles/font';
import media from '../../../styles/media';
import { usePopupStore } from '../../../stores/usePopupStore';
import popupType from '../../../lib/popupType';
import { useAdminStore } from '../../../stores/useAdminStore';
import { postNotice, postQuestionReply, deleteNotice, deleteQuestion, deleteRecruit, deleteScrim, deleteQuestionReply, deleteRecruitReply, deleteScrimReply } from '../../../api/management';
import { getNotice, getQuestion, getQuestionReply, getScrim, getScrimReply, getRecruit, getRecruitReply, postQuestion, postScrim, postRecruit, postScrimReply, postRecruitReply } from '../../../api/communication';
import { getInfoType, sortData, setChatType, setDefaultBodyType } from '../../../refactoring/chatBlock_Refactoring';
import { memo } from 'react';

const ChatBlock = memo(({ selectedMenu, index }) => {
  const { logined, apiKey, setAPIKey } = useAdminStore();
  const chatRef = useRef();
  const chatSpaceRef = useRef();
  const lastChatRef = useRef();

  const logout = useAdminStore((state) => state.logout);
  const openPopup = usePopupStore((state) => state.open);
  const closePopup = usePopupStore((state) => state.close);
  const [data, setData] = useState([]);
  const [first, setFirst] = useState(true);
  const [page, setPage] = useState(1); // eslint-disable-line no-unused-vars

  const [loading, startLoading, endLoading] = useLoading(); // eslint-disable-line no-unused-vars

  const [image, selectImage] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [cnSelected, setCnSelected] = useState('');

  const [replyItem, setReplyItem] = useState(null);

  const clearReplyItem = useCallback(() => {
    setReplyItem(null);
  }, []);

  const scrollToBottomInChatSpace = useCallback(() => {
    if (chatSpaceRef?.current) {
      chatSpaceRef.current.scrollTop = chatSpaceRef.current.scrollHeight;
    }
  }, []);

  const deleteImage = useCallback(() => {
    selectImage(null);
    setPreviewImageUrl(null);
  }, [selectImage, setPreviewImageUrl]);

  const clear = useCallback(() => {
    chatRef.current.value = '';
    deleteImage();
    setCnSelected('');
  }, [chatRef, deleteImage, setCnSelected]);

  const pageSetting = useCallback((newData) => {
    setData(sortData(newData));
  }, [])

  const getNoticeInfo = useCallback(async (idx) => {
    let mixAllData = [];
    let 공지사항데이터 = [];

    const noticeInfo = await getNotice(idx);
    if (noticeInfo === undefined) {
    } else {
      mixAllData = [...mixAllData, getInfoType(noticeInfo, "", selectedMenu)];
    }

    if (mixAllData === undefined) {
    } else {
      mixAllData.forEach((item, i) => {
        if (i === 0) {
          공지사항데이터 = item;
        } else {
          공지사항데이터 = [...공지사항데이터].concat(item);
        }
      });
      pageSetting(공지사항데이터);
    }
  }, [selectedMenu, pageSetting]);

  const getQuestionInfo = useCallback(async (idx) => {
    let mixAllData = [];
    let 문의사항데이터 = [];
    const questionInfo = await getQuestion(idx);
    const questionReplyInfo = await getQuestionReply(idx);
    if (questionInfo === undefined) {
    } else {
      mixAllData = [...mixAllData, getInfoType(questionInfo, questionReplyInfo, selectedMenu)];
    }

    if (mixAllData === undefined) {
    } else {
      mixAllData.forEach((item, i) => {
        if (i === 0) {
          문의사항데이터 = item;
        } else {
          문의사항데이터 = [...문의사항데이터].concat(item);
        }
      });
      pageSetting(문의사항데이터);
    }
  }, [selectedMenu, pageSetting]);

  const getScrimInfo = useCallback(async (idx) => {
    let mixAllData = [];
    let 스크림모집데이터 = [];
    const scrimInfo = await getScrim(idx);
    const scrimReplyInfo = await getScrimReply(idx);
    if (scrimInfo === undefined) {
    } else {
      mixAllData = [...mixAllData, getInfoType(scrimInfo, scrimReplyInfo, selectedMenu)];
    }

    if (mixAllData === undefined) {
    } else {
      mixAllData.forEach((item, i) => {
        if (i === 0) {
          스크림모집데이터 = item;
        } else {
          스크림모집데이터 = [...스크림모집데이터].concat(item);
        }
      });
      pageSetting(스크림모집데이터);
    }
  }, [selectedMenu, pageSetting]);

  const getRecruitInfo = useCallback(async (idx) => {
    let mixAllData = [];
    let 팀원모집데이터 = [];
    const recruitInfo = await getRecruit(idx);
    const recruitReplyInfo = await getRecruitReply(idx);
    if (recruitInfo === undefined) {
    } else {
      mixAllData = [...mixAllData, getInfoType(recruitInfo, recruitReplyInfo, selectedMenu)];
    }

    if (mixAllData === undefined) {
    } else {
      mixAllData.forEach((item, i) => {
        if (i === 0) {
          팀원모집데이터 = item;
        } else {
          팀원모집데이터 = [...팀원모집데이터].concat(item);
        }
      });
      pageSetting(팀원모집데이터);
    }
  }, [selectedMenu, pageSetting]);

  const setInfoType = useMemo(() => {
    return {
      notice(index) {
        getNoticeInfo(index);
      },
      help(index) {
        getQuestionInfo(index);
      },
      scrum(index) {
        getScrimInfo(index);
      },
      job(index) {
        getRecruitInfo(index);
      }
    }
  }, [getNoticeInfo, getQuestionInfo, getScrimInfo, getRecruitInfo]);

  const howToGetInfo = useCallback(() => {
    setInfoType[selectedMenu](index);
  }, [index, selectedMenu, setInfoType]);

  const setMessageType = useMemo(() => {
    return {
      async notice(index, message, image, apiKey, response) {
        if (logined) {
          response = await postNotice(index, message, image, apiKey);
          if (response === 201) {
            clear();
          }
          return response;
        } else {
          alert("관리지만 사용 가능합니다.");
        }
        clear();
      },
      async help(index, message, image, apiKey, response) {
        if (logined) {
          if (replyItem !== null) {
            response = await postQuestionReply(index, replyItem.index, message, image, apiKey);
            if (response === 201) {
              setReplyItem(null);
              clear();
            }
            return response;
          } else {
            openPopup({
              type: popupType.MESSAGE,
              props: {
                message: `답변을 달아줄 대화를 선택해주세요.`,
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
        } else {
          response = await postQuestion(index, message, image);
          if (response === 201) {
            clear();
          }
          return response;
        }
      },
      async scrum(index, message, image, apiKey, response) {
        if (logined) {
          openPopup({
            type: popupType.MESSAGE,
            props: {
              message: `일반 유저만 입력할 수 있습니다.`,
              buttons: [
                {
                  name: '확인',
                  onClick: () => {
                    clear();
                    closePopup();
                  }
                }
              ]
            }
          });
        } else {
          if (replyItem === null) {
            response = await postScrim(index, message, image, response);
          } else {
            response = await postScrimReply(index, replyItem.index, message, image);
          }
          if (response === 201) {
            setReplyItem(null);
            clear();
          }
          return response;
        }
      },
      async job(index, message, image, apiKey, response) {
        if (logined) {
          openPopup({
            type: popupType.MESSAGE,
            props: {
              message: `일반 유저만 입력할 수 있습니다.`,
              buttons: [
                {
                  name: '확인',
                  onClick: () => {
                    clear();
                    closePopup();
                  }
                }
              ]
            }
          });
        } else {
          if (replyItem === null) {
            response = await postRecruit(index, message, image);
          } else {
            response = await postRecruitReply(index, replyItem.index, message, image);
          }
          if (response === 201) {
            setReplyItem(null);
            clear();
          }
          return response;
        }
      }
    }
  }, [logined, clear, openPopup, closePopup, replyItem])

  const sendMessage = useCallback(async () => {
    let response;
    const chatValue = chatRef.current.value;
    if (chatValue.length !== 0 || image) {
      let message = chatValue.trim();
      response = await setMessageType[selectedMenu](index, message, image, apiKey, response);
      if (response !== undefined) {
        if (response === 201) {
          howToGetInfo();
          scrollToBottomInChatSpace(lastChatRef, false);
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
          });
        }
      }
    } else {
      alert("내용을 입력해 주세요.")
    }
  }, [index, chatRef, image, howToGetInfo, scrollToBottomInChatSpace, logout, apiKey, setAPIKey, selectedMenu, openPopup, closePopup, setMessageType]);

  const keyPress = useCallback((e) => {
    if (e.key === 'Enter' && e.shiftKey) {

    } else if (e.key === 'Enter') {
      e.preventDefault(); // prevent Enter
      sendMessage();
    }
  }, [sendMessage]);

  const setDeleteReplyType = useMemo(() => {
    return {
      async notice(data, response) {
        const { notice_index } = data;
        response = await deleteNotice(index, notice_index, apiKey);
        return response;
      },
      async help(data, response) {
        if (data.type === "reply") {
          const { question_reply_index } = data;
          response = await deleteQuestionReply(index, question_reply_index, apiKey);
        } else {
          const { question_index } = data;
          response = await deleteQuestion(index, question_index, apiKey);
        }
        return response;
      },
      async scrum(data, response) {
        if (data.type === "scrimRecruitReply") {
          const { scrim_reply_index } = data;
          response = await deleteScrimReply(index, scrim_reply_index, apiKey);
        } else {
          const { scrim_index } = data;
          response = await deleteScrim(index, scrim_index, apiKey);
        }
        return response;
      },
      async job(data, response) {
        if (data.type === "scrimRecruitReply") {
          const { recruit_reply_index } = data;
          response = await deleteRecruitReply(index, recruit_reply_index, apiKey);
        } else {
          const { recruit_index } = data;
          response = await deleteRecruit(index, recruit_index, apiKey);
        }
        return response;
      }
    }
  }, [index, apiKey]);

  const deleteData = useCallback((data) => {
    let response;
    openPopup({
      type: popupType.MESSAGE,
      props: {
        message: `삭제하시겠습니까?`,
        buttons: [
          {
            name: '확인',
            onClick: async () => {
              response = await setDeleteReplyType[selectedMenu](data, response);
              if (response === 200) {
                setReplyItem(null);
                howToGetInfo();
                closePopup();
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
                        onClick: async () => {
                          closePopup();
                        }
                      }
                    ]
                  }
                });
              }
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
    });
  }, [selectedMenu, setAPIKey, logout, openPopup, closePopup, setDeleteReplyType, howToGetInfo])

  const setReplyType = useMemo(() => {
    return {
      help(reply, data) {
        const { question_index } = data;
        reply.index = question_index;
        reply.nickname = data.nickname;
        reply.body = data.body;
        setReplyItem(reply);
      },
      scrum(reply, data) {
        const { scrim_index } = data;
        reply.index = scrim_index;
        reply.nickname = data.nickname;
        reply.body = data.body;
        setReplyItem(reply);
      },
      job(reply, data) {
        const { recruit_index } = data;
        reply.index = recruit_index;
        reply.nickname = data.nickname;
        reply.body = data.body;
        setReplyItem(reply);
      }
    }
  }, [])

  const PostReply = useCallback(async (data) => {
    let reply = {
      competition_index: index,
      index: 0,
      nickname: '',
      body: ''
    }
    setReplyItem(null);
    setReplyType[selectedMenu](reply, data);
  }, [index, selectedMenu, setReplyType])

  useEffect(() => {
    if (first) {
      howToGetInfo();
      setFirst(false);
    }
  }, [first, selectedMenu, page, howToGetInfo, getNoticeInfo, getQuestionInfo, getScrimInfo, getRecruitInfo, image])

  useEffect(() => {
    setCnSelected(image === null ? '' : 'selected');
    setPreviewImageUrl(image === null ? null : URL.createObjectURL(image));
  }, [image]);

  return (
    <React.Fragment>
      <Box>
        <ChatSpace ref={chatSpaceRef}>
          <AdminChat defaultType={true} selectedMenu={selectedMenu} data={setDefaultBodyType[selectedMenu]()} />
          {
            data?.map((item, index) => {
              return setChatType(data, item, index, selectedMenu, logined, PostReply, deleteData, lastChatRef, scrollToBottomInChatSpace);
            })
          }
        </ChatSpace>
        <ChatInput
          chatRef={chatRef}
          selectImage={selectImage}
          setPreviewImageUrl={setPreviewImageUrl}
          cnSelected={cnSelected}
          sendMessage={sendMessage}
          sendKeyMessage={keyPress}
          // reply
          replyItem={replyItem}
          clearReplyItem={clearReplyItem}
        />
      </Box>
      {
        previewImageUrl && (
          <PreviewImageBox>
            <PreviewImage src={previewImageUrl} />
            <PreviewImageDeleteButton onClick={deleteImage}>삭 제</PreviewImageDeleteButton>
          </PreviewImageBox>
        )
      }
    </React.Fragment>
  );
});

const Box = styled.div`
  position: relative;
  background-color: #e0e0e0;
  ${media.mobile} {
    background-color: ${color.lightGrey};
  }
  margin: 0 0.7rem 3rem 0.7rem;
  border-radius: 5px;
  box-shadow: 0 5px 7px 1px ${color.grey};
  height: 800px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ChatSpace = styled.div`
  overflow-y: auto;
  padding: 1.5rem 2rem 1.5rem 2rem;
`;

const PreviewImageBox = styled.div`
  padding: 1.5rem 2rem 1.5rem 2rem;
  height: 600px;
  width: 600px;
  margin: 0 auto;
  margin-bottom: 3rem;
  text-align: center;
  box-shadow: 0 5px 7px 1px ${color.grey};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  ${media.custom(1170)} {
    width: 95%;
    height: auto;
  };
`;

const PreviewImage = styled.img`
  width: 400px;
  height: 400px;
  ${media.custom(1170)} {
    width: 70%;
    height: auto;
    margin-bottom: 1rem;
  };
`;

const PreviewImageDeleteButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: ${color.blushRed};
  font-size: 1.2rem;
  border-radius: 5px;
  font-weight: ${font.weight.semiBold};
  color: white;
`;

export default ChatBlock;