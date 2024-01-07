import { TableCell, TableRow, TableSortLabel, Tooltip, TableHead } from '@mui/material';
import { lighten } from '@mui/material/styles';

function TransactionTableHead(props) {

  const rows = [
    {
      id: 'transactionId',
      align: 'left',
      disablePadding: false,
      label: 'Transaction Id',
      sort: true,
      visibleIf: true
    },
    {
      id: 'patientmob',
      align: 'left',
      disablePadding: false,
      label: ' Patient Mob',
      sort: true,
      visibleIf: true
    },
    {
      id: 'orderType',
      align: 'left',
      disablePadding: false,
      label: 'Order Type',
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
      id: 'paymentMode',
      align: 'left',
      disablePadding: false,
      label: 'Payment Mode',
      sort: true,
      visibleIf: true
    },
    {
      id: 'date',
      align: 'left',
      disablePadding: false,
      label: 'Date',
      sort: true,
      visibleIf: true
    },
    {
      id: 'time',
      align: 'left',
      disablePadding: false,
      label: 'Time',
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
      id: 'view',
      align: 'left',
      disablePadding: false,
      label: 'View',
      sort: true,
      visibleIf: _.get(props, 'permission.read_data')
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
                className="p-4 md:p-16"
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

export default TransactionTableHead;