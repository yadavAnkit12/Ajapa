import Blog from "./Blog";


const BlogConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'app/blog/',
      element: <Blog />,
      auth: ["Super","Admin"]
    },
    // {
    //   path: 'app/eventRegisteration/:eventId/*',
    //   element: <EventForm />,
    //   auth: ["Super", "User"]
    // }
  ],
};

export default BlogConfig;