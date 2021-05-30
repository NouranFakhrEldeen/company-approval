// add json modes here


const DEFAULT = {};

const configObj = {
};
const config = configObj[process.env.MODE] || DEFAULT;

class ToggleRouter {
  constructor(initConfig) {
    this.config = initConfig;
  }
  config = {};
  setFeature(featureName, isEnabled) {
    this.config[featureName] = isEnabled;
  }
  setManyFeatures(features) {
    this.config = { ...this.config, ...features };
  }
  featureIsEnabled(featureName) {
    return this.config[featureName];
  }
}

const toggleRouter = ((initConfig) => {
  let instance: ToggleRouter;
  function createInstance() {
    return new ToggleRouter(initConfig);
  }
  if (!instance) {
    instance = createInstance();
  }
  return instance;
})(config);

export  {toggleRouter};
