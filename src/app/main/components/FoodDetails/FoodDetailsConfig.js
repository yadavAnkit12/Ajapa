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
      auth: ["Super","Admin"]
    },


    // {
    //   path: 'app/useredit/:id/*',
    //   element: <UserForm />,
    //   auth: ["Super"]
    // }
 

  ],
};

export default FoodDetailsConfig;