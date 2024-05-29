
import SMS from "./SMS"

const SMSConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: '/sms/',
            element: <SMS />,
            auth: ["Super","Admin"]
        }
    ],
};

export default SMSConfig;