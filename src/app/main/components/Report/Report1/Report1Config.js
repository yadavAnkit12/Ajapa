import Report1 from "./Report1";


const Report1Config = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'app/report1/',
      element: <Report1/>,
      auth: ["Super"]
    },
  ],
};

export default Report1Config;