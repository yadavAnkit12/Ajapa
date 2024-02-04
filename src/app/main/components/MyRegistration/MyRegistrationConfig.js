



const ManageFamilyConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/app/myregisteration/',
      element: <></>,
      auth: ["User","Member"]
    },


    // {
    //   path: 'app/useredit/:id/*',
    //   element: <UserForm />,
    //   auth: ["Super"]
    // }
 

  ],
};

export default ManageFamilyConfig;