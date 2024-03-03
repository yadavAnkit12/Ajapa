import Report3 from "./Report3";


const Report3Config = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'app/report3/',
      element: <Report3/>,
      auth: ["Super"]
    },
  ],
};

export default Report3Config;