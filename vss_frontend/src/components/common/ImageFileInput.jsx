import React from 'react';
// import { useState } from 'react';
import { useRef } from 'react';
import styled from 'styled-components';
import popupType from '../../lib/popupType';
import { usePopupStore } from '../../stores/usePopupStore';

/**
 * 참고
 * - https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/image
 * - https://kyounghwan01.github.io/JS/JSbasic/Blob-url/#createobjecturl
 * - https://www.youtube.com/watch?v=PDtW-XAshqs
 * - https://velog.io/@min1378/React-image-%EC%97%85%EB%A1%9C%EB%93%9C
 */
const ImageFileInput = ({ children, selectImage, maxSize, isSelf }) => {

  const inputRef = useRef();
  const open = usePopupStore((state) => state.open);

  const onClick = (event) => {
    event.preventDefault();
    inputRef.current.click();
  };

  const onChangeFile = (event) => {
    if (event.target.files.length === 0) return;
    if (maxSize && event.target.files[0].size > maxSize) {
      open({ type: popupType.MESSAGE, props: { message: '파일 제한 용량을 초과하였습니다.' } })
      return;
    }
    selectImage(event.target.files[0]);
    event.target.value = ''; // 같은 파일 입력 시 대응 https://wiki.jjagu.com/?p=371
  };

  return (
    <React.Fragment>
      <Input
        ref={inputRef}
        type='file'
        accept='image/*'
        name='file'
        onChange={onChangeFile}
      />
      <span className='self' onClick={onClick}>
        {children || <Button>image upload button</Button>}
      </span>
    </React.Fragment>
  );
};

const Input = styled.input`
  display: none;
;`

// default style
const Button = styled.button`
  border: 1px solid red;
`;

export default ImageFileInput;