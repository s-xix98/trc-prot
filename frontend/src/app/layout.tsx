'use client';
import './globals.css';
// TODO : Inter なんなのか調べる
// storybook addon-coverage を入れたら、test でエラーが出るようになった。
// Inter コメントアウトしても、特に影響がなかったので一旦コメントアウト
// import { Inter } from 'next/font/google';
import { SnackbarProvider, closeSnackbar } from 'notistack';
import { ThemeProvider } from '@mui/material';

import { useSession } from '@/hooks/useSession';
import { theme } from '@/lib/mui';

import StyledComponentsRegistry from '../lib/registry';

// const inter = Inter({ subsets: ['latin'] });

// client sideだとエラー出るので、一旦コメントアウト
// export const metadata = {
//   title: 'Create Next App',
//   description: 'Generated by create next app',
// };


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useSession();

  return (
    <html lang="en">
      {/* <body className={inter.className}> */}
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider theme={theme}>
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              action={(snackbarId) => (
                <p onClick={() => closeSnackbar(snackbarId)}>Dismiss</p>
              )}
            >
              {children}
            </SnackbarProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
