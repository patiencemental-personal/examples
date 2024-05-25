import React from 'react';
import GlobalStyle from './styles/GlobalStyle';
import GlobalPopup from './components/popup/GlobalPopup';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ScrollToTop from './route/ScrollToTop';
import { useEffect } from 'react';
import routePathMap from './route/path';
import { ToastContainer, Flip  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/index.css';
import "react-datepicker/dist/react-datepicker.css";
import RouteChangeTracker from "./RouteChangeTracker";

const Root = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const { pathname } = location;
    if (pathname === routePathMap.INDEX) {
      navigate(routePathMap.HOME.INDEX, { replace: true });
    }
  }, [location, navigate]);

  RouteChangeTracker();

  return (
    <React.Fragment>
      <GlobalStyle />
      <GlobalPopup />
      <ScrollToTop>
        <Outlet />
      </ScrollToTop>
      <ToastContainer
        transition={Flip}
        position="top-right"
        autoClose={2000}
        closeOnClick
        pauseOnHover
      />
    </React.Fragment>
  );
};

export default Root;