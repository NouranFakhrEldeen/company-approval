import { AuthenticationServiceFactory, BaseService } from '.';

export const RoundReportsServiceFactory = (function () {
  let instance;
  function createInstance() {
    return new RoundReportsService();
  }
  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

class RoundReportsService extends BaseService{
  serviceRoute;
  authenticationService = AuthenticationServiceFactory.getInstance();

  constructor() {
    super();
    this.serviceRoute = 'round-reports';
    this.configuration = {
      responseType: 'blob',
      headers: {
        'Authorization': `Bearer ${this.authenticationService.getToken()}`,
      },
    };
    this.baseRoute = `${process.env.AUDIT_REACT_APP_API_URL}${process.env.AUDIT_BASE_ROUTE}`;

  }
}

