import FinalCaseReport from "./FinalCaseReport";

const FinalCaseReportConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: 'app/finalSentReport/',
            element: <FinalCaseReport />,
            auth: ["admin", "employee","clinic"]
        }
    ],
};

export default FinalCaseReportConfig;