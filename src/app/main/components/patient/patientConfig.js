import { lazy } from 'react';

const PatientProfile = lazy(() => import('../Profiles/PatientProfile/PatientProfile'));

import Patient from './Patient';
const PatientConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'app/patient/',
      element: <Patient />,
      auth: ["admin", "employee","clinic","doctor"]
    },


    {
      path: 'app/patient/profile/:patientId/*',
      element: <PatientProfile />,
      auth: ["admin", "employee","clinic","doctor"]
    }
  ],
};

export default PatientConfig;