import Setting from "./Setting";

const SettingConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: 'app/setting/Configuration',
            element: <Setting />,
            auth: ["admin"]
        }
    ],
};

export default SettingConfig;