import { AuthenticationServiceFactory, BaseService } from './';
export const ConfrimContactServiceFactory = (function () {
  let instance;
  function createInstance() {
    return new ConfrimContactService();
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
class ConfrimContactService extends BaseService {
  serviceRoute;
  authenticationService = AuthenticationServiceFactory.getInstance();
  constructor() {
    super();
    this.serviceRoute = 'confirm-set/{confirmSetId}/contact';
    this.configuration = {
      headers: {
        'Authorization': `Bearer ${this.authenticationService.getToken()}`,
      },
    };
  }
}