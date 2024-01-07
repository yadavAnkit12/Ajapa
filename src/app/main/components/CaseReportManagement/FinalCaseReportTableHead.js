import { TableCell, TableRow, TableSortLabel, Tooltip, TableHead } from '@mui/material';
import { lighten } from '@mui/material/styles';
import { getUserRoles } from '../../../auth/services/utils/common';

function FinalCaseReportTableHead(props) {

    const rows = [
        {
            id: 'RefrenceNo',
            align: 'left',
            disablePadding: false,
            label: 'Refrence Number',
            sort: true,
            visibleIf: true
        },
        {
            id: 'Date',
            align: 'left',
            disablePadding: false,
            label: 'Date',
            sort: true,
            visibleIf: true
        },
        {
            id: 'ExpectedDispatchDate',
            align: 'left',
            disablePadding: false,
            label: 'Expected Dispatch Date',
            sort: true,
            visibleIf: true
        },
        {
            id: 'CaseType',
            align: 'left',
            disablePadding: false,
            label: 'Case Type',
            sort: true,
            visibleIf: true
        },
        {
            id: 'PatientName',
            align: 'left',
            disablePadding: false,
            label: 'Patient Name',
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
            id: 'action',
            align: 'left',
            disablePadding: false,
            label: 'Action',
            sort: true,
            visibleIf: true
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

export default FinalCaseReportTableHead;