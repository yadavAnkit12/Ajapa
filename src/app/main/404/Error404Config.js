
import Error404Page from './Error404Page';

const Error404PageConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '404',
      element: <Error404Page />,
      auth: ["Super", "User"]
    },
  ],
};

export default Error404PageConfig;