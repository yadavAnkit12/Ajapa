import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';

import { Navigate } from 'react-router-dom';

import settingsConfig from 'app/configs/settingsConfig';

import Error404PageConfig from '../main/404/Error404Config';
import Error404Page from '../main/404/Error404Page';
import SignInConfig from '../main/sign-in/SignInConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import SignUpConfig from '../main/sign-up/SignUpConfig';
import BannerPlanConfig from '../main/components/Banner/BannerPlanConfig';
import CouponPlanConfig from '../main/components/Coupon/CouponPlanConfig';
import DoctorManagementConfig from '../main/components/DoctorsManagement/DoctorManagementConfig';
import EmployeeManagementConfig from '../main/components/EmployeeManagement/EmployeeManagementConfig';
import Home from '../main/components/Home/Home';
import HomeConfig from '../main/components/Home/homeConfig';
import MembershipPlanConfig from '../main/components/MembershipManagement/MembershipPlanConfig';
// import PartnerManagementConfig from '../main/components/PartnersManagement/ClinicManagementConfig';
import ProductConfig from '../main/components/Product/ProductConfig';
import SymptomConfig from '../main/components/Symptom/SymptomConfig';
import AppointmentsAppConfig from '../main/components/appointments/AppointmentsAppConfig';
import PatientConfig from '../main/components/patient/patientConfig';
import SubscriptionPlanConfig from '../main/components/subscription/SubscriptionPlanConfig';
import transactionConfig from '../main/components/transaction/transactionConfig';
import OrderConfig from '../main/components/Order/OrderConfig';
import LabOrderConfig from '../main/components/LabOrder/LabOrderConfig'
import AdminProfile from '../main/components/Profiles/Admin/AdminProfile';
import SettingConfig from '../main/components/Setting/SettingConfig';
import NewCaseConfig from '../main/components/CaseReportManagement/NewCaseConfig';
import CaseConfig from '../main/components/LabPartnerService/CaseConfig';
import AllCaseConfig from '../main/components/CaseReportManagement/AllCaseConfig';
import FinalCaseReportConfig from '../main/components/CaseReportManagement/FinalCaseReportConfig';
import ClinicManagementConfig from '../main/components/PartnersManagement/ClinicManagementConfig';
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
import FoodDetailsConfig from '../main/components/FoodDetails/FoodDetailsConfig';



const routeConfigs = [SignOutConfig, SignInConfig,MyRegisterationConfig, AllEventRegistrationConfig, SignUpConfig, Error404PageConfig,AttendanceConfig , DashboardConfig,UserConfig,EventConfig,EmployeeManagementConfig, AddMembersConfig,UserEventConfig,ManageFamilyConfig,DoctorManagementConfig, PatientConfig, FoodDetailsConfig,AppointmentsAppConfig,SMSConfig, HomeConfig, MembershipPlanConfig, transactionConfig, SubscriptionPlanConfig, CouponPlanConfig, BannerPlanConfig, CaseConfig, SymptomConfig, ProductConfig, OrderConfig, LabOrderConfig,SettingConfig,NewCaseConfig,AllCaseConfig,FinalCaseReportConfig,ClinicManagementConfig];

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
