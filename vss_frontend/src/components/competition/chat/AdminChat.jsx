import React, { useEffect } from 'react';
import styled from 'styled-components';
import color from '../../../styles/color';
import font from '../../../styles/font';
import media from '../../../styles/media';
import { ImReply } from 'react-icons/im';
import { TiDelete } from 'react-icons/ti';
import moment from 'moment/moment';
import 'moment/locale/ko';
import { decode } from 'html-entities';
import { memo } from 'react';

const AdminChat = memo(({ defaultType, reply, replyFunction, deleteFunction, selectedMenu, data, isLogined, AdminChatRef, scrollToBottomInChatSpace }) => {

  useEffect(()=>{
    if(AdminChatRef?.current) {
      scrollToBottomInChatSpace();
    }
  }, [AdminChatRef, scrollToBottomInChatSpace])


  return (
    <Chat ref={AdminChatRef}>
      <Avatar>
        <span>관리자</span>
      </Avatar>
      <Content>
        <Message>
          {
            reply && (
              <Reply>
                <h4>{reply.to}에게 답장</h4>
                <div>{decode(reply.question)}</div>
              </Reply>
            )
          }
          {
            data &&
            <div>
              {
                data.image &&
                  <div style={{textAlign: 'center'}}>
                    <ChatImage src={`${process.env.REACT_APP_BASE_ORIGIN2}${data.image}`} alt='chat image' />
                    <br/>
                  </div>
              }
              {decode(data.body)}
              </div>
          }
        </Message>
        <MetaInfo>
          <Buttons>
            {
              selectedMenu === "notice" ?
                isLogined === true ?
                  <DeleteButton onClick={() => deleteFunction(data)}><TiDelete /></DeleteButton>
                  :
                  <></>
                :
                selectedMenu === "help" ?
                  isLogined === true ?
                    <DeleteButton onClick={() => deleteFunction(data)}><TiDelete /></DeleteButton>
                    :
                    <></>
                  :
                  defaultType === true ?
                    <></>
                    : isLogined === true ?
                      <DeleteButton onClick={() => deleteFunction(data)}><TiDelete /></DeleteButton>
                      :
                      <ReplyButton onClick={() => replyFunction(data)}><ImReply /></ReplyButton>
            }
          </Buttons>
          {
            data &&
            <Datetime>{`${moment(data.time).format('HH:mm')}`}</Datetime>
        }
        </MetaInfo>
      </Content>
    </Chat>
  );
});

const Reply = styled.div`
  margin-bottom: 0.5rem;
  & div {
    padding: 0.5rem 1rem;
    color: ${color.stoneGrey};
    border-bottom: 1px solid ${color.stoneGrey};
    word-break: break-all;
  };
`;

const Chat = styled.div`
  margin-bottom: 0.5rem;
`;

const Avatar = styled.div`
  display: flex;
  align-items: center;
  font-size: 1rem;
  img {
    margin-right: 8px;
    width: 40px;
    height: 40px;
  };
  span {
    font-size: 1rem;
    font-weight: ${font.weight.bold};
  };
  ${media.mobile} {
    span {
      font-size: 15px;
    }
  }
`;

const Content = styled.div`
  display: flex;
  align-items: flex-end;

  flex-direction: column;
  align-items: flex-start;
`;

const MetaInfo = styled.div`
  margin-left: 0.8rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  margin-left: 50px;
  margin-top: 10px;
  flex-direction: row-reverse;
  align-items: center;
  ${media.mobile} {
    margin-left: 0;
  }
`;

const Datetime = styled.span`
  color: ${color.stoneGrey};
  font-size: 0.8rem;
`;

const Buttons = styled.div`
  display: flex;
  button {
    color: ${color.stoneGrey};
    margin-right: 5px;
  };

  margin-left: 10px;
  align-items: center;
`;

const DeleteButton = styled.button`
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  svg {
    color: ${color.blushRed};
  }
  :hover svg {
    opacity: .7;
  }
`;

const ReplyButton = styled.button`
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  svg {
    color: #00B71C;
  }
  :hover svg {
    opacity: .7;
  }
`;

const Message = styled.div`
  white-space: pre-line; /* 여러 개의 공백은 하나로 표시됨. 긴 행은 필요시 wrap. 개행문자를 만나도 개행됨 */
  position: relative;
  width: 500px;;
  margin-top: 15px;
  margin-left: 50px;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  box-shadow: 0 5px 7px 1px ${color.grey};
  background-color: ${color.admin};
  h4 {
    font-size: 1rem;
  }
  div {
    font-size: 14.5px;
    word-break: break-all;
  }
  ::before {
    content: '';
    position: absolute;
    height: 30px;
    top: -15px;
    left: -15px;
    border-right: 20px solid ${color.admin};
    border-bottom-left-radius: 30px;
  };
  ::after {
    content: '';
    position: absolute;
    height: 15px;
    top: -15px;
    left: -15px;
    border-right: 20px solid #e0e0e0;
    ${media.mobile} {
      background-color: ${color.lightGrey};
    }
    border-bottom-left-radius: 60px;
  };
  ${media.mobile} {
    width: 100%;
    margin-left: 0;
    margin-top: 5px;
    ::before {
      display: none;
    };
    ::after {
      display: none;
    }
    h4 {
      font-size: 14.5px;
    }
    div {
      font-size: 13px;
    }
  };
`;

const ChatImage = styled.img`
  width: 100%;
  max-width: 300px;
  padding: 0 0.7rem;
`;

export default AdminChat;