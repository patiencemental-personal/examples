import React from 'react';
import { useOutletContext } from 'react-router-dom';
// import styled from 'styled-components';
import BaseContentBlock from './BaseContentBlock';
import ChatBlock from './chat/ChatBlock';
import routePathMap from '../../route/path';

const HelpBlock = ({children}) => {
  const { compeInfo } = useOutletContext();

  return (
    <BaseContentBlock>
    {
      compeInfo && <ChatBlock selectedMenu={routePathMap.COMPETITION.CHILD.HELP} index={compeInfo[0].competition_index} />
    }
    </BaseContentBlock>
  );
};

export default HelpBlock;