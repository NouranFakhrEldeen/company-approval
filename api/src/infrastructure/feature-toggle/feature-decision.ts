import { toggleRouter } from './toggle-router';

class FeatureDecision {
  getConfigurations() {
    return toggleRouter.config;
  }
}

const featureDecision = (() => {
  let instance: FeatureDecision;
  function createInstance() {
    return new FeatureDecision();
  }
  if (!instance) {
    instance = createInstance();
  }
  return instance;
})();

export { featureDecision };
