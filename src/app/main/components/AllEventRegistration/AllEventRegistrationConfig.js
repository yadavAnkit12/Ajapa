import AllEventRegistration from "./AllEventRegistraion";


const AllEventRegistrationConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'app/allRegistrationDetails/',
      element: <AllEventRegistration/>,
      auth: ["Super"]
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

export default AllEventRegistrationConfig;