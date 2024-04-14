import EventLevelPermission from "./EventLevelPermission";


const EventLevelPermissionConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'app/eventLevelPermission/',
      element: <EventLevelPermission/>,
      auth: ["Super"]
    },
  ],
};

export default EventLevelPermissionConfig;