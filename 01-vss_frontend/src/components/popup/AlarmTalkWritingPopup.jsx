import React, { useState } from 'react';
import { usePopupStore } from '../../stores/usePopupStore';
import {
  PopupTemplate,
  PopupHead,
  PopupBody,
  PopupFooter,
  Button
} from './common/index';
import styled from 'styled-components';
import TextareaAutosize from 'react-textarea-autosize';
import color from '../../styles/color';
import font from '../../styles/font';
import useInputRef from '../../hooks/useInputRef';
import { useEffect } from 'react';
import Spinner from '../common/Spinner';
import useLoading from '../../hooks/useLoading';
import popupType from '../../lib/popupType';
import { useAdminStore } from '../../stores/useAdminStore';
import { useCallback } from 'react';
import { pushSms } from '../../api/management';
import { toast } from 'react-toastify';
import useCompetitionStore from '../../stores/useCompetitionStore';

const MAX_BYTE_LENGTH = 2000;

const templateStylesOnSpinner = {
  width: 'auto',
};

const AlarmTalkWritingPopup = ({ 
  participantIndexMap, targetIndexSet, usePrevData,
  prevAlarmTalkWritingInfo, setPrevAlarmTalkWritingInfo, actionAlarmTalkSuccess 
}) => {
  const [applyMediaQuery, setApplyMediaQuery] = useState(false);
  const [loading, startLoading, endLoading] = useLoading(false);
  const [tempalteStyles, setTemplateStyles] = useState(null);

  const { info } = useCompetitionStore();

  
  const openPopup = usePopupStore((state) => state.open);
  const closePopup = usePopupStore((state) => state.close);
  
  const amount = 1100 + (targetIndexSet.size * 55);
  // const amount = 100;
  const adminName = useAdminStore((state) => state.name);
  const competitionId = useAdminStore((state) => state.competition_id);
  const apiKey = useAdminStore((state) => state.apiKey);
  
  const messageInputRef = useInputRef();
  const [messageLength, setMessageLength] = useState(0);
  const [activeButton, setActiveButton] = useState(messageLength <= MAX_BYTE_LENGTH);

  useEffect(() => {
    setActiveButton(messageLength <= MAX_BYTE_LENGTH);
  }, [messageLength])

  const getByteLengthEUCKR = useCallback((str) => {
    let len = 0;
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      if (charCode <= 0x7F) {
        len += 1;
      } else if (charCode <= 0x7FF) {
        len += 2;
      } else if (charCode <= 0xFFFF) {
        len += 2;
      } else {
        len += 2;
      }
    }
    return len;
  });

  const saveDataAndClose = () => {
    setPrevAlarmTalkWritingInfo({ message: messageInputRef.get(), });
    closePopup();
  }

  const requestPayAndSendAlarmTalk = useCallback(async () => {
    const message = messageInputRef.get().trim();

    if (message.length === 0) {
      toast.warn('메시지를 작성해주세요.');
      return ;
    }

    closePopup();
    
    /**
     * @see https://chai-iamport.gitbook.io/iamport/sdk/javascript-sdk/payrq 결제 요청 파라미터
     * @see https://chai-iamport.gitbook.io/iamport/sdk/javascript-sdk/payrt 결제 응답 파라미터
     */
    const requestTime = new Date();
    const IMP = window.IMP;
    IMP.init(process.env.REACT_APP_IAMPORT_USER_CODE);
    IMP.request_pay({
      pg: "html5_inicis", // PG사 코드값
      pay_method: "card", // 결제 수단
      merchant_uid: `merchant_${requestTime.getTime()}`, // 가맹점 주문번호
      // name: '알림톡', // 결제대상 제품명
      name: '문자 전송', // 결제대상 제품명
      amount, // 결제 금액
      buyer_name: adminName, // 주문자명
    }, async (response) => {
      const { success } = response;
      if (success) {
        const { imp_uid, merchant_uid, paid_amount } = response;
        // openPopup({ type: popupType.LOADING, props: { message: '알림톡 전송중' } })
        openPopup({ type: popupType.LOADING, props: { message: '문자 전송 전송중' } })
        toast.success('결제 완료');

        try {
          const response = await pushSms(competitionId, apiKey, {
            imp_uid,
            merchant_uid,
            amount: paid_amount,
            time: requestTime,
            contents: message,
            participant_index: Array.from(targetIndexSet)
          });
          toast.success('결제 기록 완료');
        } catch (error) {
          toast.error('결제 기록 실패. 관리자에게 문의해주세요.');
        } finally {
          openPopup({ type: popupType.MESSAGE, props: { message: '문자 전송 완료' } })
        }

        setPrevAlarmTalkWritingInfo({ message: '' });
        actionAlarmTalkSuccess();
      } else {
        const errorMessage = response.error_msg === '사용자가 결제를 취소하셨습니다' ? '결제를 취소하였습니다.' : response.error_msg;
        openPopup({ type: popupType.MESSAGE, props: { message: errorMessage } });
      }
    });
  }, [amount, adminName]);

  useEffect(() => {
    if (usePrevData) {
      messageInputRef.set(prevAlarmTalkWritingInfo.message);
    }
  }, []);

  useEffect(() => {
    setApplyMediaQuery(!loading);
    setTemplateStyles(loading ? templateStylesOnSpinner : null);
  }, [loading]);

  return (
    <PopupTemplate styles={tempalteStyles} applyMediaQuery={applyMediaQuery}>
      {
        loading ? (
          <Spinner/>
        ) : (
          <React.Fragment>
            <PopupHead />
            <PopupBody>
              <Form>
                <Textarea
                  ref={messageInputRef.reference}
                  name='place'
                  id='place'
                  type='text'
                  placeholder='메시지를 작성해 주세요.'
                  autoComplete='off'
                  minRows={10}
                  maxRows={10}
                  onChange={e => {
                    const bytes = getByteLengthEUCKR(e.target.value);
                    if (bytes > MAX_BYTE_LENGTH) {
                      toast.warn('2000 Byte를 초과할 수 없습니다.')
                    }
                    setMessageLength(bytes);
                  }}
                />
                <TextLength>글자 수 실시간 반영 ({messageLength}/{MAX_BYTE_LENGTH} Byte)</TextLength>
              </Form>
              <PaymentInfo>
                <li>
                  발송 인원: {targetIndexSet.size}명
                </li>
                <li>
                  결제 금액: {amount.toLocaleString()}원
                </li>
                <li>
                  기본 요금 1,100원 + 1건당 55원 (부가세 포함)
                </li>
              </PaymentInfo>
            </PopupBody>
            <PopupFooter>
              <Button active={activeButton} onClick={requestPayAndSendAlarmTalk} name='결제 및 전송' />
              <Button onClick={saveDataAndClose} name='닫기' />
            </PopupFooter>
          </React.Fragment>
        )
      }
    </PopupTemplate>
  );
};

const TextLength = styled.p`
  font-size: 0.9rem;
  font-weight: 300;
  text-align: right;
  margin-left: 0.2rem;
  margin-top: 0.2rem;
  color: ${color.stoneGrey};
`

const PaymentInfo = styled.ul`
  list-style: disc;
  text-align: left;
  margin-left: 1.2rem;
  padding: 0.5rem 0;
  font-size: 1rem;
  color: ${color.stoneGrey};
  li {
    list-style: disc;
    margin-bottom: 0.5rem;
  }
`

const Textarea = styled(TextareaAutosize)`
  outline: none;
  resize: none;
  overflow: auto;
  color: ${color.dark};
  font-weight: ${font.weight.regular};
  letter-spacing: 0.05rem;
  font-size: 0.9rem;
  font-family: inherit;
  border: 1px solid ${color.grey};
  border-radius: 5px;
  padding: 0.5rem;
  &::placeholder { 
    color: ${color.placeholder};
  }
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const InputWrapper = styled.div`
  display: flex;
  margin-bottom: 1rem;
  label {
    flex: 1 1 15%;
    font-size: 1.1rem;
    margin-right: 6px;
    padding: 0.5rem 0;
    text-align: left;
  }
  input {
    flex: 1 1 85%;
    font-size: 1rem;
    border: none;
    outline: none;
    border-bottom: 1px solid black;
    padding: 0.5rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

export default AlarmTalkWritingPopup;