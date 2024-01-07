import AdminProfile from './AdminProfile'

const AdminConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: 'app/profile/:userId',
            element: <AdminProfile />,
            auth: ["admin"]
        }
    ],
};

export default AdminConfig;