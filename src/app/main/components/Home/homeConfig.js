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
      auth: ["Super"]
    },
    {
      path: '/ashrams',
      element: <Ashrams />,
      auth: ["Super"]
    },
    {
      path: '/utsavs',
      element: <Utsavs />,
      auth: ["Super"]
    },
    {
      path: '/contactus',
      element: <ContactUs />,
      auth: ["Super"]
    }
  ],
};

export default HomeConfig;