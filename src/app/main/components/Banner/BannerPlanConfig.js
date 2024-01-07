import { lazy } from 'react';
const BannerPlan = lazy(() => import("./BannerPlan"));

const BannerPlanConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: '/app/banner/',
            element: <BannerPlan />,
            auth: ["admin", "employee"]
        }
    ],
};

export default BannerPlanConfig;