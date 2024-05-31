export interface PositionDetails {
	id: string;
	tokenPay: string;
	tokenReceive: string;
	lpToken?: string;
	isActive: boolean;
	parameter: Record<string, string>;
	currentLP: string;
}

export interface PoolParams {
	k: string;
	l: string
	feeRate: string;
}