
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
      path: 'app/users/:disp/:status/*',
      element: <Users />,
      auth: ["Super"]
    },


    {
      path: 'app/useredit/:id/*',
      element: <UserForm />,
      auth: ["Super","User","Member"]
    }
    // {
    //     path: 'app/vehicleView',
    //     element: <VehicleView/>,
    //     auth: ["admin", "employee"]
    //   }

  ],
};

export default UserConfig;