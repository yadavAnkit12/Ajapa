

import ClinicProfile from '../Profiles/PartnerProfile/ClinicProfile';
import Clinic from './Clinic';
import ClinicForm from './PartnerForm/ClinicForm';


const ClinicManagementConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/app/clinic',
      element: <Clinic />,
      auth: ["admin", "employee"]
    },
    {
      path: 'app/manage/partner/:partnerId/*',
      element: <ClinicForm />,
      auth: ["admin", "employee"]
    },

    {
      path: 'app/manage/partner/view/:partnerId/*',
      element: <ClinicProfile />,
      auth: ["admin", "employee"]
    }
  ],
};

export default ClinicManagementConfig;