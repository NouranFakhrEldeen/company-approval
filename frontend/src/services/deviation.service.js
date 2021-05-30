import { AuthenticationServiceFactory, BaseService } from './';
// import { Deviation } from '../mocks/index';
export const DeviationServiceFactory = (function () {
  let instance;
  function createInstance() {
    return new DeviationService();
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
class DeviationService extends BaseService {
  serviceRoute;
  authenticationService = AuthenticationServiceFactory.getInstance();
  constructor() {
    super();
    this.serviceRoute = 'confirm-set/{confirmSetId}/deviation';
    this.configuration = {
      headers: {
        'Authorization': `Bearer ${this.authenticationService.getToken()}`,
      },
    };
  }
// filter = () => {
//   return {
//     data: {
//       records: Deviation,
//       pagination: {
//         total: 97,
//       },
//     },
//   };
// }
}
// mocks
// eslint-disable-next-line class-methods-use-this


