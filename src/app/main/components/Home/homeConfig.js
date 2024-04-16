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
      auth: ["Super", "User","Member"]
    },
    {
      path: '/gurus',
      element: <Gurus />,
      auth: ["Super", "User","Member"]
    },
    {
      path: '/ashrams',
      element: <Ashrams />,
      auth: ["Super", "User","Member"]
    },
    {
      path: '/utsavs',
      element: <Utsavs />,
      auth: ["Super", "User","Member"]
    },
    {
      path: '/contactus',
      element: <ContactUs />,
      auth: ["Super", "User","Member"]
    }
  ],
};

export default HomeConfig;