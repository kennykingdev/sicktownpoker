import { Box, Flex, Image, Stack, Text, Spacer, Link, ChakraProvider } from '@chakra-ui/react';
import { FC } from 'react';
import NextLink from 'next/link';
import 'focus-visible/dist/focus-visible';

const Layout: FC = ({ children }) => {
	return (
		<ChakraProvider resetCSS={true}>
			<Flex direction={['column', 'row']} maxW='full' h='100vh' p={0}>
				<Box id='navbar' bg='gray.800' color='whiteAlpha.800' minW='150px'>
					<Flex direction={['row', 'column']} h='100%'>
						<Image alt='logo' boxSize='80px' src='/favicon.ico' p={2} />
						<Stack direction={['row', 'column']}>
							<NextLink href='/' passHref>
								<Link>Home</Link>
							</NextLink>
							<NextLink href='/players' passHref>
								<Link>Players</Link>
							</NextLink>
						</Stack>
						<Spacer />
						<Stack direction={['row', 'column']}>
							<Text>Login</Text>
							<Text>Logout</Text>
						</Stack>
					</Flex>
				</Box>

				<Box id='content'>{children}</Box>
			</Flex>
		</ChakraProvider>
	);
};

export default Layout;
