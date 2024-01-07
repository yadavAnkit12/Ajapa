import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Modal, Table, TableBody, TableCell, TablePagination, TableRow, Typography, IconButton, Box } from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState,useRef } from 'react';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import PatientRegisterForm from '../patient/patientRegisterForm';
import { patientAPIConfig } from '../../API/apiConfig';
import { selectPatientsSearchText } from '../../../store/reduxSlice/patientsSlice';
import PatientTableHead from './PatientTableHead';
import PatientWalletPoint from './PatientWalletPoint';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px',
  maxWidth: '1200px',
  maxHeight: '650px',
  overflow: 'auto'
};
function PatientTable(props) {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [patientListData, setPatientListData] = useState([]);
  const searchText = useSelector(selectPatientsSearchText);

  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const tableRef=useRef(null)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState({
    direction: 'asc',
    id: null,
  });

  const [openEdit, setOpenEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [openView, setOpenView] = useState(false);
  const [viewid, setViewId] = useState("");
  const [change, setChange] = useState(false);

  useEffect(() => {
    fetchData();
  }, [props?.change, rowsPerPage, page, props?.filterValue]);

  useEffect(() => {
    if (page !== 0) {
      setPage(0);
    }
  }, [props.filterValue])

  useEffect(() => {
    const delay = 500;
    let timeoutId;

    const triggerAPI = () => {
      fetchData();
    };

    const debouncedTriggerAPI = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(triggerAPI, delay);
    };

    if (searchText.length !== 0) {
      debouncedTriggerAPI();
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchText]);


  const fetchData = () => {
    const params = {
      page: page + 1,
      rowsPerPage: rowsPerPage, // Example data to pass in req.query
      search: searchText,
      fromDate: _.get(props, 'filterValue.fromDate'),
      toDate: _.get(props, 'filterValue.toDate'),
      planName: _.get(props, 'filterValue.planName.planName'),
      status: (_.get(props, 'filterValue.status.id') === 'all' || !_.get(props, 'filterValue.status.id')) ? '' : _.get(props, 'filterValue.status.id')
    };
    axios.get(patientAPIConfig.getPatientList, { params }, {
      headers: {
        'Content-type': 'multipart/form-data',
        authorization: `Bearer ${window.localStorage.getItem('jwt_access_token')}`,
      },
    }).then((response) => {
      if (response.status === 200) {
        setPatientListData(response?.data?.data);
        setLoading(false);
      } else {
        dispatch(showMessage({ message: response.data.error_message, variant: 'error' }));
      }
    });
  };

  const handleEditOpen = (empId) => {
    setEditId(empId)
    setOpenEdit(true);
  };

  const handleEditClose = () => {
    setOpenEdit(false);
    setChange(!change)
  };


  const handleViewOpen = (empId) => {
    setViewId(empId)
    setOpenView(true);
  };


  const handleViewClose = () => {
    setOpenView(false);
  };

  function handleRequestSort(event, property) {
    const id = property;
    let direction = 'desc';

    if (order.id === property && order.direction === 'desc') {
      direction = 'asc';
    }

    setOrder({
      direction,
      id,
    });
  }

  function handleSelectAllClick(event) {
    if (event.target.checked) {
      setSelected(_.size(_.get(patientListData, 'patientList')) > 0 ?
        _.get(patientListData, 'patientList').map((n) => n._id) :
        {}
      );
      return;
    }
    setSelected([]);
  }

  function handleDeselect() {
    setSelected([]);
  }

  function redirectToProfile(patientId) {
    navigate(`/app/patient/profile/${patientId}`);
  }
  function handleChangePage(event, value) {
    event.preventDefault();
    setPage(value);
    tableRef.current && tableRef.current.scrollIntoView();

  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    tableRef.current && tableRef.current.scrollIntoView();

  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FuseLoading />
      </div>
    );
  }

  if (!_.size(_.get(patientListData, 'patientList'))) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          There are no Patients!
        </Typography>
      </motion.div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-full">
      <Table stickyHeader className="min-w-xl" aria-labelledby="tableTitle" ref={tableRef}>
        <PatientTableHead
          selectedProductIds={selected}
          order={order}
          onSelectAllClick={handleSelectAllClick}
          onRequestSort={handleRequestSort}
          rowCount={patientListData?.patientList?.length}
          onMenuItemClick={handleDeselect}
          permission={props.permission}
        />
        <TableBody>
          {_.orderBy(patientListData?.patientList, [(o) => {
            switch (order.id) {
              case 'categories': {
                return o.categories[0];
              }
              default: {
                return o[order.id];
              }
            }
          },
          ],
            [order.direction]
          )
            .map((n) => {
              const isSelected = selected.indexOf(n._id) !== -1;
              return (
                <TableRow
                  className="h-72 cursor-pointer"
                  hover
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={-1}
                  key={n._id}
                  selected={isSelected}
                  style={{ cursor: 'default' }}
                >
                  <TableCell className="p-4 md:p-16" component="th" scope="row">
                    {n.name}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row">
                    {n.mobile}
                  </TableCell>

                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {n.email}

                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {n.clinicId.name}
                  </TableCell>
                  <TableCell className="p-4 md:p-16" component="th" scope="row" align="left">
                    {n.status || 'NA'}
                  </TableCell>

                  {_.get(props, 'permission.read_data') && <TableCell className="p-4 md:p-16" component="th" scope="row" >
                    <IconButton aria-label="view" color="success" onClick={() => { redirectToProfile(n._id) }} disabled={!props?.permission?.read_data}>
                      <PersonIcon />
                    </IconButton>
                  </TableCell>}

                  {_.get(props, 'permission.update_data') && <TableCell className="p-4 md:p-16" component="th" scope="row" >
                    <IconButton aria-label="edit" color="success" onClick={() => { handleEditOpen(n._id) }}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>}

                </TableRow>
              );

            })}
        </TableBody>

      </Table>

      {!searchText && <TablePagination
        className="shrink-0 border-t-1"
        component="div"
        count={patientListData.totalElement}
        rowsPerPage={patientListData.rowsPerPage}
        page={patientListData.pageNumber - 1}
        backIconButtonProps={{
          'aria-label': 'Previous Page',
        }}
        nextIconButtonProps={{
          'aria-label': 'Next Page',
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />}

      <Modal
        open={openEdit}
        onClose={handleEditClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <PatientRegisterForm patientId={editId} setChange={props.setChange} change={props.change} setOpen={setOpenEdit} />
        </Box>
      </Modal>


      <Modal
        open={openView}
        onClose={handleViewClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <PatientWalletPoint type="all" patientId={viewid} setChange={setChange} change={change} setOpen={setOpenView} open={openView} />
        </Box>
      </Modal>


    </div>
  );
}

export default withRouter(PatientTable);