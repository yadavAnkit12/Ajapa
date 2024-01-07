import { lazy } from 'react';
const SubscriptionPlan = lazy(() => import("./SubscriptionPlan"));

const SubscriptionPlanConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: '/app/subscription/',
            element: <SubscriptionPlan />,
            auth: ["admin", "employee"]
        }
    ],
};

export default SubscriptionPlanConfig;