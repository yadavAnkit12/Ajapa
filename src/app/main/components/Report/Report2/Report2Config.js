import Report2 from "./Report2";


const Report2Config = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'app/report2/',
      element: <Report2/>,
      auth: ["Super","Admin"]
    },
  ],
};

export default Report2Config;