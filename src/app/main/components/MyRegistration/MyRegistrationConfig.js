import MyRegistration from "./MyRegistration";




const MyRegisterationConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'app/myregistration/',
      element: <MyRegistration />,
      auth: ["User","Member"]
    },


    // {
    //   path: 'app/useredit/:id/*',
    //   element: <UserForm />,
    //   auth: ["Super"]
    // }
 

  ],
};

export default MyRegisterationConfig;