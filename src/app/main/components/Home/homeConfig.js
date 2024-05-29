import Ashrams from './Ashrams';
import ContactUs from './ContactUs';
import Gurus from './Gurus';
import Home from './Home';
import Utsavs from './Utsavs';

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
      auth: ["Super", "User","Member","Admin"]
    },
    {
      path: '/gurus',
      element: <Gurus />,
      auth: ["Super", "User","Member","Admin"]
    },
    {
      path: '/ashrams',
      element: <Ashrams />,
      auth: ["Super", "User","Member","Admin"]
    },
    {
      path: '/utsavs',
      element: <Utsavs />,
      auth: ["Super", "User","Member","Admin"]
    },
    {
      path: '/contactus',
      element: <ContactUs />,
      auth: ["Super", "User","Member","Admin"]
    }
  ],
};

export default HomeConfig;