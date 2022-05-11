import { SubmitHandler, useForm } from 'react-hook-form';
import { FormErrorMessage, FormLabel, FormControl, Input, Button, Heading } from '@chakra-ui/react';
import { gql } from 'apollo-server-micro';
import { PlayerCreationInput, useCreatePlayerMutation } from '@/generated/graphql';
import { useQueryClient } from 'react-query';
import { useRouter } from 'next/router';

gql`
	mutation CreatePlayer($input: PlayerCreationInput!) {
		createPlayer(input: $input) {
			id
			fullName
		}
	}
`;

const CreatePlayer = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { mutate } = useCreatePlayerMutation({
		onSuccess: () => queryClient.invalidateQueries('PlayersIndex'),
	});

	const {
		handleSubmit,
		register,
		formState: { errors, isSubmitting },
	} = useForm<PlayerCreationInput>();

	const onSubmit: SubmitHandler<PlayerCreationInput> = (newPlayerData) => {
		mutate({ input: newPlayerData });
		router.push('/players');
	};

	return (
		<>
			<Heading>Create Player</Heading>

			<form onSubmit={handleSubmit(onSubmit)}>
				<FormControl isRequired isInvalid={!!errors.firstName}>
					<FormLabel htmlFor='firstName'>First Name</FormLabel>
					<Input
						id='firstName'
						placeholder='first name'
						{...register('firstName', { required: true })}
					/>
					<FormErrorMessage>{errors.firstName && 'This field is required.'}</FormErrorMessage>
				</FormControl>
				<FormControl isRequired isInvalid={!!errors.lastName}>
					<FormLabel htmlFor='lastName'>Last Name</FormLabel>
					<Input
						id='lastName'
						placeholder='last name'
						{...register('lastName', { required: true })}
					/>
					<FormErrorMessage>{errors.lastName && 'This field is required.'}</FormErrorMessage>
				</FormControl>
				<Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
					Submit
				</Button>
			</form>
		</>
	);
};

export default CreatePlayer;
