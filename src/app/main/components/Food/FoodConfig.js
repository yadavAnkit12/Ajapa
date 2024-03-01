import Food from "./Food";

const FoodConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'app/food/',
      element: <Food/>,
      auth: ["Super"]
    },
    // {
    //   path: 'app/eventRegisteration/:eventId/*',
    //   element: <EventForm />,
    //   auth: ["Super", "User"]
    // }
  ],
};

export default FoodConfig;