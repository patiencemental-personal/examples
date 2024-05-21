import React from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import font from '../../../styles/font';
import color from '../../../styles/color';
import media from '../../../styles/media';
import { useEffect, useCallback } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import useInputRef from '../../../hooks/useInputRef';
import { useState, useRef } from 'react';
import { ko } from 'date-fns/esm/locale';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { usePopupStore } from '../../../stores/usePopupStore';
import popupType from '../../../lib/popupType';
import { editorConfiguration } from '../../../lib/ckEditor';
import ImageFileInput from '../../common/ImageFileInput';
import { createCompetition, getRuleBookGuide } from '../../../api/competition';
import { useAdminStore } from '../../../stores/useAdminStore';
import { getCurrentCompetitionInfo, updateCompetition } from '../../../api/management';
import { useNavigate } from 'react-router-dom';
import useCompetitionStore from '../../../stores/useCompetitionStore';
import { regexKeyMap, validateRegex } from '../../../lib/validation';
import TextareaAutosize from 'react-textarea-autosize';
import { setTime, toKrISOString } from '../../../lib/date';
import routePathMap from '../../../route/path';
import { decode } from 'html-entities';
import { BiHide, BiShow } from 'react-icons/bi';

const gameOptions = [
  { value: '리그오브레전드', label: '리그오브레전드' },
  { value: '스타크래프트', label: '스타크래프트' },
  { value: '피파온라인4', label: '피파온라인4' },
  { value: '카트라이더', label: '카트라이더' },
  { value: '카트라이더 러쉬 플러스', label: '카트라이더 러쉬 플러스' },
  { value: '배틀그라운드', label: '배틀그라운드' },
  { value: '배틀그라운드M', label: '배틀그라운드M' },
  { value: '오버워치2', label: '오버워치2' },
  { value: '서든어택', label: '서든어택' },
  { value: '발로란트', label: '발로란트' },
  { value: '기타', label: '기타' },
]

const FILE_MAX_SIZE = 30 * 1024 * 1024;

const CREATION_MODE = 'creation';
const UPDATION_MODE = 'updation';

const CreationOrUpdationCompetitionForm = ({ mode, authedEmail, prevStep, nextStep, setCreatedCompetitionTitle }) => {

  const [currentEmail, setCurrentEmail] = useState();
  const [isChangedEmail, setIsChangedEmail] = useState(false); // 대회 수정 모드에서 입력 폼에서 기존 이메일에서 다른 이메일이 입력되있는지 여부
  const [completedEmailChange, setCompletedEmailChange] = useState(false); // 대회 수정 모드에서 이메일 변경 인증을 성공한 이후
  const [showEtcItemTeamName, setShowEtcItemTeamName] = useState();
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showAdminPasswordCheck, setShowAdminPasswordCheck] = useState(false);
  
  const downloadFile = useCallback((filePath) => {
    if (filePath) {
      const fileUrl = process.env.REACT_APP_BASE_ORIGIN2 + filePath
      const download = document.createElement('a');
      download.href = fileUrl;
      download.target = '_blank';
      download.setAttribute('type', 'application/json');
      download.click();
    } else {
      alert('다운 받을 파일이 존재하지 않습니다.')
    }
  }, []);

  const navigate = useNavigate();
  const api_key = useAdminStore((state) => state.apiKey);
  const competitionId = useAdminStore((state) => state.competition_id);
  const setAdminName = useAdminStore((state) => state.setName);
  const competitionInfo = useCompetitionStore((state) => state.info);

  const [existFileMap, setExistFileMap] = useState({
    poster: null,
    rulebook: null,
    pc_banner: null,
    mobile_banner: null
  })
  const [exampleRuleBookGuide, setExampleRuleBookGuide] = useState();

  useEffect(() => {
    if (mode === UPDATION_MODE) {
      // async functin define
      const fetchCurrentCompetitionInfo = async () => {
        try {
          const response = await getCurrentCompetitionInfo(competitionId, api_key);
          const currentCompetitionInfo = response.data[0];

          // basic form
          const eventCategory = competitionInfo[0].event_category;
          const {
            // event_category, // 대회 종목 추후 처리
            event_name, place, price,
            recruit_start_date, recruit_end_date,
            event_start_time, event_end_time
          } = currentCompetitionInfo;

          updateSelectedGame({ value: eventCategory, label: eventCategory })
          competitionNameInputRef.set(event_name)
          placeInputRef.set(place)
          priceInputRef.set(price)
          updateRecruitPeriod({
            start: new Date(recruit_start_date),
            end: new Date(recruit_end_date)
          })
          updateEventPeriod({
            start: new Date(event_start_time),
            end: new Date(event_end_time)
          })

          // file form
          const {
            poster, // "/static/poster/2/a39f7d56-18f8-4dc8-988a-f7a76fb01b37.png",
            rulebook, // "/static/rulebook/2/928d3f4d-8bf0-4bf9-8df1-99d87fd91814.pdf"
            pc_banner,
            mobile_banner
          } = currentCompetitionInfo;
          setExistFileMap({
            poster: poster,
            rulebook: rulebook,
            pc_banner: pc_banner,
            mobile_banner: mobile_banner
          })

          // admin form
          const { name, phone, email } = currentCompetitionInfo;
          adminNameInputRef.set(name);
          adminPhoneInputRef.set(phone);
          adminEmailInputRef.set(email);
          setCurrentEmail(email);

          // 대회 내용
          const { body } = currentCompetitionInfo;
          setEditorData(decode(body));
        } catch (error) {
          navigate(-1);
          openPopup({
            type: popupType.MESSAGE,
            props: { message: '현재 접근할 수 없는 대회 입니다.' }
          })
        }
      }

      fetchCurrentCompetitionInfo();
    }
    
    // getRuleBookGuide
    const fetchExampleRuleBookGuide = async () => {
      const exampleRuleBookGuide = await getRuleBookGuide();
      setExampleRuleBookGuide(exampleRuleBookGuide)
    }

    fetchExampleRuleBookGuide();
    closePopup();
  }, [])

  const openPopup = usePopupStore((state) => state.open);
  const closePopup = usePopupStore((state) => state.close);

  const printBasicForm = () => {
    console.log('********* BASIC FORM *********')
    console.log('********* BASIC FORM *********')
    console.log('********* BASIC FORM *********')
    console.log('selectedGame:: ' + selectedGame.value)
    console.log('competitionNameInputRef:: ' + competitionNameInputRef.get())
    console.log('recruit period:: ' + JSON.stringify(recruitPeriod))
    console.log('event period:: ' + JSON.stringify(eventPeriod))
    console.log('placeInputRef:: ' + placeInputRef.get())
    console.log('priceInputRef:: ' + priceInputRef.get())
    console.log(' ')
    console.log(' ')
    console.log(' ')
  }
  const printFileForm = () => {
    console.log('********* FILE FORM *********')
    console.log('********* FILE FORM *********')
    console.log('********* FILE FORM *********')
    console.log('--- POST IMAGE ---')
    console.log(postImage)
    console.log('--- RULE BOOK ---')
    console.log(ruleBook)
    console.log('--- WEB BANNER IMAGE ---')
    console.log(webBannerImage)
    console.log('--- MOBILE BANNER IMAGE ---')
    console.log(mobileBannerImage)
    console.log(' ')
    console.log(' ')
    console.log(' ')
  }
  const printAdminForm = () => {
    console.log('********* ADMIN FORM *********')
    console.log('********* ADMIN FORM *********')
    console.log('********* ADMIN FORM *********')
    console.log('adminNameInputRef:: ' + adminNameInputRef.get())
    console.log('adminPhoneInputRef:: ' + adminPhoneInputRef.get())
    console.log('adminPasswordInputRef:: ' + adminPasswordInputRef.get())
    console.log('adminPasswordCheckInputRef:: ' + adminPasswordCheckInputRef.get())
    console.log(' ')
    console.log(' ')
    console.log(' ')
  }
  const printEtcForm = () => {
    console.log('********* ETC FORM *********')
    console.log('********* ETC FORM *********')
    console.log('********* ETC FORM *********')
    console.log('teamFightCheck:: ' + teamFightCheckRef.current.checked);
    etcItems.forEach((etcItem, index) => console.log(`etcItem${index + 1}:: ` + etcItem.value));
    console.log(' ')
    console.log(' ')
    console.log(' ')
  }
  const printEditorForm = () => {
    console.log('********* EDITOR FORM *********')
    console.log('********* EDITOR FORM *********')
    console.log('********* EDITOR FORM *********')
    console.log(editorData);
    console.log('')
    console.log('')
    console.log('')
  }

  const print = () => {
    console.clear();
    // BASIC FORM
    printBasicForm()
    // 포스터 || 배너 업로드 || 대회 규정집
    printFileForm()
    // ADMIN FORM
    printAdminForm()
    // ETC FORM
    printEtcForm()
    // EDITOR FORM
    printEditorForm()
  }

  const validateBasicForm = () => {
    let valid = true;
    [
      competitionNameInputRef, placeInputRef, priceInputRef
    ].forEach(inputRefItem => valid = inputRefItem.validate());

    if (!recruitPeriod.start || !recruitPeriod.end || !eventPeriod.start || !eventPeriod.end) {
      valid = false;
    }

    return valid;
  }

  const validateFileForm = () => {
    if (mode === UPDATION_MODE) return true;
    else return postImage;
  }

  const validateAdminForm = () => {
    let resultValid = true;
    const adminInputRefs = [adminNameInputRef, adminPhoneInputRef]
    if (mode === CREATION_MODE) {
      adminInputRefs.push(adminPasswordInputRef)
    } else if (mode === UPDATION_MODE) {
      adminInputRefs.push(adminEmailInputRef)
    }

    adminInputRefs.forEach(inputRefItem => {
      const localValid = inputRefItem.validate()
      if (!localValid) resultValid = false;
      if (adminPasswordInputRef === inputRefItem && localValid) {
        if (adminPasswordInputRef.get() !== adminPasswordCheckInputRef.get()) {
          adminPasswordCheckInputRef.setWarningMessage('비밀번호가 일치하지 않습니다.')
          resultValid = false;
        } else {
          adminPasswordCheckInputRef.setWarningMessage('')
        }
      }
    })

    return resultValid;
  }

  const validateEtcForm = () => {
    let valid = true;
    etcItems.some(etcItem => {
      if ([null, undefined, ''].includes(etcItem.value?.trim())) {
        valid = false;
        return true; // break
      }
      return false; // continue
    })
    return valid;
  }

  const validateForms = () => {
    let validResult = { valid: true };

    // BASIC FORM VALIDATION
    if (!validateBasicForm()) {
      if (validResult.valid) { // first unvalid
        validResult = { // first unvalid
          valid: false,
          formEleId: 'basicForm',
          message: '입력 정보를 다시 확인해주세요.'
        }
      }
    }

    // FILE FORM VALIDATION
    if (!validateFileForm()) {
      if (validResult.valid) { // first unvalid
        validResult = {
          valid: false,
          formEleId: 'fileForm',
          message: '포스터는 필수 항목입니다.'
        }
      }
    }

    // ADMIN FORM VALIDATION
    if (!validateAdminForm()) {
      if (validResult.valid) { // first unvalid
        validResult = {
          valid: false,
          formEleId: 'adminForm',
          message: '입력 정보를 다시 확인해주세요.'
        }
      }
    }

    // ETC FORM VALIDATION
    if (!validateEtcForm()) {
      if (validResult.valid) { // first unvalid
        validResult = {
          valid: false,
          formEleId: 'etcForm',
          message: '추가 하신 기타 항목을 입력해주세요.'
        }
      }
    }

    return validResult;
  }

  const competition_id = useAdminStore((state) => state.competition_id)

  const onUpdationSubmit = async () => {
    // print();
    openPopup({ type: popupType.LOADING })

    const { valid, formEleId, message } = validateForms();
    if (!valid) unValidAction(formEleId, message);
    else {
      const data = {
        event_name: competitionNameInputRef.get().trim(), // 대회명
        recruit_start_date: setTimeAndtoKrISOString(recruitPeriod.start, 'start'), // 모집 시작일
        recruit_end_date: setTimeAndtoKrISOString(recruitPeriod.end, 'end'),  // 모집 종료일
        event_start_time: setTimeAndtoKrISOString(eventPeriod.start, 'start'), // 대회 시작일
        event_end_time: setTimeAndtoKrISOString(eventPeriod.end, 'end'), // 대회 종료일
        place: placeInputRef.get().trim(), // 장소
        price: priceInputRef.get().trim(), // 상금
        email: adminEmailInputRef.get(), // 관리자 이메일
        name: adminNameInputRef.get().trim(), // 관리자 이름
        phone: adminPhoneInputRef.get(), // 관리자 폰 번호
        body: editorData, // 대회 개요
      }

      const formData = new FormData();
      formData.append('reqBody', JSON.stringify(data));
      if (postImage) formData.append('poster', postImage);
      if (ruleBook) formData.append('rulebook', ruleBook);
      if (webBannerImage) formData.append('pc_banner', webBannerImage);
      if (mobileBannerImage) formData.append('mobile_banner', mobileBannerImage);

      try {
        const response = await updateCompetition(formData, api_key, competitionId)
        if (response.status) {
          openPopup({
            type: popupType.MESSAGE,
            props: {
              message: '대회 정보가 수정되었습니다.',
              buttons: [
                {
                  name: '확인',
                  onClick: () => {
                    navigate({
                      pathname: `/${routePathMap.COMPETITION.INDEX}`,
                      search: `?id=${competition_id}`,
                    }, {
                      replace: true,
                      state: { 
                        index: competition_id, 
                        menuIndex: 0, 
                      }
                    })
                    setAdminName(adminNameInputRef.get())
                    closePopup()
                  }
                }
              ]
            }
          })
        }
      } catch (error) {
        openPopup({ 
          type: popupType.MESSAGE, 
          props: { 
            message: error.data.message === undefined ? '서버 에러 입니다' : error.data.message
          }
        })
      }
    }
  }

  const onCreationSubmit = async () => {
    // print();
    openPopup({ type: popupType.LOADING })
    
    const { valid, formEleId, message } = validateForms();
    if (!valid) unValidAction(formEleId, message);
    else {
      const data = {
        event_category: selectedGame.value, // 종목명
        event_name: competitionNameInputRef.get().trim(), // 대회명
        recruit_start_date: setTimeAndtoKrISOString(recruitPeriod.start, 'start'), // 모집 시작일
        recruit_end_date: setTimeAndtoKrISOString(recruitPeriod.end, 'end'),  // 모집 종료일
        event_start_time: setTimeAndtoKrISOString(eventPeriod.start, 'start'), // 대회 시작일
        event_end_time: setTimeAndtoKrISOString(eventPeriod.end, 'end'), // 대회 종료일
        place: placeInputRef.get().trim(), // 장소
        price: priceInputRef.get().trim(), // 상금
        is_teamfight: teamFightCheckRef.current.checked ? 1 : 0, // 팀(1) or 개인(0)
        email: authedEmail, // 관리자 이메일
        name: adminNameInputRef.get().trim(), // 관리자 이름
        phone: adminPhoneInputRef.get(), // 관리자 폰 번호
        password: adminPasswordInputRef.get(), // 관리자 비밀번호
        body: editorData, // 대회 개요
      }
      etcItems.forEach((etcItem, index) => data[`etc_name${index + 1}`] = etcItem.value.trim());

      const formData = new FormData();
      formData.append('reqBody', JSON.stringify(data));
      if (postImage) formData.append('poster', postImage);
      if (ruleBook) formData.append('rulebook', ruleBook);
      if (webBannerImage) formData.append('pc_banner', webBannerImage);
      if (mobileBannerImage) formData.append('mobile_banner', mobileBannerImage);

      try {
        const response = await createCompetition(formData);
        closePopup();
        if (response.status === 201) {
          setCreatedCompetitionTitle(competitionNameInputRef.get());
          nextStep();
        }
      } catch (error) {
        let errorMessage = error.data.message;
        errorMessage = errorMessage.includes('재 인증') ? errorMessage.replace('재 인증', '재인증') : errorMessage
        openPopup({
          type: popupType.MESSAGE,
          props: { 
            message: errorMessage,
            buttons: [
              {
                name: '확인',
                onClick: () => {
                  closePopup();
                  if (errorMessage.includes('재인증')) {
                    prevStep();
                  }
                }
              }
            ]
          }
        })
      }
    }
  }

  const setTimeAndtoKrISOString = (date, startOrEnd) => {
    switch (startOrEnd) {
      case 'start':
        setTime(date, { hours: 0, minutes: 0, seconds: 1 });
        break;
      case 'end':
        setTime(date, { hours: 23, minutes: 59, seconds: 59 });
        break;
      default:
        // default문이 절대 실행되면 안되는 경우 예외를 던지자 => 개발 단계에서 실수 방지
        throw new Error('setTimeAndtoKrISOString function startOrEnd parameter must have need start or end string');
    }
    return toKrISOString(date);
  }

  const unValidAction = (formEleId, message) => {
    openPopup({
      type: popupType.MESSAGE,
      props: {
        message,
        buttons: [
          {
            name: '확인',
            onClick: () => {
              closePopup()
              const to = window.document.querySelector(`#${formEleId}`);
              window.scroll({ top: to.offsetTop + 50, behavior: 'smooth' });
            }
          }
        ]
      }
    })
  }


  // BASIC FORM
  const [selectedGame, updateSelectedGame] = useState(gameOptions[0]);
  const competitionNameInputRef = useInputRef({ validRules: ['require'], })
  const [recruitPeriod, updateRecruitPeriod] = useState({ start: null, end: null   })
  const [eventPeriod, updateEventPeriod] = useState({ start: null, end: null })
  const placeInputRef = useInputRef({ validRules: ['require'], })
  const priceInputRef = useInputRef({ validRules: ['require'], })

  // ADMIN FORM
  const adminNameInputRef = useInputRef({validRules: [
    {
      rule: 'require',
      warning: '반드시 필요한 값 입니다.'
    },
    {
      rule: 'hangul',
      warning: '한글 이름(예. 홍길동)만 입력 가능합니다.'
    }
  ]});
  const adminPhoneInputRef = useInputRef({
    validRules: ['require', 'phone'],
    convert: (value) => {
      return value
        .replace(/[^0-9]/g, "")
        .replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3")
        .replace("--", "-");
    },
  })
  const adminPasswordInputRef = useInputRef({ validRules: ['require', 'password'], })
  const adminPasswordCheckInputRef = useInputRef() // validateAdminForm 함수에서 검증
  const adminEmailInputRef = useInputRef() // admin

  // file
  const [postImage, selectPostImage] = useState(null);
  const [ruleBook, selectRuleBook] = useState(null);
  const useRuleBookInputRef = useRef();
  const onChangeRuleBook = (event) => {
    if (event.target.files.length === 0) return;
    if (event.target.files[0].size > FILE_MAX_SIZE) {
      openPopup({ type: popupType.MESSAGE, props: { message: '파일 제한 용량을 초과하였습니다.' } })
      return;
    }
    selectRuleBook(event.target.files[0]);
  }
  const [webBannerImage, selectWebBannerImage] = useState(null);
  const [mobileBannerImage, selectMobileBannerImage] = useState(null);

  // ETC FORM
  const teamFightCheckRef = useRef();
  const [etcItems, setEtcItems] = useState([]);
  const updateEtcItem = useCallback((key, value) => {
    const copiedEtcItems = [...etcItems];
    const finded = copiedEtcItems.find(etcItem => etcItem.key === key);
    finded.value = value;
    setEtcItems(copiedEtcItems);
  }, [etcItems]);
  const deleteEtcItem = useCallback(key => {
    const deletedEtcItems = etcItems.filter(etcItem => etcItem.key !== key);
    setEtcItems(deletedEtcItems);
  }, [etcItems]);

  // ckeditor
  const [editorData, setEditorData] = useState('');

  return (
    <React.Fragment>
      <Block>
        <Divider />

        <BasicForm id='basicForm'>
          {/* 게임종목 - select */}
          <InputItem>
            <InputBox className='flex-align-end'>
              <Label htmlFor='gameSelect' className='require'>게임 종목</Label>
              <Select
                className='select'
                value={selectedGame}
                options={gameOptions}
                isDisabled={mode === UPDATION_MODE}
                onChange={(selectedGame) => {
                  updateSelectedGame(selectedGame)
                }}
              />
            </InputBox>
          </InputItem>

          {/* 대회명 */}
          <InputItem>
            <InputBox>
              <Label htmlFor='competitionName' className='require'>대회명</Label>
              <Input
                ref={competitionNameInputRef.reference}
                onChange={competitionNameInputRef.onChange}
                maxLength={45}
                name='competitionName'
                id='competitionName'
                type='text'
                placeholder='VSS 배 온라인 대회'
                autoComplete='off'
              />
            </InputBox>
            <Warning className='warning'>{competitionNameInputRef.warningMessage}</Warning>
          </InputItem>

          {/* 모집기간 */}
          <InputItem>
            <InputBox>
              <Label className='require'>모집 기간</Label>
              <DatePickerGroupWrapper>
                <DatePicker
                  locale={ko}
                  dateFormat='yyyy-MM-dd'
                  placeholderText='모집 시작 일자'
                  maxDate={recruitPeriod.end}
                  selected={recruitPeriod.start}
                  onChange={(date) => updateRecruitPeriod({ ...recruitPeriod, start: date })}
                  onKeyDown={(event) => {
                    event.preventDefault();
                  }}
                />
                <span>  -  </span>
                <DatePicker
                  locale={ko}
                  dateFormat='yyyy-MM-dd'
                  placeholderText='모집 종료 일자'
                  minDate={recruitPeriod.start}
                  selected={recruitPeriod.end}
                  onChange={(date) => updateRecruitPeriod({ ...recruitPeriod, end: date })}
                  onKeyDown={(event) => {
                    event.preventDefault();
                  }}
                />
              </DatePickerGroupWrapper>
            </InputBox>
          </InputItem>

          {/* 대회기간 */}
          <InputItem>
            <InputBox>
              <Label className='require'>대회 기간</Label>
              <DatePickerGroupWrapper>
                <DatePicker
                  locale={ko}
                  dateFormat='yyyy-MM-dd'
                  placeholderText='대회 시작 일자'
                  maxDate={eventPeriod.end}
                  selected={eventPeriod.start}
                  onChange={(date) => updateEventPeriod({ ...eventPeriod, start: date })}
                  onKeyDown={(event) => {
                    event.preventDefault();
                  }}
                />
                <span>  -  </span>
                <DatePicker
                  locale={ko}
                  dateFormat='yyyy-MM-dd'
                  placeholderText='대회 종료 일자'
                  minDate={eventPeriod.start}
                  selected={eventPeriod.end}
                  onChange={(date) => updateEventPeriod({ ...eventPeriod, end: date })}
                  onKeyDown={(event) => {
                    event.preventDefault();
                  }}
                />
              </DatePickerGroupWrapper>
            </InputBox>
          </InputItem>

          {/* 장소 */}
          <InputItem>
            <InputBox>
              <Label htmlFor='place' className='require'>장소</Label>
              <Textarea
                ref={placeInputRef.reference}
                maxLength={100}
                maxRows={6}
                onChange={placeInputRef.onChange}
                name='place'
                id='place'
                type='text'
                placeholder='경상북도 경산시 하양읍 하양로 13-13&#13;&#10;Glocal Hub A동'
                autoComplete='off'
                // rows='1'
              />
            </InputBox>
            <Warning className='warning'>{placeInputRef.warningMessage}</Warning>
          </InputItem>

          {/* 상금 */}
          <InputItem>
            <InputBox>
              <Label htmlFor='price' className='require'>상금</Label>
              <Textarea
                ref={priceInputRef.reference}
                maxLength={100}
                maxRows={6}
                onChange={priceInputRef.onChange}
                name='price'
                id='price'
                type='text'
                placeholder='1등 30만원&#13;&#10;2등 20만원&#13;&#10;3등 10만원'
                autoComplete='off'
                // rows='1'
              />
            </InputBox>
            <Warning className='warning'>{priceInputRef.warningMessage}</Warning>
          </InputItem>
        </BasicForm>

        <Divider />

        <FileForm id='fileForm'>
          {/* 포스터 */}
          <InputItem className='uploadInputItem'>
            <InputBox>
              <LabelGroup>
                <Label className='require'>포스터</Label>
                <SubLabel className='require'>최대 용량 5MB</SubLabel>
              </LabelGroup>
              <FileGroup>
                <ImageFileWrapper>
                  <ImageFileInput maxSize={FILE_MAX_SIZE} selectImage={selectPostImage} isSelf={true}>
                    <button className={![null, undefined].includes(postImage) ? 'exist' : ''}>파일 업로드</button>
                  </ImageFileInput>
                  {postImage && <ImageFileName>{postImage.name}</ImageFileName>}
                </ImageFileWrapper>
                {
                  mode === UPDATION_MODE && (
                    <div>
                      <button
                        onClick={() => downloadFile(existFileMap.poster)} 
                        className='example'
                      >
                        포스터 다운로드
                      </button>
                    </div>
                  )
                }
              </FileGroup>
            </InputBox>
          </InputItem>

          {/* 대회 규정집 */}
          <InputItem className='uploadInputItem'>
            <InputBox>
              <LabelGroup>
                <Label>대회 규정집</Label>
                <SubLabel className='require'>최대 용량 5MB</SubLabel>
              </LabelGroup>
              <FileGroup>
                <React.Fragment>
                  <ImageFileWrapper>
                    <input
                      ref={useRuleBookInputRef}
                      type="file"
                      name="file"
                      accept="application/pdf"
                      style={{ 'display': 'none' }}
                      onChange={onChangeRuleBook}
                    />
                    <span className='self' onClick={(event) => {
                      event.preventDefault();
                      if (event.target.className !== 'self') {
                        useRuleBookInputRef.current.click();
                      }
                    }}>
                      <button
                        className={![null, undefined].includes(ruleBook) ? 'exist' : ''}
                      >파일 업로드</button>
                    </span>
                    {ruleBook && <ImageFileName>{ruleBook.name}</ImageFileName>}
                  </ImageFileWrapper>

                </React.Fragment>
                <div>
                  <button
                    onClick={() => downloadFile(exampleRuleBookGuide)} 
                    className='example'
                  >
                    예시 파일 다운로드
                  </button>
                </div>
                {
                  mode === UPDATION_MODE && (
                    <div>
                      <button
                        onClick={() => downloadFile(existFileMap.rulebook)} 
                        className='example'
                      >
                        규정집 다운로드
                      </button>
                    </div>
                  )
                }
              </FileGroup>
            </InputBox>
          </InputItem>

          {/* 배너 관리자 */}
          <InputItem className='uploadInputItem'>
            <InputBox>
              <LabelGroup>
                <Label>배너 업로드</Label>
                <SubLabel className='require'>최대 용량 5MB</SubLabel>
                <SubLabel className='require'>웹 배너 : 1920 x 400 px</SubLabel>
                <SubLabel className='require'>모바일 배너 : 750 x 800 px</SubLabel>
              </LabelGroup>
              <FileGroup>
                <ImageFileWrapper>
                  <ImageFileInput maxSize={FILE_MAX_SIZE} selectImage={selectWebBannerImage} isSelf={true}>
                    <button className={![null, undefined].includes(webBannerImage) ? 'exist' : ''}>웹 배너 업로드</button>
                  </ImageFileInput>
                  {webBannerImage && <ImageFileName>{webBannerImage.name}</ImageFileName>}
                </ImageFileWrapper>
                <ImageFileWrapper>
                  <ImageFileInput maxSize={FILE_MAX_SIZE} selectImage={selectMobileBannerImage} isSelf={true}>
                    <button className={![null, undefined].includes(mobileBannerImage) ? 'exist' : ''}>모바일 배너 업로드</button>
                  </ImageFileInput>
                  {mobileBannerImage && <ImageFileName>{mobileBannerImage.name}</ImageFileName>}
                </ImageFileWrapper>
                {
                  mode === UPDATION_MODE && (
                    <React.Fragment>
                      <div>
                        <button
                          onClick={() => downloadFile(existFileMap.pc_banner)} 
                          className='example'
                        >
                          웹 배너 다운로드
                        </button>
                      </div>
                      <div>
                        <button
                          onClick={() => downloadFile(existFileMap.mobile_banner)} 
                          className='example'
                        >
                          모바일 배너 다운로드
                        </button>
                      </div>
                    </React.Fragment>
                  )
                }
              </FileGroup>
            </InputBox>
            <BannerGuideText>배너를 업로드하면 관리자 검토 후 메인 페이지 배너에 적용됩니다.</BannerGuideText>
          </InputItem>
        </FileForm>

        <Divider />

        <AdminForm id='adminForm'>
          {/* 관리자 이름 */}
          <InputItem className='adminInputItem'>
            <InputBox>
              <Label htmlFor='adminName' className='require admin'>관리자 이름</Label>
              <Input
                ref={adminNameInputRef.reference}
                maxLength={45}
                onChange={adminNameInputRef.onChange}
                name='adminName'
                id='adminName'
                type='text'
                placeholder='김관리자'
                autoComplete='off'
              />
            </InputBox>
            <Warning className='warning'>{adminNameInputRef.warningMessage}</Warning>
          </InputItem>

          {/* 관리자 휴대폰 번호 */}
          <InputItem className='adminInputItem'>
            <InputBox>
              <Label htmlFor='adminPhone' className='require admin'>휴대폰 번호</Label>
              <Input
                ref={adminPhoneInputRef.reference}
                maxLength={13}
                onChange={adminPhoneInputRef.onChange}
                name='adminPhone'
                id='adminPhone'
                type='text'
                placeholder='010-0000-0000'
                autoComplete='off'
              />
            </InputBox>
            <Warning className='warning'>{adminPhoneInputRef.warningMessage}</Warning>
          </InputItem>

          {/* 관리자 비밀번호 입력 및 확인 */}
          {
            mode === CREATION_MODE && (
              <React.Fragment>
                <InputItem className='adminInputItem'>
                  <InputBox>
                    <Label htmlFor='adminPassword' className='require admin'>비밀번호</Label>
                    <Input
                      ref={adminPasswordInputRef.reference}
                      maxLength={100}
                      onChange={adminPasswordInputRef.onChange}
                      name='adminPassword'
                      id='adminPassword'
                      type={showAdminPassword ? 'text' : 'password'}
                      placeholder='영문과 숫자, 특수 문자 조합 8~15 자리'
                      autoComplete='off'
                    />
                    <ShowOrHideButton onClick={() => setShowAdminPassword(prev => !prev)}>
                      {showAdminPassword ? <BiShow /> : <BiHide />}
                    </ShowOrHideButton>
                  </InputBox>
                  <Warning className='warning'>{adminPasswordInputRef.warningMessage}</Warning>
                </InputItem>

                <InputItem className='adminInputItem'>
                  <InputBox>
                    <Label htmlFor='adminPasswordCheck' className='require admin'>비밀번호 확인</Label>
                    <Input
                      ref={adminPasswordCheckInputRef.reference}
                      maxLength={100}
                      onChange={adminPasswordCheckInputRef.onChange}
                      name='adminPasswordCheck'
                      id='adminPasswordCheck'
                      type={showAdminPasswordCheck ? 'text' : 'password'}
                      placeholder='영문과 숫자, 특수 문자 조합 8~15 자리'
                      autoComplete='off'
                    />
                    <ShowOrHideButton onClick={() => setShowAdminPasswordCheck(prev => !prev)}>
                      {showAdminPasswordCheck ? <BiShow /> : <BiHide />}
                    </ShowOrHideButton>
                  </InputBox>
                  <Warning className='warning'>{adminPasswordCheckInputRef.warningMessage}</Warning>
                </InputItem>
              </React.Fragment>
            )
          }
          {/* 관리자 이메일 */}
          {
            mode === UPDATION_MODE && (
              <InputItem className='adminInputItem'>
                <InputBox>
                  <Label htmlFor='adminEmail' className='require admin'>관리자 이메일</Label>
                  <Input
                    ref={adminEmailInputRef.reference}
                    maxLength={100}
                    onChange={() => {
                      setIsChangedEmail(() => {
                        const changedEmail = adminEmailInputRef.reference.current.value;
                        return currentEmail !== changedEmail && validateRegex(regexKeyMap.email, changedEmail)
                      })
                    }}
                    name='adminEmail'
                    id='adminEmail'
                    type='text'
                    autoComplete='off'
                    className='adminEmail'
                    readOnly={completedEmailChange}
                  />
                </InputBox>
                {
                  !completedEmailChange && (
                    <ChangeButtons>
                      <button 
                        className={`emailChangeBtn ${isChangedEmail ? 'emailChanged' : ''}`}
                        onClick={() => {
                          if (isChangedEmail) {
                            openPopup({
                              type: popupType.EMAIL_AUTH,
                              props: {
                                email: adminEmailInputRef.get(),
                                onCompleteEmailChange: () => { setCompletedEmailChange(true); }
                              }
                            })
                          }
                        }}
                      >이메일 변경</button>
                      <button
                        className={`passwordChangeBtn ${isChangedEmail ? 'emailChanged' : ''}`}
                        onClick={() => {
                          if (!isChangedEmail) {
                            openPopup({
                              type: popupType.ADMIN_PASSWORD_CHANGE,
                              props: {
                                competitionId,
                                email: currentEmail,
                              }
                            })
                          }
                        }}
                      >비밀번호 변경</button>
                    </ChangeButtons>
                  )
                }
              </InputItem>
            )
          }
        </AdminForm>

        {
          mode === CREATION_MODE && (
            <React.Fragment>
              <Divider />

              <EtcForm id='etcForm'>
                <EtcFormTitle>참가자 정보 양식</EtcFormTitle>
                <IndividulaOrTeam>
                  <span>개인</span>
                  <label>
                    <input 
                      type="checkbox"
                      ref={teamFightCheckRef}
                      onChange={() => {
                        setShowEtcItemTeamName(teamFightCheckRef.current.checked)
                      }}
                    />
                  </label>
                  <span>팀</span>
                </IndividulaOrTeam>
                <EtcItems>
                  <EtcItem className='etcItem' key='default_nickname'>
                    <input defaultValue='게임닉네임' readOnly />
                  </EtcItem>
                  <EtcItem className='etcItem' key='default_email'>
                    <input defaultValue='이메일' readOnly />
                  </EtcItem>
                  <EtcItem className='etcItem' key='default_name'>
                    <input defaultValue='이름' readOnly />
                  </EtcItem>
                  <EtcItem className='etcItem' key='default_phone'>
                    <input defaultValue='전화번호' readOnly />
                  </EtcItem>
                  <EtcItem className='etcItem' key='default_birthday'>
                    <input defaultValue='생년월일' readOnly />
                  </EtcItem>
                  {
                    showEtcItemTeamName && (
                      <EtcItem className='etcItem' key='default_teamName'>
                        <input defaultValue='팀명' readOnly />
                      </EtcItem>
                    )
                  }
                  {
                    etcItems.map((etcItem) => {
                      const { key, value } = etcItem;
                      return (
                        <EtcItem className='etcItem' key={key}>
                          <span
                            className='deleteBtn'
                            onClick={() => {
                              deleteEtcItem(key);
                            }}
                          >ㅡ</span>
                          <input
                            className={value === '' ? 'empty' : ''}
                            defaultValue={value}
                            maxLength={100}
                            type="text"
                            placeholder={'입력해주세요.'}
                            onChange={(event) => {
                              updateEtcItem(key, event.currentTarget.value);
                            }}
                          />
                        </EtcItem>
                      )
                    })
                  }
                </EtcItems>

                <AddEtcButton
                  onClick={() => {
                    if (etcItems.length >= 4) {
                      openPopup({
                        type: popupType.MESSAGE,
                        props: { message: '최대 기타 항목 추가 수는 4개입니다.' }
                      })
                      return;
                    }
                    const newEtcItems = [...etcItems, {
                      key: etcItems.length + new Date(),
                      value: ''
                    }]
                    setEtcItems(newEtcItems)
                  }}
                >항목 추가</AddEtcButton>
              </EtcForm>
            </React.Fragment>
          )
        }

        <Divider />

        <EditorForm>
          <EditorFormTitle>대회 개요</EditorFormTitle>
          <CKEditor
            editor={Editor}
            config={editorConfiguration}
            data={editorData}
            onChange={(event, editor) => {
              const data = editor.getData();
              setEditorData(data);
            }}
          />
        </EditorForm>
      </Block>
      <ButtonsBlock>
        {
          mode === CREATION_MODE && (
            <React.Fragment>
              <Button onClick={prevStep}>이전</Button>
              <Button onClick={onCreationSubmit}>다음</Button>
            </React.Fragment>
          )
        }
        {
          mode === UPDATION_MODE && (
            <Button onClick={onUpdationSubmit}>저장하기</Button>
          )
        }
      </ButtonsBlock>
    </React.Fragment>
  );
};

const EditorForm = styled.div`
  padding: 1rem;
  padding-top: 3rem;
  .ck-editor {
    box-shadow: 0px 5px 7px 1px ${color.grey};
  }
  .ck-editor__editable_inline {
    height: 1200px;
    overflow: auto;
  }
  .ck .ck-placeholder:before, .ck.ck-placeholder:before {
    color: ${color.placeholder};
  }
`
const EditorFormTitle = styled.h2`
  position: relative;
  text-align: center;
  margin-bottom: 2rem;
`

const FileForm = styled.div`
  padding: 3rem 2rem 1rem;
`

const EtcForm = styled.div`
  padding: 1rem;
  padding-top: 4rem;
  padding-bottom: 2rem;
  display: flex;
  flex-direction: column;
`

const EtcFormTitle = styled.h2`
  position: relative;
  text-align: center;
  margin-bottom: 1.5rem;
  ::before {
    content: '*';
    color: ${color.blushRed};
    position: relative;
    top: -0.8rem;
  }
`

const IndividulaOrTeam = styled.span`
  display: flex;
  justify-content: end;
  align-items: center;
  text-align: right;
  margin-right: 10px;
  margin-bottom: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  label {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  input[type="checkbox"] {
    position: relative;
    margin-right: 10px;
    margin-left: 10px;
    width: 40px;
    height: 20px;
    outline: none;
    background-color: ${color.grey};
    -webkit-appearance: none;
    cursor: pointer;
    border-radius: 20px;
    box-shadow: 0px 5px 7px 1px ${color.grey};
    transition: 0.3s;
  }
  input[type="checkbox"]:checked {
    background-color: ${color.blushRed};
  }
  input[type="checkbox"]::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 20px;
    transition: 0.3s;
  }
  input[type="checkbox"]:checked::before {
    left: 21px;
  }
`

const EtcItems = styled.div`
  padding: 4rem 2rem;
  padding-bottom: 0;
  border-radius: 5px;
  box-shadow: 0px 5px 7px 1px ${color.grey};
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  background-color: ${color.lightGrey};
  .etcItem {
    flex: 1 1 50%;
    max-width: 50%;
    text-align: center;
  }
  ${media.small} {
    flex-direction: column;
    align-items: center;
  }
`

const EtcItem = styled.div`
  position: relative;
  margin-bottom: 4rem;
  input {
    font-size: 0.9rem;
    width: 140px;
    outline: none;
    border: none;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0px 5px 7px 1px ${color.grey};
    text-align: center;
  }
  input::placeholder {
    color: ${color.placeholder};
  }
  input.empty {
    text-align: center;
  }
  input:not([readonly]):focus {
    text-align: left;
  }
  input:focus::placeholder {
    color: transparent;
  }
  .deleteBtn {
    color: ${color.blushRed};
    font-weight: 900;
    position: absolute;
    display: flex;
    justify-content: center;
    align-content: center;
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    line-height: 2rem;
    left: 50%;
    transform: translate(calc(-50% - 70px), -50%);
    background-color: white;
    box-shadow: 0px 5px 7px 1px ${color.grey};
    cursor: pointer;
    :hover {
      box-shadow: 0px 5px 7px 1px ${color.blushRed};
    }
  }
  ${media.small} {
    padding-left: 0 !important;
    max-width: 100% !important;
    input {
      margin-right: 0 !important;
    }
  }
`

const AddEtcButton = styled.button`
  padding: 1rem;
  font-size: 1.2rem;
  border-radius: 5px;
  /* box-shadow: 0px 5px 7px 1px ${color.grey}; */
  width: 20%;
  letter-spacing: 0.1rem;
  margin: 0 auto;
  background-color: ${color.successGreen};
  color: white;
  ${media.small} {
    width: 40%;
    font-size: 0.8rem;
  }
`

const AdminForm = styled.div`
  padding: 3rem 2rem 1rem;
  .adminInputItem {
    input {
      flex: 0 0 50%;
    }
  }
`

const ShowOrHideButton = styled.button`
  margin-left: 0.4rem;
  ${media.small} {
    position: absolute;
    bottom: 0;
    right: -1.5rem;
  }
`

const BasicForm = styled.div`
  padding: 3rem 2rem 1rem;
`

const Divider = styled.div`
  border-bottom: 3px solid #e0e0e0;
`;

const InputItem = styled.div`
  position: relative;
  margin-bottom: 2.5rem;
  &.uploadInputItem {
    margin-bottom: 2rem;
    & > div {
      align-items: flex-start;
    }
  }
`;

const InputBox = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
  align-items: center;
  .select {
    font-size: 0.9rem;
    margin-left: 1rem;
    ${media.small} {
      margin-left: 0;
    }
  }
  ${media.small} {
    flex-direction: column;
    align-items: flex-start;
    label {
      margin-bottom: 1.5rem;
    }
    input {
      width: 100%;
      padding-left: 0;
    }
  }
`

const Label = styled.label`
  position: relative;
  flex: 0 0 20%;
  font-weight: ${font.weight.bold};
  font-size: 1.2rem;
  background-color: #FFE5E5;
  /* &.category {
    background-color: #FFE5E5;
  } */
  &.require::before {
    content: '*';
    color: ${color.lightRed};
    position: absolute;
    top: -0.8rem;
    left: -0.8rem;
  }
  /* &.require.admin::before {
    content: '*';
    color: #0079CA;
    position: absolute;
    top: -0.8rem;
    left: -0.8rem;
  } */
`

const SubLabel = styled.label`
  position: relative;
  flex: 0 0 20%;
  font-weight: ${font.weight.bold};
  color: #0079CA;
  font-size: .4rem;
  left: 0.4rem;
  &.require::before {
    content: '*';
    position: absolute;
    top: -0.4rem;
    left: -0.4rem;
  }
`

// const SubLabel = styled.label`
//   color: ${color.grey};
//   font-size: .4rem;
//   left: 0.4rem;
//   &.require::before {
//     content: '*';
//     position: absolute;
//     top: -0.4rem;
//     left: -0.4rem;
//   }
// `

const LabelGroup = styled.div`
  flex: 0 0 20%;
  display: flex;
  flex-direction: column;
  * {
    margin-bottom: 0.3rem;
  }
  ${media.small} {
    margin-bottom: 1.2rem;
    * {
      margin-bottom: 0.3rem !important;
    }
  }
`

const FileGroup = styled.div`
  flex: 0 0 80%;
  display: flex;
  flex-direction: column;
  button {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
    width: 200px;
    margin-left: 1rem;
    margin-bottom: 1.2rem;
    border-radius: 5px;
    box-shadow: 0px 5px 7px 1px ${color.grey};
    color: ${color.placeholder};
    &.exist {
      color: black;
    }
    :hover {
      color: black;
      box-shadow: 0px 5px 7px 1px ${color.blushRed};
    }
    &.example {
      color: ${color.white};
      background-color: ${color.successGreen};
      box-shadow: none;
    }
  }
  ${media.small} {
    button {
      margin-left: 0;
    }
  }
`

const ImageFileWrapper = styled.div`
  display: flex;
  /* margin-bottom: 1rem; */
`

const BannerGuideText = styled.div`
  color: ${color.lightRed};
  font-size: 1.1rem;
  text-align: center;
`

const ImageFileName = styled.p`
  margin-left: 1.5rem;
  display: inline-flex;
  max-width: 200px;
  font-size: 0.9rem;
  padding: 0.5rem 0;
`

const Input = styled.input`
  flex: 0 0 80%;
  outline: none;
  border: none;
  border-bottom: 1px solid ${color.grey};
  color: ${color.dark};
  font-weight: ${font.weight.regular};
  letter-spacing: 0.05rem;
  font-size: 0.9rem;
  padding: 0 5px 3px 5px;
  margin-left: 1rem;
  &::placeholder { 
    color: ${color.placeholder};
  }
  ${media.small} {
    margin-left: 0;
  }
  &.adminEmail:read-only {
    cursor: not-allowed;
  }
`

const Textarea = styled(TextareaAutosize)`
  flex: 0 0 80%;
  border: none;
  overflow: auto;
  outline: none;
  resize: none;
  border-bottom: 1px solid ${color.grey};
  color: ${color.dark};
  font-weight: ${font.weight.regular};
  letter-spacing: 0.05rem;
  font-size: 0.9rem;
  padding: 0 5px 3px 5px;
  font-family: inherit;
  margin-left: 1rem;
  &::placeholder {
    color: ${color.placeholder};
  }
  ${media.small} {
    margin-left: 0;
    flex: 0 0 auto;
  }
`

const Warning = styled.p`
  margin-bottom: 10px;
  margin-left: calc(20% + 1rem);
  ${media.small} {
    margin-left: 0;
  }
  color: ${color.blushRed};
  padding-left: 5px;
  padding-right: 5px;
  word-break: break-all;
`;

const ChangeButtons = styled(Warning)`
  .emailChangeBtn {
    color: ${color.placeholder};
    cursor: not-allowed;
  }
  .emailChanged {
    color: black;
    cursor: pointer;
  }
  .passwordChangeBtn {
    color: black;
  }
  .passwordChangeBtn.emailChanged {
    color: ${color.placeholder};
    cursor: not-allowed;
  }
  button {
    margin-right: 1rem;
    border-radius: 8px;
    box-shadow: 0px 5px 7px 1px ${color.grey};
    padding: 0.4rem;
    margin-top: 5px;
    :hover {
      color: black;
      box-shadow: 0px 5px 7px 1px ${color.blushRed};
    }
  }
  ${media.small} {
    margin-left: 0;
  }
`

const DatePickerGroupWrapper = styled.div`
  position: relative;
  margin-left: 1rem;
  ${media.small} {
    margin-left: 0;
  }
  * {
    border: none;
  }
  .react-datepicker-wrapper {
    width: auto;
  }
  input {
    border: 1px solid hsl(0, 0%, 80%);
    border-radius: 4px; 
    padding: 0.4rem 0;
    font-size: 0.9rem;
    width: 120px;
    text-align: center;
  }
  input::placeholder {
    color: ${color.placeholder};
  }
  .react-datepicker__tab-loop {
    position: absolute;
  }
  span {
    font-size: 1.2rem;
    color: hsl(0, 0%, 80%)
  }
`

const ButtonsBlock = styled.section`
  position: relative;
  top: 8rem;
  width: 66%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  border-radius: 8px;
  font-size: 1.3rem;
  font-weight: ${font.weight.semiBold};
  width: 130px;
  height: 50px;
  background-color: ${color.blushRed};
  color: ${color.white};
  margin: auto 1rem;
  letter-spacing: 0.1rem;
  transition: .2s;
  &:hover {
    opacity: .9;
  };
`;

const Block = styled.div`
  /* border: 1px solid blue */
`

export default CreationOrUpdationCompetitionForm;