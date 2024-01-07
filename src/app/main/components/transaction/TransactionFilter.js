import { TableCell, TableRow, TableHead, Menu, MenuItem, Button } from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import React from 'react';


function TransactionFilter(props) {

    return (
        <TableHead>
            <TableRow className="h-4 sm:h-4">
                <TableCell>
                    <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                            <React.Fragment>
                                <Button variant="contained" {...bindTrigger(popupState)}>
                                    Dashboard
                                </Button>
                                <Menu {...bindMenu(popupState)}>
                                    <MenuItem onClick={popupState.close}>Profile</MenuItem>
                                    <MenuItem onClick={popupState.close}>My account</MenuItem>
                                    <MenuItem onClick={popupState.close}>Logout</MenuItem>
                                </Menu>
                            </React.Fragment>
                        )}
                    </PopupState>

                </TableCell>
                <TableCell>
                    <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                            <React.Fragment>
                                <Button variant="contained" {...bindTrigger(popupState)}>
                                    Dashboard
                                </Button>
                                <Menu {...bindMenu(popupState)}>
                                    <MenuItem onClick={popupState.close}>Profile</MenuItem>
                                    <MenuItem onClick={popupState.close}>My account</MenuItem>
                                    <MenuItem onClick={popupState.close}>Logout</MenuItem>
                                </Menu>
                            </React.Fragment>
                        )}
                    </PopupState>

                </TableCell>
                <TableCell>
                    <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                            <React.Fragment>
                                <Button variant="contained" {...bindTrigger(popupState)}>
                                    Dashboard
                                </Button>
                                <Menu {...bindMenu(popupState)}>
                                    <MenuItem onClick={popupState.close}>Profile</MenuItem>
                                    <MenuItem onClick={popupState.close}>My account</MenuItem>
                                    <MenuItem onClick={popupState.close}>Logout</MenuItem>
                                </Menu>
                            </React.Fragment>
                        )}
                    </PopupState>

                </TableCell>
                <TableCell>
                    <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                            <React.Fragment>
                                <Button variant="contained" {...bindTrigger(popupState)}>
                                    Dashboard
                                </Button>
                                <Menu {...bindMenu(popupState)}>
                                    <MenuItem onClick={popupState.close}>Profile</MenuItem>
                                    <MenuItem onClick={popupState.close}>My account</MenuItem>
                                    <MenuItem onClick={popupState.close}>Logout</MenuItem>
                                </Menu>
                            </React.Fragment>
                        )}
                    </PopupState>

                </TableCell>
            </TableRow>
        </TableHead>
    );
}

export default TransactionFilter;