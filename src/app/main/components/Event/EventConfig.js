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
      auth: ["Super"]
    },


    {
      path: 'app/eventRegisteration/:eventId/*',
      element: <EventForm />,
      auth: ["Super", "User"]
    }
    // {
    //     path: 'app/vehicleView',
    //     element: <VehicleView/>,
    //     auth: ["admin", "employee"]
    //   }

  ],
};

export default EventConfig;