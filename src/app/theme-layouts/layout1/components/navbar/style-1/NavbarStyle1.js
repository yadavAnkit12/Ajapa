import Hidden from '@mui/material/Hidden';
import { styled } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useDispatch, useSelector } from 'react-redux';
import { memo, useContext, useEffect} from 'react';
import { navbarCloseMobile, selectFuseNavbar } from 'app/store/fuse/navbarSlice';
import { selectFuseCurrentLayoutConfig } from 'app/store/fuse/settingsSlice';
import NavbarStyle1Content from './NavbarStyle1Content';


const navbarWidth = 280;

const StyledNavBar = styled('div')(({ theme, open, position }) => ({
  minWidth: navbarWidth,
  width: navbarWidth,
  maxWidth: navbarWidth,
  ...(!open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(position === 'left' && {
      marginLeft: `-${navbarWidth}px`,
    }),
    ...(position === 'right' && {
      marginRight: `-${navbarWidth}px`,
    }),
  }),
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const StyledNavBarMobile = styled(SwipeableDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    minWidth: navbarWidth,
    width: navbarWidth,
    maxWidth: navbarWidth,
  },
}));

function NavbarStyle1(props) {
 
  const dispatch = useDispatch();

// useEffect(() => {
//   dispatch(employeeDetail("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDUzYjA0ZjdlOTcxNmRkZmEwYmFlZmUiLCJlbWFpbCI6ImFiaGkxMjNAZ21haWwuY29tIiwibW9iaWxlIjoiODgwMDQ4MDgwNyIsInJvbGVJRCI6eyJfaWQiOiI2NDRmOTJmMmMyZTZmMGFiNzNjMWQwNjEiLCJyb2xlIjoiYWRtaW4iLCJwb3NpdGlvbiI6MSwiY3JlYXRlZEF0IjoiMjAyMy0wNS0wMVQxMDoyMjo0Mi4yOTNaIiwidXBkYXRlZEF0IjoiMjAyMy0wNS0wMVQxMDoyODoyMC40NzZaIiwiX192IjowfSwiaWF0IjoxNjgzNjEyNTQ3LCJleHAiOjE2ODM5NzI1NDd9.qGUV_5IGfpscioiiFuy9p5rJc8QXibN6ummqED4Am7Q"))
// });
  const config = useSelector(selectFuseCurrentLayoutConfig);
  const navbar = useSelector(selectFuseNavbar);

  return (
    <>
      <Hidden lgDown>
        <StyledNavBar
          className="flex-col flex-auto sticky top-0 overflow-hidden h-screen shrink-0 z-20 shadow-5"
          open={navbar.open}
          position={config.navbar.position}
        >
          
          <NavbarStyle1Content />
        </StyledNavBar>
      </Hidden>
      <Hidden lgUp>
        <StyledNavBarMobile
          classes={{
            paper: 'flex-col flex-auto h-full',
          }}
          anchor={config.navbar.position}
          variant="temporary"
          open={navbar.mobileOpen}
          onClose={() => dispatch(navbarCloseMobile())}
          onOpen={() => {}}
          disableSwipeToOpen
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
         
          <NavbarStyle1Content />
        </StyledNavBarMobile>
      </Hidden>
    </>
  );
}

export default NavbarStyle1;
