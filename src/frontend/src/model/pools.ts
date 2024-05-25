export type PoolType = {
	pool_addr: string;
	pool_type: string;
	coin_x_type?: string;
	coin_y_type?: string;
};

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

// export const MOCK_POOL_DETAILS: PoolDetails[] = [
// 	{
//         id: 1,
//         pToken: "PAY",
//         qToken: "REC",
//         isActive: true,
//         parameter: "23",
//         currentLP: "2.333",
//       },
//       {
//         id: 2,
//         pToken: "TEST1",
//         qToken: "TEST2",
//         isActive: true,
//         parameter: "12",
//         currentLP: "4.3",
//       },
//       {
//         id: 1,
//         pToken: "PAY",
//         qToken: "REC",
//         isActive: true,
//         parameter: "23",
//         currentLP: "2.333",
//       },
//       {
//         id: 2,
//         pToken: "TEST1",
//         qToken: "TEST2",
//         isActive: true,
//         parameter: "12",
//         currentLP: "4.3",
//       },
//       {
//         id: 2,
//         pToken: "TEST1",
//         qToken: "TEST2",
//         isActive: true,
//         parameter: "12",
//         currentLP: "4.3",
//       },
//       {
//         id: 1,
//         pToken: "PAY",
//         qToken: "REC",
//         isActive: true,
//         parameter: "23",
//         currentLP: "2.333",
//       },
//       {
//         id: 2,
//         pToken: "TEST1",
//         tokenReceive: "TEST2",
//         isActive: true,
//         parameter: "12",
//         currentLP: "4.3",
//       },
//       {
//         id: 1,
//         pToken: "PAY",
//         tokenReceive: "REC",
//         isActive: true,
//         parameter: "23",
//         currentLP: "2.333",
//       },
// ]