const routePathMap = {
  INDEX: '/',
  HOME: { INDEX: 'home', },
  COMPETITION: {
    INDEX: 'competition',
    CHILD: {
      INFO: 'info',
      NOTICE: 'notice',
      HELP: 'help',
      JOB: 'job',
      SCRUM: 'scrum',
      PARTICIPANTS: 'participants',
      SCHEDULE: 'schedule',
      MESSAGE: 'message',
    },
  },
  COMPETITION_CREATION: { INDEX: '/competition-creation', },
  COMPETITION_UPDATION: { INDEX: '/competition-updation', },
  ADMIN_LOGIN: { INDEX: '/admin-login', },
  USER_APPLY: { INDEX: '/user-apply', },
  USER_GUIDE: { INDEX: '/user-guide', },
  TERMS: { INDEX: '/terms' },
  MASTER_BANNER_MANAGEMENT: { INDEX: '/master-banner-management'},
  MASTER_COMPETITION_DELETION: { INDEX: '/master-competition-deletion' },
  MASTER_LOGIN: { INDEX: '/master-login' },
};

export default routePathMap;