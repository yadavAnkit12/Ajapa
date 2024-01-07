import OrderPlan from './OrderPlan';

const OrderConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: 'app/productOrder/',
            element: <OrderPlan />,
            auth: ["admin", "employee", "partner"]
        }
    ],
};

export default OrderConfig;