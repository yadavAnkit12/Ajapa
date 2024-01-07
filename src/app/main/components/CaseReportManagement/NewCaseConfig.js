import NewCase from "./NewCase";

const NewCaseConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: 'app/newRequestCaseList/',
            element: <NewCase />,
            auth: ["admin", "employee","clinic"]
        },
        // {
        //     path: 'app/manage/case/:CaseID/*',
        //     element: <ServiceForm />,
        //     auth: ["admin","clinic","clinic"]
        // }
    ],
};

export default NewCaseConfig;