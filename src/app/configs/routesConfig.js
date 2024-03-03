import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';

import { Navigate } from 'react-router-dom';

import settingsConfig from 'app/configs/settingsConfig';

import Error404PageConfig from '../main/404/Error404Config';
import Error404Page from '../main/404/Error404Page';
import SignInConfig from '../main/sign-in/SignInConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import SignUpConfig from '../main/sign-up/SignUpConfig';
import Home from '../main/components/Home/Home';
import HomeConfig from '../main/components/Home/homeConfig';
import AdminProfile from '../main/components/Profiles/Admin/AdminProfile';
import DashboardConfig from '../main/components/Dashboard/DashboardConfig';
import EventConfig from '../main/components/Event/EventConfig';
import UserConfig from '../main/components/Users/UserConfig';
import UserEventConfig from '../main/components/UserEvents/UserEventConfig';
import AddMembersConfig from '../main/components/AddMembers/AddMembersConfig';
import ManageFamilyConfig from '../main/components/ManageFamily/ManageFamilyConfig';
import MyRegisterationConfig from '../main/components/MyRegistration/MyRegistrationConfig';
import AllEventRegistrationConfig from '../main/components/AllEventRegistration/AllEventRegistrationConfig';
import AttendanceConfig from '../main/components/Attendance/AttendanceConfig';
import SMSConfig from '../main/components/SMS/SMSConfig';
import FoodConfig from '../main/components/Food/FoodConfig';
import FoodDetailsConfig from '../main/components/FoodDetails/FoodDetailsConfig';
import Report1Config from '../main/components/Report/Report1/Report1Config';
import Repor2Config from '../main/components/Report/Report2/Report2Config';
import Report3Config from '../main/components/Report/Report3/Report3Config';


const routeConfigs = [SignOutConfig, SignInConfig,MyRegisterationConfig, AllEventRegistrationConfig, SignUpConfig, Error404PageConfig, Report1Config,Repor2Config,Report3Config,AttendanceConfig,DashboardConfig,UserConfig,EventConfig, AddMembersConfig,UserEventConfig,ManageFamilyConfig,FoodConfig,FoodDetailsConfig,SMSConfig, HomeConfig];


const routes = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
  {
    path: '/',
    element: <Navigate to="/" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: '/apps/profile/:userId',
    element: <AdminProfile />
  },
  {
    path: 'loading',
    element: <FuseLoading />,
  },
  {
    path: '404',
    element: <Error404Page />,
  },
  {
    path: '*',
    element: <Navigate to="404" />,
  },
  {
    path: 'home',
    element: <Home />,
  },

];

export default routes;
