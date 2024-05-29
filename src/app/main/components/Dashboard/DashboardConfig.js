import Dashboard from "./Dashboard";


const DashboardConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'app/dashboard/',
      element: <Dashboard />,
      auth: ["Super","Admin"]
    },


    // {
    //   path: 'app/patient/profile/:patientId/*',
    //   element: <PatientProfile />,
    //   auth: ["admin", "employee","clinic","doctor"]
    // }
    // {
    //     path: 'app/vehicleView',
    //     element: <VehicleView/>,
    //     auth: ["admin", "employee"]
    //   }

  ],
};

export default DashboardConfig;