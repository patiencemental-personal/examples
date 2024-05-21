import React from 'react';
import BaseContentBlock from './BaseContentBlock';
import ChatBlock from './chat/ChatBlock';
import { useOutletContext } from 'react-router-dom';
import routePathMap from '../../route/path';

const JobBlock = () => {
  const { compeInfo } = useOutletContext();
  return (
    <BaseContentBlock>
    {
      compeInfo &&  <ChatBlock selectedMenu={routePathMap.COMPETITION.CHILD.JOB} index={compeInfo[0].competition_index} />
    }
    </BaseContentBlock>
  );
};

export default JobBlock;