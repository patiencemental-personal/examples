import React from 'react';
import { useOutletContext } from 'react-router-dom';
import BaseContentBlock from './BaseContentBlock';
import ChatBlock from './chat/ChatBlock';
import routePathMap from '../../route/path';

const ScrumBlock = () => {
  const { compeInfo } = useOutletContext();
  return (
    <BaseContentBlock>
    {
      compeInfo && <ChatBlock selectedMenu={routePathMap.COMPETITION.CHILD.SCRUM} index={compeInfo[0].competition_index} />
    }
    </BaseContentBlock>
  );
};

export default ScrumBlock;