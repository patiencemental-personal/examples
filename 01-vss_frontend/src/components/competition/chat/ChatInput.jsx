import React from 'react';
import styled from 'styled-components';
import color from '../../../styles/color';
import { FaTelegramPlane } from 'react-icons/fa';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import font from '../../../styles/font';
import media from '../../../styles/media';
import TextareaAutosize from 'react-textarea-autosize';
import ImageFileInput from '../../common/ImageFileInput';
import { memo } from 'react';

const ChatInput = memo(({ chatRef, selectImage, cnSelected, sendMessage, sendKeyMessage, replyItem, clearReplyItem }) => {
  return (
    <React.Fragment>
      <Block>
        {
          replyItem && (
            <ReplyBlock>
              <Target>
                <p className='name'>{replyItem.nickname}</p>
                <p className='body'>{replyItem.body || '메시지 내용 없음'}</p>
              </Target>
              <CloseButton onClick={clearReplyItem}>X</CloseButton>
            </ReplyBlock>
          )
        }
        <Textarea
          ref={chatRef}
          onKeyPress={sendKeyMessage}
          maxRows={5}
          maxLength={500}
          placeholder='입력해 주세요.'
          autoFocus={true}
        />
        <Buttons>
          <ImageFileInput selectImage={selectImage}>
            <ImageFileUploadButton className={cnSelected} />
          </ImageFileInput>
          <SendButton onClick={sendMessage} />
        </Buttons>
      </Block>
    </React.Fragment>
  );
});

const ReplyBlock = styled.div`
  border-bottom: 1px solid whitesmoke;
  background-color: white;
  position: absolute;
  width: 100%;
  height: 120%;
  top: -120%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0rem 1rem;
  ${media.custom(1300)} {
    top: -120%;
    height: 120%;
  };
`

// 이해 안되지만 일단 온료...
const Target = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  .name {
    color: ${color.skyBlue};
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  .body {
    font-size: 1rem;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
`

const CloseButton = styled.button`
  color: grey;
  flex: 0 0 5%;
  font-size: 1.5rem;
`

const Block = styled.div`
  position: relative;
  border-radius: 5px;
  box-shadow: 0 5px 7px 1px ${color.grey};
  background-color: white;
  display: flex;
  align-items: center;
  padding: 0;
  ${media.custom(1300)} {
    flex-direction: column;
    align-items: flex-start;
  };
`;

const Textarea = styled(TextareaAutosize)`
  font-size: 1.2rem;
  font-family: inherit;
  outline: none;
  border: none;
  resize: none;
  padding: 0.5rem;
  flex: 1 1 auto;
  font-weight: ${font.weight.semiBold};
  padding: 1rem 6rem 1rem 1rem;
  border-radius: 8px;
  box-shadow: 0 5px 7px 1px ${color.grey};
  overflow: hidden;
  ${media.custom(1300)} {
    width: 100%;
    font-size: 1rem;
  };
`;

const Buttons = styled.div`
  position: absolute;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 2rem;
  right: 1rem;
  width: 70px;
  height: 100%;
  & > * {
    cursor: pointer;
    :hover {
      color: ${color.nameBlue};
    };
  };
  ${media.custom(1300)} {
    font-size: 1.5rem;
  };
`;

const SendButton = styled(FaTelegramPlane)`
  margin-left: 5px;
`;

const ImageFileUploadButton = styled(AiOutlinePlusCircle)`
  display: flex;
  align-items: center;
  &.selected {
    color: ${color.skyBlue};
  };
`;

export default ChatInput;