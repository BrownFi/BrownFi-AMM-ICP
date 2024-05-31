export interface PoolDetails {
	id: number;
	tokenPay: string;
	tokenReceive: string;
	lpToken?: string;
	isActive: boolean;
	parameter: string;
	currentLP: string;
}

export interface PoolParams {
	k: string;
	l: string
	feeRate: string;
}