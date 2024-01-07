
import DoctorProfile from '../Profiles/DoctorProfile/DoctorProfile';

import Doctor from './Doctor';

import DoctorForm from './DoctorForm/DoctorForm';

const DoctorManagementConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/app/doctor',
      element: <Doctor />,
      auth: ["admin", "employee"]
    },
    {
      path: 'app/manage/doctor/:doctorId/*',
      element: <DoctorForm />,
      auth: ["admin", "employee"]
    },
    {
      path: 'app/manage/doctor/view/:doctorId/*',
      element: <DoctorProfile />,
      auth: ["admin", "employee"]
    }
  ],
};

export default DoctorManagementConfig;