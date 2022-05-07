import * as services from '@/lib/services';

export type Context = {
	services: typeof services;
};

export async function createContext(): Promise<Context> {
	return {
		services,
	};
}
