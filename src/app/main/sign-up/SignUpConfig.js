import SignUpPage from './SignUpPage';
import authRoles from '../../auth/authRoles';
import Confirmation from './Confirmation';

const SignUpConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: 'sign-up',
      element: <SignUpPage />,
    },
    {
      path: 'confirmation',
      element: <Confirmation />,
    },
  ],
};

export default SignUpConfig;
