import AllCase from "./AllCase";

const AllCaseConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: 'app/allCase/',
            element: <AllCase />,
            auth: ["admin", "employee","clinic"]
        },
    ],
};

export default AllCaseConfig;