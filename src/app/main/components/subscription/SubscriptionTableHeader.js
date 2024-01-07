import { TableCell, TableRow, TableSortLabel, Tooltip, TableHead, lighten } from '@mui/material';

const rows = [

    {
        id: 'planName',
        align: 'left',
        disablePadding: false,
        label: 'Plan Name',
        sort: true,
    },
    {
        id: 'patientMobile',
        align: 'left',
        disablePadding: false,
        label: 'Patient Mobile',
        sort: true,
    },
    {
        id: 'priceWithgst',
        align: 'left',
        disablePadding: false,
        label: 'Price+GST',
        sort: true,
    },
    {
        id: 'appointmentSlot',
        align: 'left',
        disablePadding: false,
        label: 'Appointment Slot',
        sort: true,
    },
    {
        id: 'offPercentMedicine',
        align: 'left',
        disablePadding: false,
        label: 'Medicine off%',
        sort: true,
    },
    {
        id: 'offPercentTest',
        align: 'left',
        disablePadding: false,
        label: 'Lab Test off%',
        sort: true,
    },
    {
        id: 'expiryMonth',
        align: 'left',
        disablePadding: false,
        label: 'Expiry Month',
        sort: true,
    },
    {
        id: 'status',
        align: 'left',
        disablePadding: false,
        label: 'Status',
        sort: true,
    },
    // {
    //     id: 'edit',
    //     align: 'left',
    //     disablePadding: false,
    //     label: 'Edit',
    //     sort: true,
    // },
    // {
    //     id: 'action',
    //     align: 'left',
    //     disablePadding: false,
    //     label: 'Actions',
    //     sort: true,
    // }
];

function SubscriptionTableHead(props) {
    const { selectedProductIds } = props;

    const createSortHandler = (property) => (event) => {
        props.onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow className="h-48 sm:h-64">

                {rows.map((row) => {
                    return (
                        <TableCell
                            sx={{
                                backgroundColor: (theme) =>
                                    theme.palette.mode === 'light'
                                        ? lighten(theme.palette.background.default, 0.4)
                                        : lighten(theme.palette.background.default, 0.02),
                            }}
                            className="p-4 md:p-12"
                            key={row.id}
                            align={row.align}
                            padding={row.disablePadding ? 'none' : 'normal'}
                            sortDirection={props.order.id === row.id ? props.order.direction : false}
                        >
                            {row.sort && (
                                <Tooltip
                                    title="Sort"
                                    placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}
                                >
                                    <TableSortLabel
                                        active={props.order.id === row.id}
                                        direction={props.order.direction}
                                        onClick={createSortHandler(row.id)}
                                        className="font-semibold"
                                    >
                                        {row.label}
                                    </TableSortLabel>
                                </Tooltip>
                            )}
                        </TableCell>
                    );
                }, this)}
            </TableRow>
        </TableHead>
    );
}

export default SubscriptionTableHead;