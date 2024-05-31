import { SUI_COIN_TYPE } from "../constants/constants";
import { TokenDetails } from "../model/tokens";
import SUI_IMAGE from "/images/sui.svg";

export const SUITOKENS: TokenDetails[] = [
	{
		address: "0x70f7bbfa1c8fb5c9f4294027958c7bb19cea373169ae58031f45f3b8273d0c82::mock_usdt::MOCK_USDT",
		decimals: 6,
		logoURI: "https://icones.pro/wp-content/uploads/2021/05/icone-point-d-interrogation-question-noir.png",
		name: "MOCK TOKEN",
		symbol: "MOCK",
	},
	{
		address: SUI_COIN_TYPE,
		decimals: 9,
		logoURI: SUI_IMAGE,
		name: "SUI",
		symbol: "SUI",
	},
];

export const isInTokens = (address: string, tokens: any) => {
	// @ts-ignore
	const result = Object.values(tokens).filter((item) => item.address === address);
	return result && result.length > 0 ? true : false;
};

export const isInLpTokens = (address: string, tokens: any) => {
	// @ts-ignore
	const result = Object.values(tokens).filter((item) => item.address === address);
	return result && result.length > 0 ? true : false;
};

export function getCurrentLP(fromCoin: string, toCoin: string, lpTokens: any) {
	const result = Object.values(lpTokens).filter((item) => {
		// @ts-ignore
		return (fromCoin === item.coinA.symbol && toCoin === item.coinB.symbol) || (fromCoin === item.coinB.symbol && toCoin === item.coinA.symbol);
	});
	return (result && result[0]) || null;
}

export function getInteractiveToken(fromCoin: string, toCoin: string, lpTokens: any) {
	if (lpTokens[`${fromCoin}-${toCoin}`]) {
		return "from";
	} else if (lpTokens[`${toCoin}-${fromCoin}`]) {
		return "to";
	}
	return "from";
}

export function getDirection(fromCoin: string, toCoin: string, lpTokens: any) {
	if (lpTokens[`${fromCoin}-${toCoin}`]) {
		return true;
	}
	return false;
}
