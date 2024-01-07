import SignInPage from './SignInPage';
import authRoles from '../../auth/authRoles';
import ResetPassword from './ResetPassword';

const SignInConfig = {
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
      path: 'sign-in',
      element: <SignInPage />,
    },
    {
      path:'resetpassword',
      element:<ResetPassword/>
    }
  ],
};

export default SignInConfig;
