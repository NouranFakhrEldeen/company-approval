import { AuthenticationServiceFactory, BaseService } from './';


export const SegmentServiceFactory = (function () {
  let instance;
  function createInstance() {
    return new SegmentService();
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
class SegmentService extends BaseService {
  serviceRoute;
  authenticationService = AuthenticationServiceFactory.getInstance();
  constructor() {
    super();
    this.serviceRoute = 'segment';
    this.configuration = {
      headers: {
        'Authorization': `Bearer ${this.authenticationService.getToken()}`,
      },
    };
  }
}