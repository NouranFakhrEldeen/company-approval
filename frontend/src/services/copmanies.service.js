import { AuthenticationServiceFactory, BaseService } from './';


export const CompaniesServiceFactory = (function () {
  let instance;
  function createInstance() {
    return new CompaniesService();
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
class CompaniesService extends BaseService {
  serviceRoute;
  authenticationService = AuthenticationServiceFactory.getInstance();
  constructor() {
    super();
    this.serviceRoute = 'Company';
    this.configuration = {
      headers: {
        'Authorization': `Bearer ${this.authenticationService.getToken()}`,
      },
    };
  }
}