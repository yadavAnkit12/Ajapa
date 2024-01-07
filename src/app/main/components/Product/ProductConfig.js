import ProductPlan from './ProductPlan';

const ProductConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: 'app/product/',
            element: <ProductPlan />,
            auth: ["admin", "employee", "partner"]
        }
    ],
};

export default ProductConfig;