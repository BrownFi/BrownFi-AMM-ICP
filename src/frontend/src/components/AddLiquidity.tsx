import { Input } from "antd";
import { useState } from "react";
import { css, styled } from "styled-components";
import { twMerge } from "tailwind-merge";
import AppBody from "../AppBody";
import { CoreActorProvider } from "../hooks/coreActor";
import { Field } from "../model/inputs";
import { TokenDetails } from "../model/tokens";
import { AutoColumn } from "./Column";
import AddLiquidityIcon from "./Icons/AddLiquidityIcon";
import ArrowBack from "./Icons/ArrowBack";
import ArrowDown from "./Icons/ArrowDown";
import SelectTokenModal from "./Modals/SelectToken/SelectTokenModal";
import ConfirmModal from "./Modals/TransactionLoading/TransactionLoading";

export const Wrapper = styled.div`
	position: relative;
	padding: 26px 25px 26px;
`;

export const ArrowWrapper = styled.div<{ clickable: boolean }>`
	padding: 4px;
	border-radius: 50%;
	height: 32px;
	width: 32px;
	position: relative;
	margin-top: -10px;
	margin-bottom: -10px;
	left: calc(50% - 16px);
	/* transform: rotate(90deg); */
	background-color: ${({ theme }) => theme.bg0};
	border: 1px solid ${({ theme }) => theme.primary1};
	z-index: 2;
	display: flex;
	align-items: center;
	justify-content: center;
	${({ clickable }) =>
		clickable
			? css`
					:hover {
						cursor: pointer;
						opacity: 0.8;
					}
			  `
			: null}
`;

export type CreateAddLiquidTXPayloadParams = {
	coin_x: string;
	coin_y: string;
	coin_x_objectIds: string[];
	coin_y_objectIds: string[];
	coin_x_amount: number;
	coin_y_amount: number;
	gasPaymentObjectId?: string;
	slippage: number;
};

function AddLiquidity() {
	const [isShowInputTokenModal, setShowInputTokenModal] = useState<boolean>(false);
	const [isShowOuputTokenModal, setShowOutputTokenModal] = useState<boolean>(false);
	const [isShowConfirmModal, setIsShowConfirmModal] = useState<boolean>(false);
	const [k, setK] = useState(2);
	const [status, setStatus] = useState<string>("")
	const [tokens, setTokens] = useState<{
		[key in Field]: TokenDetails | "";
	}>({
		[Field.INPUT]: "",
		[Field.OUTPUT]: "",
	});

	const [tokenAmounts, setTokenAmounts] = useState<{ [key in Field]: string }>({
		[Field.INPUT]: "",
		[Field.OUTPUT]: "",
	});

	const onConfirmAddLiquidity = () => {
		console.log("Confirm Add Liquidity")
		console.log(tokens)
		setStatus("loading")
		setTimeout(() => {
			setStatus("success")
		}, 2000)
	};

	const onChangeK = (newValue: number) => {
		setK(newValue);
	};

	const handleChangeAmounts = (value: string, independentField: Field) => {
		if (isNaN(+value)) return;

		setTokenAmounts({
			[Field.INPUT]: value,
			[Field.OUTPUT]: (Number(value) * 9).toString(),
		});
	};

	const setInputToken = (token: TokenDetails) => {
		setTokens({
			INPUT: token,
			OUTPUT: tokens.OUTPUT,
		})
	}

	const setOutputToken = (token: TokenDetails) => {
		setTokens({
			INPUT: tokens.INPUT,
			OUTPUT: token,
		})
	}

	return (
		<>
			<AppBody>
				<div className="flex flex-col items-start gap-[10px] self-stretch px-6 pt-6">
					<div className="flex items-center gap-3 self-stretch text-white cursor-pointer">
						<ArrowBack />
						<span className="text-2xl !font-['Russo_One'] leading-[29px]">Add Liquidity</span>
					</div>
					<div className="flex justify-center items-center gap-[10px] p-2 self-stretch bg-[rgba(39,227,171,0.10)]">
						<span className="text-xs text-[#27E3AB] flex-1 font-medium font-['Montserrat'] leading-[18px]">
							<b>Tip:</b> When you add liquidity, you will receive pool tokens representing your position.
							<br /> These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.
						</span>
					</div>
				</div>
				<Wrapper id="swap-page">
					<AutoColumn
						gap={"md"}
					>
						<div className="flex w-full flex-col items-center gap-2">
							<div className="flex flex-col items-start gap-5 self-stretch bg-[#131216] p-4 self-stretch">
								<div className="flex justify-between items-center self-stretch">
									{tokens.INPUT && (<span className="text-base font-medium">{tokens.INPUT.symbol}</span>)}
									<span className="text-lg font-normal text-white font-['Russo_One']">Quote Token</span>
									<div className="flex items-center gap-1 text-base font-normal">
										<span>Balance:</span>
										<span>--</span>
									</div>
								</div>
								<div className="flex flex-col items-start gap-[2px] self-stretch">
									<div className="flex justify-between items-center self-stretch">
										<div className="flex justify-between items-center self-stretch">
											<Input
												placeholder="0.0"
												className="border-none px-0 text-xl font-bold max-w-[150px] text-[#C6C6C6]"
												value={tokenAmounts[Field.INPUT]}
												onChange={(e) => handleChangeAmounts(e.target.value, Field.INPUT)}
											/>
										</div>
										<div
											className="flex justify-between items-center bg-[#1D1C21] py-[7px] px-3 cursor-pointer shadow-[0_2px_12px_0px_rgba(11,14,25,0.12)] w-[153px]"
											onClick={() => setShowInputTokenModal(true)}
										>
											<div className="flex items-center gap-2">
												<span className="text-sm font-medium">--</span>
											</div>
											<ArrowDown />
										</div>
									</div>
									<div className="flex items-center gap-1 text-sm font-medium text-[rgba(255,255,255,0.50)]">--</div>
								</div>
							</div>
							<AddLiquidityIcon
								onClick={() => setIsShowConfirmModal(true)}
							/>
							<div className="flex flex-col items-start gap-5 self-stretch bg-[#131216] p-4">
								<div className="flex justify-between items-center self-stretch">
									{tokens.OUTPUT && (<span className="text-base font-medium">{tokens.OUTPUT.symbol}</span>)}
									<span className="text-lg font-normal text-white font-['Russo_One']">Pay Token</span>
									<div className="flex items-center gap-1 text-base font-normal">
										<span>Balance:</span>
										<span>--</span>
									</div>
								</div>
								<div className="flex flex-col items-start gap-[2px] self-stretch">
									<div className="flex justify-between items-center self-stretch">
										<div className="flex justify-between items-center self-stretch">
											<Input
												placeholder="0.0"
												className={twMerge(
													"border-none px-0 text-xl max-w-[150px] font-medium text-[#27E3AB]"
													// isLoadingTrade && "hidden"
												)}
												value={tokenAmounts[Field.OUTPUT]}
												onChange={(e) => handleChangeAmounts(e.target.value, Field.OUTPUT)}
											/>
										</div>
										<div
											className="flex justify-between items-center bg-[#1D1C21] py-[7px] px-3 cursor-pointer shadow-[0_2px_12px_0px_rgba(11,14,25,0.12)] w-[153px]"
											onClick={() => setShowOutputTokenModal(true)}
										>
											<div className="flex items-center gap-2">
												<span className="text-sm font-medium">--</span>
											</div>
											<ArrowDown />
										</div>
									</div>
									<div className="flex items-center gap-1 text-sm font-medium text-[rgba(255,255,255,0.50)]">--</div>
								</div>
							</div>
						</div>
						<div className="flex flex-col items-start gap-8 self-stretch">
							<div className="flex flex-col items-start gap-4 self-stretch">
							</div>
							<div className="flex justify-between items-center self-stretch">
								<span className="text-base font-bold leading-[20px]">Capital Efficiency</span>
								<div className="flex h-8 items-center justify-center gap-1 px-4 bg-[#323038]">
									<span className="text-xs font-bold">1000x</span>
								</div>
							</div>
						</div>
					</AutoColumn>
				</Wrapper>
			</AppBody >
			{isShowInputTokenModal && (
				<SelectTokenModal
					open={setShowInputTokenModal}
					setToken={setInputToken}
				/>
			)
			}
			{
				isShowOuputTokenModal && (
					<SelectTokenModal
						open={setShowOutputTokenModal}
						setToken={setOutputToken}
					/>
				)
			}
			{
				isShowConfirmModal && (
					<ConfirmModal
						isShowing={isShowConfirmModal}
						open={setIsShowConfirmModal}
						status={status}
						onConfirm={onConfirmAddLiquidity}
					/>
				)
			}
		</>
	);
}


export default function WrappedAddLiquidity() {
	return (
		<CoreActorProvider
			canisterId={import.meta.env.CANISTER_ID_CORE}
			loadingComponent={<div>Loading Core Agent ...</div>}
		>
			<AddLiquidity />
		</CoreActorProvider>
	)
}
