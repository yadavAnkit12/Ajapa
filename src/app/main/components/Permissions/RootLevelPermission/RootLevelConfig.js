import RootLevel from "./RootLevel";


const RootLevelConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'app/rootLevelPermission/',
      element: <RootLevel/>,
      auth: ["Super"]
    },
  ],
};

export default RootLevelConfig;