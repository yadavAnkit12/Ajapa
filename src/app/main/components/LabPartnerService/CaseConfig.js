
import Case from './Case';
import CaseForm from './CaseForm/CaseForm';

const CaseConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: 'app/case/',
            element: <Case />,
            auth: ["admin", "employee","clinic"]
        },
        {
            path: 'app/manage/case/:CaseID/*',
            element: <CaseForm />,
            auth: ["admin","clinic","clinic"]
        }
    ],
};

export default CaseConfig;