import LabOrderPlan from './LabOrderPlan';
import LabOrderEHR from './LabOrderEHR';
import LabOrderSampleCollected from './LabOrderSampleCollected';

const LabOrder = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: 'app/pathologyOrder/',
            element: <LabOrderPlan />,
            auth: ["admin", "employee", "partner"]
        },
        {
            path: 'app/pathologyOrder/documentupload/:orderId',
            element: <LabOrderEHR />,
            auth: ["admin", "employee", "partner"]
        },
        {
            path: 'app/pathologyOrder/collectsample/:orderId',
            element: <LabOrderSampleCollected />,
            auth: ["admin", "employee", "partner"]
        }
    ],
};

export default LabOrder;