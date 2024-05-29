
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
      path: 'app/users/:status/:isHead/:isDisciple/*',
      element: <Users />,
      auth: ["Super","Admin"]
    },


    {
      path: 'app/useredit/:id/*',
      element: <UserForm />,
      auth: ["Super","User","Member","Admin"]
    }

  ],
};

export default UserConfig;