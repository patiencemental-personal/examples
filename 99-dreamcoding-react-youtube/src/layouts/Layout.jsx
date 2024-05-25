import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import { YoutubeApiProvider } from '../contexts/YoutubeApiContext';

const queryClient = new QueryClient();

const Layout = () => {
  return (
    <React.Fragment>
      <Header />
      <YoutubeApiProvider>
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>
      </YoutubeApiProvider>
    </React.Fragment>
  );
};

export default Layout;