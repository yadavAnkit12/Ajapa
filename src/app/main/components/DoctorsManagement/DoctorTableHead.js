import { TableCell, TableRow, TableSortLabel, Tooltip, TableHead } from '@mui/material';
import { lighten } from '@mui/material/styles';


function DoctorTableHead(props) {
  const rows = [
    {
      id: 'name',
      align: 'left',
      disablePadding: false,
      label: 'Name',
      sort: true,
      visibleIf: true
    },
    {
      id: 'mobile',
      align: 'left',
      disablePadding: false,
      label: ' Mobile',
      sort: true,
      visibleIf: true
    },
    {
      id: 'specialization',
      align: 'left',
      disablePadding: false,
      label: 'Specialization',
      sort: true,
      visibleIf: true
    },
    // {
    //   id: 'doctortype',
    //   align: 'left',
    //   disablePadding: false,
    //   label: 'Doctor Type',
    //   sort: true,
    //   visibleIf: true
    // },

    {
      id: 'createdOn',
      align: 'left',
      disablePadding: false,
      label: 'Created On',
      sort: true,
      visibleIf: true
    },
    // {
    //   id: 'category',
    //   align: 'left',
    //   disablePadding: false,
    //   label: 'Category',
    //   sort: true,
    //   visibleIf: true
    // },
    // {
    //   id: 'Doctor price',
    //   align: 'left',
    //   disablePadding: false,
    //   label: 'Doctor price',
    //   sort: true,
    //   visibleIf: true
    // },

    // {
    //   id: 'Published price',
    //   align: 'left',
    //   disablePadding: false,
    //   label: 'Published price',
    //   sort: true,
    //   visibleIf: true
    // },

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
      label: 'Actions',
      sort: true,
      visibleIf: (_.get(props, 'permission.delete_data') || _.get(props, 'permission.update_data') || _.get(props, 'permission.read_data'))
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

export default DoctorTableHead;
