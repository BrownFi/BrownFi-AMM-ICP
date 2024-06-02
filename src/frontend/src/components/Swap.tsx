import { Input } from "antd";
import { useState } from "react";
import { css, styled } from "styled-components";
import { twMerge } from "tailwind-merge";
import AppBody from "../AppBody";
import { CoreActorProvider } from "../hooks/coreActor";
import { Field } from "../model/inputs";
import { TokenDetails } from "../model/tokens";
import { colors } from "../theme";
import { AutoColumn } from "./Column";
import ArrowDown from "./Icons/ArrowDown";
import SwapIcon from "./Icons/SwapIcon";
import SelectTokenModal from "./Modals/SelectToken/SelectTokenModal";
import ConfirmModal from "./Modals/TransactionLoading/TransactionLoading";
import SwapHeader from "./SwapHeader";
import toast from "react-hot-toast";

const LightDiv = styled.div`
	color: ${colors().text1};
`;
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

function Swap() {
  const [isShowInputTokenModal, setShowInputTokenModal] = useState<boolean>(false);
  const [isShowOuputTokenModal, setShowOutputTokenModal] = useState<boolean>(false);
  const [isShowConfirmModal, setIsShowConfirmModal] = useState<boolean>(false);
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

  const [status, setStatus] = useState<string>("");
  // const { call, data, error, loading } = useQuote({
    
  // });

  const handleChangeAmounts = (value: string, independentField: Field) => {
    if (isNaN(+value)) return;
    if (independentField === Field.OUTPUT) {
      toast.error("Not support quote pay token yet")
      return;
    }

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

  const onConfirmSwap = () => {
    console.log("Confirm Swap")
    console.log(tokens)
    setStatus("loading")
    setTimeout(() => {
      setStatus("success")
    }, 2000)
  };

  return (
    <>
      <AppBody>
        <SwapHeader />
        <Wrapper id="swap-page">
          <AutoColumn
            gap={"md"}
          >
            <div className="flex w-full flex-col items-center gap-2">
              <div className="flex flex-col items-start gap-5 self-stretch bg-[#131216] p-4 self-stretch">
                <div className="flex justify-between items-center self-stretch">
                {tokens.INPUT && (<span className="text-base font-medium">{tokens.INPUT.symbol}</span>)}
                  <span className="text-lg font-normal text-white font-['Russo_One']">You Pay</span>
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
                  <div className="flex items-center gap-1 text-sm font-medium text-[rgba(255,255,255,0.50)]">
                    --
                  </div>
                </div>
              </div>
              <SwapIcon
                onClick={() => setIsShowConfirmModal(true)}
              />
              <div className="flex flex-col items-start gap-5 self-stretch bg-[#131216] p-4">
                <div className="flex justify-between items-center self-stretch">
                {tokens.OUTPUT && (<span className="text-base font-medium">{tokens.OUTPUT.symbol}</span>)}
                  <span className="text-lg font-normal text-white font-['Russo_One']">Your Receive</span>
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
                  <div className="flex items-center gap-1 text-sm font-medium text-[rgba(255,255,255,0.50)]">
                    --
                  </div>
                </div>
              </div>
            </div>
          </AutoColumn>
        </Wrapper>
      </AppBody>
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
      {isShowConfirmModal && (
        <ConfirmModal
          isShowing={isShowConfirmModal}
          open={setIsShowConfirmModal}
          status={status}
          onConfirm={onConfirmSwap}
        />
      )}
    </>
  );
}

export default function WrappedSwap() {
  return (
    <CoreActorProvider
      canisterId={import.meta.env.CANISTER_ID_CORE}
      loadingComponent={<div>Loading Core Agent ...</div>}
    >
      <Swap />
    </CoreActorProvider>
  )
}

