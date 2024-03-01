import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { initWeb3Modal } from './modules/wagmi';
import { ErrorPage } from './pages/ErrorPage';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import WagmiProvider from './modules/wagmi/lib';
import { ConfigProvider } from 'antd';
import { theme } from './modules/antdTheme';

import 'react-toastify/dist/ReactToastify.css';

const ErrorBoundaryLayout = () => (
  <ErrorBoundary FallbackComponent={ErrorPage}>
    <Outlet />
  </ErrorBoundary>
);

export const routesConfig = [
  {
    element: <ErrorBoundaryLayout />,
    children: [
      {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
      },
    ],
  },
];

const router = createBrowserRouter(routesConfig);
const queryClient = new QueryClient();

initWeb3Modal();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* <ApolloProvider client={client}> */}
    {/* <Layout> */}
    <WagmiProvider>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={theme}>
          <RouterProvider router={router} />

          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </ConfigProvider>
      </QueryClientProvider>
    </WagmiProvider>

    {/* </Layout> */}
    {/* </ApolloProvider> */}
  </React.StrictMode>
);
