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
      auth: ["Super","Admin"]
    },
    // {
    //   path: 'app/eventRegisteration/:eventId/*',
    //   element: <EventForm />,
    //   auth: ["Super", "User"]
    // }
  ],
};

export default FoodConfig;