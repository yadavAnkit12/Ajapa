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
      auth: ["Super","Admin"]
    },
  ],
};

export default AllEventRegistrationConfig;