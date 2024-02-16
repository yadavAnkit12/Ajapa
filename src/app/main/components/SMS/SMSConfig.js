
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
            auth: ["Super"]
        }
    ],
};

export default SMSConfig;