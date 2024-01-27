import Home from './Home';

const HomeConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/',
      element: <Home />,
      auth: ["Super", "User","Member"]
    }
  ],
};

export default HomeConfig;