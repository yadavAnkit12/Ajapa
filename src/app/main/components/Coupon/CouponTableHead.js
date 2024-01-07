import { TableCell, TableRow, TableSortLabel, Tooltip, TableHead } from '@mui/material';
import { lighten } from '@mui/material/styles';

function CouponTableHead(props) {

    const rows = [
        {
            id: 'couponTitle',
            align: 'left',
            disablePadding: false,
            label: 'Coupon Title',
            sort: true,
            visibleIf: true
        },
        {
            id: 'couponCode',
            align: 'left',
            disablePadding: false,
            label: 'Coupon Code',
            sort: true,
            visibleIf: true
        },
        {
            id: 'OffType',
            align: 'left',
            disablePadding: false,
            label: 'Off Type',
            sort: true,
            visibleIf: true
        },
        {
            id: 'minCartValue',
            align: 'center',
            disablePadding: false,
            label: 'Minimum Cart Value',
            sort: true,
            visibleIf: true
        },
        {
            id: 'price',
            align: 'left',
            disablePadding: false,
            label: 'Price',
            sort: true,
            visibleIf: true
        },
        {
            id: 'maxDiscount%',
            align: 'left',
            disablePadding: false,
            label: 'Max Discount %',
            sort: true,
            visibleIf: true
        },
        {
            id: 'status',
            align: 'left',
            disablePadding: false,
            label: 'Status',
            sort: true,
            visibleIf: true
        },
        {
            id: 'startDate',
            align: 'left',
            disablePadding: false,
            label: 'Start Date',
            sort: true,
            visibleIf: true
        },
        {
            id: 'endDate',
            align: 'left',
            disablePadding: false,
            label: 'End Date',
            sort: true,
            visibleIf: true
        },
        {
            id: 'action',
            align: 'left',
            disablePadding: false,
            label: 'Action',
            sort: true,
            visibleIf: _.get(props, 'permission.update_data')
        },
    ];

    const createSortHandler = (property) => (event) => {
        props.onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow className="h-48 sm:h-64">

                {rows.map((row) => {
                    if (row.visibleIf)
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

export default CouponTableHead;