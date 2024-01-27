
import UserForm from "./UserForm/UserForm";
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


    {
      path: 'app/useredit/:id/*',
      element: <UserForm />,
      auth: ["Super","User"]
    }
    // {
    //     path: 'app/vehicleView',
    //     element: <VehicleView/>,
    //     auth: ["admin", "employee"]
    //   }

  ],
};

export default UserConfig;