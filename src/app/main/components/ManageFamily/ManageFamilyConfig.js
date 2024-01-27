
import ManageFamily from "./ManageFamily";



const ManageFamilyConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/app/manageFamily/',
      element: <ManageFamily/>,
      auth: ["User"]
    },


    // {
    //   path: 'app/useredit/:id/*',
    //   element: <UserForm />,
    //   auth: ["Super"]
    // }
 

  ],
};

export default ManageFamilyConfig;