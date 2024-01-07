import CouponPlan from './CouponPlan';

const CouponPlanConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: '/app/coupon/',
            element: <CouponPlan />,
            auth: ["admin", "employee"]
        }
    ],
};

export default CouponPlanConfig;