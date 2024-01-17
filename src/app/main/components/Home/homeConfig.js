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
      auth: ["Super", "User"]
    }
  ],
};

export default HomeConfig;