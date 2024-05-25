import React from 'react';
import BaseContentBlock from './BaseContentBlock';
import ChatBlock from './chat/ChatBlock';
import routePathMap from '../../route/path';
import { useOutletContext } from 'react-router-dom';

const NoticeBlock = () => {
  const { compeInfo } = useOutletContext();
  
  return (
    <BaseContentBlock>
    {
      compeInfo && <ChatBlock selectedMenu={routePathMap.COMPETITION.CHILD.NOTICE} index={compeInfo[0].competition_index} />
    }
    </BaseContentBlock>
  );
};

export default NoticeBlock;