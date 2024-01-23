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
            auth: ["Super","User"]
        }
    ],
};

export default UserEventConfig;