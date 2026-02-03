import "@/sass/main.scss";
import 'react-pro-sidebar/dist/css/styles.css';
import 'react-loading-skeleton/dist/skeleton.css'
import 'bootstrap/dist/css/bootstrap.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { AnimatePresence } from "framer-motion";
import { SessionProvider } from "next-auth/react";
import toast, { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query'
import { ThemeProvider } from 'styled-components';
import { ConfigProvider } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import config from "../src/config";
const { theme } = config;

const queryClient = new QueryClient()

function MyApp({ 
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <>
      <SessionProvider session={session}>
        <ThemeProvider theme={{ ...theme }}>
          <StyleProvider hashPriority="high">
            <ConfigProvider theme={theme}>
              <AnimatePresence>
                {/* <NextNprogress color="#FFF" /> */}
                <Toaster  
                  toastOptions={{
                    style: {
                      fontSize: '0.8rem'
                    }
                  }}
                />
                <QueryClientProvider client={queryClient}>
                  <Component {...pageProps} />
                </QueryClientProvider>
              </AnimatePresence>
            </ConfigProvider>
          </StyleProvider>
        </ThemeProvider>
      </SessionProvider>
    </>
  )
}

export default MyApp