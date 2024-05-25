import React from 'react';
import popupType from '../../lib/popupType';
import { usePopupStore } from '../../stores/usePopupStore';
import AdminLoginPopup from './AdminLoginPopup';
import MessagePopup from './MessagePopup';
import ParticipantDetailPopup from './ParticipantDetailPopup';
import LoadingPopup from './LoadingPopup';
import FullScreenPopup from './FullScreenPopup';
import EmailAuthPopup from './EmailAuthPopup';
import AdminPasswordChangePopup from './AdminPasswordChangePopup';
import AdminPasswordFindPopup from './AdminPasswordFindPopup';
import MasterLoginPopup from './MasterLoginPopup';
import QrCodePopup from './QrCodePopup';
import AlarmTalkWritingPopup from './AlarmTalkWritingPopup';

const GlobalPopup = () => {
  const {visible, config} = usePopupStore();
  const type = config?.type;
  const props = config?.props;

  // @todo
  // https://stackoverflow.com/questions/4770025/how-to-disable-scrolling-temporarily

  if (!visible) return ;
  else if (type === popupType.MESSAGE) {
    const { message, styles, buttons }= props;
    return (
      <MessagePopup 
        message={message}
        styles={styles}
        buttons={buttons}
      />
    );
  } else if (type === popupType.ADMIN_LOGIN) {
    return <AdminLoginPopup />;
  } else if (type === popupType.PARTICIPANT_DETAIL) {
    const { participant, isTeamFight, etcValue } = props;
    return <ParticipantDetailPopup participant={participant} isTeamFight={isTeamFight} etcValue={etcValue} />;
  } else if (type === popupType.LOADING) {
    const message = props?.message;
    return <LoadingPopup message={message} />
  } else if (type === popupType.FULL_SCREEN) {
    return <FullScreenPopup />
  } else if (type === popupType.EMAIL_AUTH) {
    const { email, onCompleteEmailChange } = props;
    return <EmailAuthPopup email={email} onCompleteEmailChange={onCompleteEmailChange} />
  } else if (type === popupType.ADMIN_PASSWORD_CHANGE) {
    const { competitionId, email } = props;
    return <AdminPasswordChangePopup competitionId={competitionId} email={email} />
  } else if (type === popupType.ADMIN_PASSWORD_FIND) {
    return <AdminPasswordFindPopup />
  } else if (type === popupType.MASTER_LOGIN) {
    return <MasterLoginPopup />
  } else if (type === popupType.QRCODE) {
    const { qrValue, title } = props;
    return <QrCodePopup qrValue={qrValue} title={title} />
  } else if (type === popupType.ALARM_TALK_WRITING) {
    const { 
      participantIndexMap, targetIndexSet, usePrevData, prevAlarmTalkWritingInfo,
      setPrevAlarmTalkWritingInfo, actionAlarmTalkSuccess
    } = props;
    return <AlarmTalkWritingPopup
      participantIndexMap={participantIndexMap} 
      targetIndexSet={targetIndexSet}
      usePrevData={usePrevData}
      prevAlarmTalkWritingInfo={prevAlarmTalkWritingInfo}
      setPrevAlarmTalkWritingInfo={setPrevAlarmTalkWritingInfo}
      actionAlarmTalkSuccess={actionAlarmTalkSuccess}
    />
  }
};

export default GlobalPopup;