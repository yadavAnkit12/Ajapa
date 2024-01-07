const EmployeeProfile = lazy(() => import('../Profiles/EmployeeProfile/EmployeeProfile'));
const Employee = lazy(() => import('./Employee'));
import { lazy } from 'react';

const EmployeeManagementConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'app/user/',
      element: <Employee />,
      auth: ["admin", "employee"]
    },
    {
      path: 'app/manage/user/view/:employeeId/*',
      element: <EmployeeProfile />,
      auth: ["admin", "employee"]
    }
  ],
};

export default EmployeeManagementConfig;

