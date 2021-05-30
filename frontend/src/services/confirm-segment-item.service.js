import { AuthenticationServiceFactory, BaseService } from './';
export const ConfrimSegmentItemServiceFactory = (function () {
  let instance;
  function createInstance() {
    return new ConfrimSegmentItemService();
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
class ConfrimSegmentItemService extends BaseService {
  serviceRoute;
  authenticationService = AuthenticationServiceFactory.getInstance();
  constructor() {
    super();
    this.serviceRoute = 'confirm-set/{confirmSetId}/segment/{segmentId}/item';
    this.configuration = {
      headers: {
        'Authorization': `Bearer ${this.authenticationService.getToken()}`,
      },
    };
  }
}