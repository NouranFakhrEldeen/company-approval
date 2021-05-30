import { AuthenticationServiceFactory, BaseService } from './';
export const ConfrimSegmentServiceFactory = (function () {
  let instance;
  function createInstance() {
    return new ConfrimSegmentService();
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
class ConfrimSegmentService extends BaseService {
  serviceRoute;
  authenticationService = AuthenticationServiceFactory.getInstance();
  constructor() {
    super();
    this.serviceRoute = 'confirm-set/{confirmSetId}/segment';
    this.configuration = {
      headers: {
        'Authorization': `Bearer ${this.authenticationService.getToken()}`,
      },
    };
  }
}