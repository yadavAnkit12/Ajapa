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
        }
    ],
};

export default UserEventConfig;