import Event from "./Event";
import EventForm from "./EventForm/EventForm";


const EventConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'app/event/:eventStatus/:bookingStatus/*',
      element: <Event />,
      auth: ["Super","Admin"]
    },


    {
      path: 'app/eventRegisteration/:eventId/*',
      element: <EventForm />,
      auth: ["Super", "User","Admin"]
    }
    // {
    //     path: 'app/vehicleView',
    //     element: <VehicleView/>,
    //     auth: ["admin", "employee"]
    //   }

  ],
};

export default EventConfig;