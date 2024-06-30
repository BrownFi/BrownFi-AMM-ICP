import { Input } from "antd";
import { useState } from "react";
import { css, styled } from "styled-components";
import { twMerge } from "tailwind-merge";
import AppBody from "../AppBody";
import { CoreActorProvider, coreReactor } from "../hooks/coreActor";
import { SwapField } from "../model/inputs";
import { TokenDetails } from "../model/tokens";
import { colors } from "../theme";
import { AutoColumn } from "./Column";
import ArrowDown from "./Icons/ArrowDown";
import SwapIcon from "./Icons/SwapIcon";
import SelectTokenModal from "./Modals/SelectToken/SelectTokenModal";
import ConfirmModal from "./Modals/TransactionLoading/TransactionLoading";
import SwapHeader from "./SwapHeader";
import toast from "react-hot-toast";
import { Principal } from "@dfinity/principal";
import { approve } from "../hooks/ledgerActor";
import debounce from "debounce";
import { isNumber, isEmpty } from "lodash";

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

const isNumeric = (value: any) => {
  return isNumber(value) || (!isEmpty(value) && !isNaN(value));
};

function Swap() {
  const [isShowPAYTokenModal, setShowPAYTokenModal] = useState<boolean>(false);
  const [isShowOuputTokenModal, setShowRECEIVETokenModal] = useState<boolean>(false);
  const [isShowConfirmModal, setIsShowConfirmModal] = useState<boolean>(false);
  const [payTokenAmount, setPayTokenAmount] = useState<string>("");
  const [receiveTokenAmount, setReceiveTokenAmount] = useState<string>("");
  const [tokens, setTokens] = useState<{
    [key in SwapField]: TokenDetails | "";
  }>({
    [SwapField.PAY]: "",
    [SwapField.RECEIVE]: "",
  });

  const handlePayTokenAmountChanged = (value: string) => {
    if (!isNumeric(value)) {
      toast.error("Invalid number")
      return;
    }

    toast.error("Not support quote pay token yet")
  }

  const handleReceiveTokenAmountChanged = (value: string) => {
    if (!isNumeric(value)) {
      toast.error("Invalid number")
      setReceiveTokenAmount(value);
      return;
    }

    setReceiveTokenAmount(value);
    if (tokens.PAY && tokens.RECEIVE) {
      const { call: getAmountIn } = coreReactor.updateCall({
        functionName: "getAmountIn",
        args: [
          Principal.fromText((tokens.RECEIVE as TokenDetails).address),
          Principal.fromText((tokens.PAY as TokenDetails).address),
          BigInt(value),
        ]
      });
  
      getAmountIn()
        .then(result => {
          if (result.ok) {
            setPayTokenAmount(result.ok?.toString())
          } else {
            toast.error(result.err)
          }
        })
    }
  }

  const [status, setStatus] = useState<string>("");
  // const handleChangeAmounts = (value: string, independentField: SwapField) => {
  //   if (isNaN(+value)) return;
  //   if (independentField === SwapField.PAY) {
  //     toast.error("Not support quote pay token yet")
  //     return;
  //   }


  //   if (tokens.PAY === "" || tokens.RECEIVE === "") {
  //     setTokenAmounts({
  //       [SwapField.PAY]: "",
  //       [SwapField.RECEIVE]: value,
  //     });
  //   } else {
  //     const { call: getAmountIn } = coreReactor.updateCall({
  //       functionName: "getAmountIn",
  //       args: [
  //         Principal.fromText((tokens.RECEIVE as TokenDetails).address),
  //         Principal.fromText((tokens.PAY as TokenDetails).address),
  //         BigInt(value),
  //       ]
  //     });
  
  //     getAmountIn()
  //       .then(result => {
  //         if (result.ok) {
  //           setTokenAmounts({
  //             [SwapField.PAY]: result.ok?.toString() || "",
  //             [SwapField.RECEIVE]: value,
  //           });
  //         } else {
  //           toast.error(result.err)
  //         }
  //       })
  //   }
  // };

  const setPAYToken = (token: TokenDetails) => {
    setTokens({
      PAY: token,
      RECEIVE: tokens.RECEIVE,
    })
  }

  const setRECEIVEToken = (token: TokenDetails) => {
    setTokens({
      PAY: tokens.PAY,
      RECEIVE: token,
    })
  }

  const onConfirmSwap = () => {
    console.log("Will be deposit amount", BigInt(payTokenAmount).toString());
    const { call: callDeposit } = coreReactor.updateCall({
      functionName: "deposit",
      args: [
        Principal.fromText((tokens.PAY as TokenDetails).address),
        BigInt(payTokenAmount),
      ]
    }); 

    const { call: callSwap } = coreReactor.updateCall({
      functionName: "swap",
      args: [
        Principal.fromText((tokens.RECEIVE as TokenDetails).address),
        Principal.fromText((tokens.PAY as TokenDetails).address),
        BigInt(receiveTokenAmount),
        // FIXME: hardcode deadline
        BigInt("1741447837000000000")
      ]
    });

    approve((tokens.PAY as TokenDetails).address, BigInt(payTokenAmount) * BigInt(10))
      .then(() => callDeposit())
      .then((result) => {
        if (result.err) {
          toast.error(result.err)
          console.error("## Deposit Error: ", result.err)
          setStatus("fail")
        } else {
          console.log("## Deposit Result: ", result)
        }
      })
      .then(() => callSwap())
      .then((result) => {
        // @ts-expect-error 
        if (result.err) {
          // @ts-expect-error
          toast.error(result.err)
          console.error("## Swap Error: ", result.err)
          setStatus("fail")
        } else {
          console.log("## Swap Result: ", result)
          setStatus("success")
        }
      })
      .catch((error) => {
        console.dir(error)
        setStatus("fail")
      })

    setStatus("loading")
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
                  {tokens.RECEIVE && (<span className="text-base font-medium">{tokens.RECEIVE.symbol}</span>)}
                  <span className="text-lg font-normal text-white font-['Russo_One']">You Receive</span>
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
                        value={receiveTokenAmount}
                        onChange={(e) => handleReceiveTokenAmountChanged(e.target.value)}
                      />
                    </div>
                    <div
                      className="flex justify-between items-center bg-[#1D1C21] py-[7px] px-3 cursor-pointer shadow-[0_2px_12px_0px_rgba(11,14,25,0.12)] w-[153px]"
                      onClick={() => setShowRECEIVETokenModal(true)}
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
                  {tokens.PAY && (<span className="text-base font-medium">{tokens.PAY.symbol}</span>)}
                  <span className="text-lg font-normal text-white font-['Russo_One']">Your Pay</span>
                  <div className="flex items-center gap-1 text-base font-normal">
                    <span>Balance:</span>
                    <span>--</span>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-[2px] self-stretch">
                  <div className="flex justify-between items-center self-stretch">
                    <div className="flex justify-between items-center self-stretch">
                      <Input
                        readOnly
                        placeholder="0.0"
                        className={twMerge(
                          "border-none px-0 text-xl max-w-[150px] font-medium text-[#27E3AB]"
                        )}
                        value={payTokenAmount}
                        onChange={(e) => {
                          debounce(handlePayTokenAmountChanged, 200)(e.target.value)
                        }}
                      />
                    </div>
                    <div
                      className="flex justify-between items-center bg-[#1D1C21] py-[7px] px-3 cursor-pointer shadow-[0_2px_12px_0px_rgba(11,14,25,0.12)] w-[153px]"
                      onClick={() => setShowPAYTokenModal(true)}
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
      {isShowPAYTokenModal && (
        <SelectTokenModal
          open={setShowPAYTokenModal}
          setToken={setPAYToken}
        />
      )
      }
      {
        isShowOuputTokenModal && (
          <SelectTokenModal
            open={setShowRECEIVETokenModal}
            setToken={setRECEIVEToken}
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

