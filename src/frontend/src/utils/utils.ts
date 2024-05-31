import { LP_DECIMAL, SUI_COIN_TYPE } from "../constants/constants";
import { Token } from "../model/coins";
import { BIG_TEN, BigNumberInstance } from "./bigNumber";

export const UNKNOWN_TOKEN_ICON = "https://icones.pro/wp-content/uploads/2021/05/icone-point-d-interrogation-question-noir.png";

export const formatBalance = (coin: Token) => {
	if (coin.coinType === SUI_COIN_TYPE) {
		return Number(coin.totalBalance) / 10 ** 9;
	} else {
		return Number(coin.totalBalance) / 10 ** 6;
	}
};

export const getDecimalAmount = (amount: string | number, coinType?: string, decimals = LP_DECIMAL) => {
	if (coinType === SUI_COIN_TYPE) {
		return BigNumberInstance(amount).times(BIG_TEN.pow(decimals)).toFixed();
	} else {
		// TODO
		return BigNumberInstance(amount).times(BIG_TEN.pow(6)).toFixed();
	}
};

export const getBalanceAmount = (coin: Token, decimals = LP_DECIMAL) => {
	if (coin.coinType === SUI_COIN_TYPE) {
		return BigNumberInstance(coin.totalBalance).div(BIG_TEN.pow(decimals));
	} else {
		return BigNumberInstance(coin.totalBalance).div(BIG_TEN.pow(6));
	}
};
