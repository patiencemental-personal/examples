import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import BaseContentBlock from './BaseContentBlock';
import color from '../../styles/color';
import media from '../../styles/media';
import ImageFileInput from '../common/ImageFileInput';
import font from '../../styles/font';
import { useAdminStore } from '../../stores/useAdminStore';
import { usePopupStore } from '../../stores/usePopupStore';
import popupType from '../../lib/popupType';
import { useSearchParams } from 'react-router-dom';
import { getFixtureGuide, getFixture } from '../../api/competition';
import { postFixture } from '../../api/management';

const ScheduleBlock = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get('id');

  const openPopup = usePopupStore((state) => state.open);
  const closePopup = usePopupStore((state) => state.close);
  const logined = useAdminStore((state) => state.logined);
  const logout = useAdminStore((state) => state.logout);
  const { apiKey, setAPIKey } = useAdminStore();

  const [image, selectImage] = useState(null);
  const [caption, setCaption] = useState("");

  const [imageUrl, setImageUrl] = useState(null);

  const getFixtureInfo = useCallback(async () => {
    const fixtureInfo = await getFixture(id);
    if (fixtureInfo !== undefined) {
      setImageUrl(fixtureInfo);
      setCaption(fixtureInfo[0].fixture_body);
    }
  }, [id]);

  const getFixtureEx = useCallback(async () => {
    const response = await getFixtureGuide();
    if(response !== undefined) {
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
  }, [openPopup, closePopup]);

  const settingServerResponse = useCallback((fixtureInfo)=> {
    if(fixtureInfo === 201) {
      setCaption("");
      getFixtureInfo();
      openPopup({
        type: popupType.MESSAGE,
        props: {
          message: `업로드 성공`,
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
    } else if(fixtureInfo === 401) {
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
    } else if(fixtureInfo === 400) {
      openPopup({
        type: popupType.MESSAGE,
        props: {
          message: `이미지 확장자는 jpg, png만 가능합니다.`,
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
  }, [logout, setAPIKey, getFixtureInfo, openPopup, closePopup])

  const postFixtureInfo = useCallback(async () => {
    let fixtureInfo;
    if(caption.length !== 0 && image !== null) {
      let caption2 = caption.trim();
      fixtureInfo = await postFixture(id, caption2, image, apiKey);
      settingServerResponse(fixtureInfo);
    } else if (caption.length === 0){
      openPopup({
        type: popupType.MESSAGE,
        props: {
          message: `대진표 설명이 필요합니다.`,
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
    } else if(image === null || image === undefined) {
      openPopup({
        type: popupType.MESSAGE,
        props: {
          message: `이미지가 필요합니다.`,
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
  }, [id, image, caption, apiKey, openPopup, closePopup, settingServerResponse])

  useEffect(() => {
    getFixtureInfo();
  }, [getFixtureInfo])

  return (
    <BaseContentBlock>
      <TopBlock>
        {
          logined ? (<SaveButton onClick={() => postFixtureInfo()}>저장하기</SaveButton>)
          : (imageUrl && <Body>{imageUrl[0].fixture_body}</Body>)
        }
      </TopBlock>
      {
        logined && (
          <Block>
            <InputBox>
              <Input
                type='text'
                placeholder='대진표 설명을 작성해주세요.'
                maxLength={100}
                value={caption}
                onChange={(e)=>{setCaption(e.target.value)}}
              />
            </InputBox>


            <Divider />


            <FileTool>
              <FileGroup>
                <button className={`uploadButton ${image ? 'uploaded' : ''}`}>
                  <ImageFileInput selectImage={selectImage}>
                    파일 업로드
                  </ImageFileInput>
                </button>
              </FileGroup>

              <Margin />

              <FixtureExButton onClick={()=>getFixtureEx()}>대진표 양식 다운로드</FixtureExButton>
              
            </FileTool>
            
            {image && <FileName>{image.name}</FileName>}
          </Block>
        )
      }
      {
        imageUrl ? (
          <>
            {
              image ?
                <ScheduleImage
                  src={`${URL.createObjectURL(image)}`}
                  alt='대진표'
                />
                :
                <ScheduleImage
                  src={`${process.env.REACT_APP_BASE_ORIGIN2}${imageUrl[0].fixture}`}
                  onClick={()=> window.open(process.env.REACT_APP_BASE_ORIGIN2 + imageUrl[0].fixture, "_blank")}
                  alt='대진표'
                />
            }
          </>
        ) : (
          <>
          {
            image ?
              <ScheduleImage
                src={`${URL.createObjectURL(image)}`}
                alt='대진표'
              />
              :
              <Empty>등록된 대진표가 없습니다.</Empty>
          }
        </>
        )
      }
    </BaseContentBlock>
  );
};

const Divider = styled.div`
  height: 3px;
  background-color: #e0e0e0;
`

const Block = styled.div`
  width: 100%;
  padding: 2rem 3rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 5px 7px 1px ${color.grey};
`;

const Margin = styled.div`
  margin-Right: 1rem;
`

const InputBox = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`

const Input = styled.input`
  font-size: 1.2rem;
  padding: 1rem;
  box-shadow: 0 5px 7px 1px ${color.grey};
  border-radius: 8px;
  outline: none;
  border: none;
  width: 100%;
`

const TopBlock = styled.div`
  text-align: center;
`

const Body = styled.div`
  margin-bottom: 2rem;
  font-size: 1.2rem;
`

const FileGroup = styled.div`
  button {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
    width: 200px;
    margin-left: 1rem;
    margin-bottom: 1.2rem;
    border-radius: 5px;
    box-shadow: 0px 5px 7px 1px ${color.grey};
    color: ${color.grey};
    &.exist {
      color: black;
    }
    :hover {
      color: black;
      box-shadow: 0px 5px 7px 1px ${color.blushRed};
    }
  }
  ${media.small} {
    button {
      margin-left: 0;
    }
  }
`

const SaveButton = styled.button`
  cursor: pointer;
  font-size: 1.3rem;
  font-weight: ${font.weight.bold};
  background-color: ${color.blushRed};
  padding: 1rem;
  text-align: center;
  border-radius: 8px;
  color: white;
  margin-bottom: 2rem;
  ${media.mobile} {
    font-size: 1rem;
    padding: 0.7rem;
  }
`

const FileTool = styled.div`
  margin-top: 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  button {
    margin: 0 2.5%;
    width: 200px;
    font-weight: ${font.weight.bold};
    font-size: 1.2rem;
    box-shadow: 0 5px 7px 1px ${color.grey};
    border-radius: 8px;
    padding: 1rem 0.5rem;
    transition: .2s;
  }
  button.uploadButton {
    color: ${color.stoneGrey}
  }
  button.downloadButton, button.uploaded {
    background-color: ${color.white};
    color: black;
  }
  ${media.custom(580)} {
    flex-direction: column;
    align-items: center;
    .uploadButton, .downloadButton {
      margin: 0;
      margin-bottom: 1.4rem;
      /* width: 227px; */
    }
  }
`

const FileName = styled.p`
  text-align: center;
`

const FixtureExButton = styled.button`
  background-color: ${color.checkGreen};
  color: white;
`

const ScheduleImage = styled.img`
  width: 100%;
  padding: 0 0.7rem;
  margin-bottom: 3rem;
`;

const Empty = styled.div`
  width: 100%;
  height: 300px;
  padding: 0 0.7rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  font-size: 2rem;
`

export default ScheduleBlock;