import EventRegisterForm from "./EventRegisterForm/EventRegisterForm";
import UserEvent from "./UserEvent";

const UserEventConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: 'app/UserEvents',
            element: <UserEvent/>,
            auth: ["User","Member"]
        },
        {
            path: 'app/UserEventsRegisteration/:eventId/:userId/:eventDate/:eventName/*',
            element: <EventRegisterForm/>,
            auth: ["User","Member"]
        }
    ],
};

export default UserEventConfig;