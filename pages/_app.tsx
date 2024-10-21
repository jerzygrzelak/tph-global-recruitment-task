import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { PrimeReactProvider } from 'primereact/api';
import '../styles/globals.css';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

const App = ({Component, pageProps}: AppProps) => {
    return (
        <PrimeReactProvider>
            <SessionProvider session={pageProps.session}>
                <Component {...pageProps} />
            </SessionProvider>
        </PrimeReactProvider>
    );
};

export default App;
