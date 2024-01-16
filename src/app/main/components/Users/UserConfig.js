
import Users from "./Users";


const UserConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'app/users/',
      element: <Users />,
      auth: ["Super"]
    },


    // {
    //   path: 'app/eventRegisteration/:eventId/*',
    //   element: <EventForm />,
    //   auth: ["Super", "User"]
    // }
    // {
    //     path: 'app/vehicleView',
    //     element: <VehicleView/>,
    //     auth: ["admin", "employee"]
    //   }

  ],
};

export default UserConfig;