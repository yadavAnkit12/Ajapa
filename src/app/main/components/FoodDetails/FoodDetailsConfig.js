import FoodDetails from "./FoodDetails";




const FoodDetailsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'app/foodDetails/',
      element: <FoodDetails/>,
      auth: ["Super"]
    },


    // {
    //   path: 'app/useredit/:id/*',
    //   element: <UserForm />,
    //   auth: ["Super"]
    // }
 

  ],
};

export default FoodDetailsConfig;