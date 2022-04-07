import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import Layout from '../components/layout/Layout';

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ChakraProvider resetCSS={true}>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</ChakraProvider>
	);
}

export default MyApp;
