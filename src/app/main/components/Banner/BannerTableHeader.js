import { TableCell, TableRow, TableSortLabel, Tooltip, TableHead, lighten } from '@mui/material';

function BannerTableHeader(props) {

    const rows = [

        {
            id: 'name',
            align: 'left',
            disablePadding: false,
            label: 'Banner Name',
            sort: true,
            visibleIf: true
        },
        {
            id: 'code',
            align: 'left',
            disablePadding: false,
            label: 'Banner Code',
            sort: true,
            visibleIf: true
        },
        {
            id: 'bannerImage',
            align: 'left',
            disablePadding: false,
            label: 'Image',
            sort: true,
            visibleIf: true
        },
        {
            id: 'edit',
            align: 'left',
            disablePadding: false,
            label: 'Edit',
            sort: true,
            visibleIf: _.get(props, 'permission.delete_data')
        },
        {
            id: 'delete',
            align: 'left',
            disablePadding: false,
            label: 'Delete',
            sort: true,
            visibleIf: _.get(props, 'permission.delete_data')
        }
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

export default BannerTableHeader;