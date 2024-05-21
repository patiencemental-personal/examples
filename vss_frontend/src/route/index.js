import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import routePathMap from './path';
import Root from '../Root';
import {
  HomePage, CompetitionPage, UserGuidePage,
  AdminLoginPage, UserApplyPage,
  CompetitionCreationOrUpdationPage
} from './../pages/index';
import {
  HelpBlock, InfoBlock, 
  JobBlock, MessageBlock, 
  NoticeBlock, ParticipantsBlock, 
  ScheduleBlock, ScrumBlock,
} from './../components/competition/index';
import BannerManagementPage from '../pages/BannerManagementPage';
import MasterLoginPage from '../pages/MasterLoginPage';
import MasterCompetitionDeletionPage from '../pages/MasterCompetitionDeletionPage';
import TermsPage from '../pages/TermsPage';

const {
  INDEX,
  HOME,
  COMPETITION,
  COMPETITION_CREATION,
  COMPETITION_UPDATION,
  ADMIN_LOGIN,
  USER_APPLY,
  USER_GUIDE,
  TERMS,
  MASTER_BANNER_MANAGEMENT,
  MASTER_COMPETITION_DELETION,
  MASTER_LOGIN,
} = routePathMap;

const router = createBrowserRouter([
  {
    path: INDEX,
    element: <Root />,
    children: [
      {
        path: HOME.INDEX,
        element: <HomePage />,
      },
      {
        path: COMPETITION.INDEX,
        element: <CompetitionPage />,
        children: [
          {
            path: COMPETITION.CHILD.INFO,
            element: <InfoBlock />
          },
          {
            path: COMPETITION.CHILD.NOTICE,
            element: <NoticeBlock />
          },
          {
            path: COMPETITION.CHILD.HELP,
            element: <HelpBlock />
          },
          {
            path: COMPETITION.CHILD.JOB,
            element: <JobBlock />
          },
          {
            path: COMPETITION.CHILD.SCRUM,
            element: <ScrumBlock />
          },
          {
            path: COMPETITION.CHILD.PARTICIPANTS,
            element: <ParticipantsBlock />
          },
          {
            path: COMPETITION.CHILD.SCHEDULE,
            element: <ScheduleBlock />
          },
          {
            path: COMPETITION.CHILD.MESSAGE,
            element: <MessageBlock />
          },
        ],
      },
      {
        path: COMPETITION_CREATION.INDEX,
        element: <CompetitionCreationOrUpdationPage />
      },
      {
        path: COMPETITION_UPDATION.INDEX,
        element: <CompetitionCreationOrUpdationPage />
      },
      {
        path: ADMIN_LOGIN.INDEX,
        element: <AdminLoginPage />
      },
      {
        path: USER_APPLY.INDEX,
        element: <UserApplyPage />
      },
      {
        path: USER_GUIDE.INDEX,
        element: <UserGuidePage />
      },
      {
        path: TERMS.INDEX,
        element: <TermsPage />
      },
      {
        path: MASTER_BANNER_MANAGEMENT.INDEX,
        element: <BannerManagementPage />
      },
      {
        path: MASTER_COMPETITION_DELETION.INDEX,
        element: <MasterCompetitionDeletionPage />
      },
      {
        path: MASTER_LOGIN.INDEX,
        element: <MasterLoginPage />
      },
    ]
  }

]);

export default router;