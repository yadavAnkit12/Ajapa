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
      auth: ["Super", "employee", "clinic","doctor"]
    }
  ],
};

export default HomeConfig;