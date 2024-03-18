import { createReactor } from "@ic-reactor/react";
import { idlFactory } from "../../../declarations/token1";
import { styled } from "styled-components";
import { colors, theme } from "../theme";

// import CurrencyInputPanel, {
//   ShortcutAmount,
// } from "../../components/CurrencyInputPanel";

// const PageWrapper = styled(AutoColumn)`
//   width: 100%;
// `;

// export default function Swap() {
//   const { login, identity } = useInternetIdentity();

//   return (
//     <>
//       <AppBody>
//         <SwapHeader />
//         <Wrapper id="swap-page">
//           <AutoColumn gap={"md"}>
//             <div style={{ display: "relative" }}>
//               <CurrencyInputPanel
//                 label={
//                   independentField === Field.OUTPUT && !showWrap
//                     ? "From (at most)"
//                     : "From"
//                 }
//                 value={formattedAmounts[Field.INPUT]}
//                 showMaxButton={showMaxButton}
//                 showShortcutButtons={true}
//                 currency={currencies[Field.INPUT]}
//                 onUserInput={handleTypeInput}
//                 onMax={handleMaxInput}
//                 onShortcutAmount={handleHalfInput}
//                 fiatValue={fiatValueInput ?? undefined}
//                 onCurrencySelect={handleInputSelect}
//                 otherCurrency={currencies[Field.OUTPUT]}
//                 showCommonBases={true}
//                 id="swap-currency-input"
//               />

//               <CurrencyInputPanel
//                 value={formattedAmounts[Field.OUTPUT]}
//                 onUserInput={handleTypeOutput}
//                 label={
//                   independentField === Field.INPUT && !showWrap
//                     ? "To (at least)"
//                     : "To"
//                 }
//                 showMaxButton={false}
//                 hideBalance={false}
//                 fiatValue={fiatValueOutput ?? undefined}
//                 priceImpact={priceImpact}
//                 currency={currencies[Field.OUTPUT]}
//                 onCurrencySelect={handleOutputSelect}
//                 otherCurrency={currencies[Field.INPUT]}
//                 showCommonBases={true}
//                 id="swap-currency-output"
//               />
//             </div>
//           </AutoColumn>
//         </Wrapper>
//       </AppBody>
//     </>
//   );
// }

const LightDiv = styled.div`
    color: ${colors().text1};
`

export default function Swap() {
    const { useQueryCall, useAuthState } = createReactor({
        canisterId: import.meta.env.CANISTER_ID_TOKEN1,
        idlFactory,
        host: "http://localhost:8080",
    });
    
    const { call, data, loading, error } = useQueryCall({
        functionName: "icrc1_balance_of",
        args: [{ owner: "", subaccount: [] }],
        refetchInterval: 1000,
        refetchOnMount: true,
        onLoading: () => console.log("Loading..."),
        onSuccess: (data) => console.log("Success!", data),
        onError: (error) => console.log("Error!", error),
    })

    return (
        <LightDiv>
            <h2>ICP Balance:</h2>
            <LightDiv>
                Loading: {loading.toString()}
                <br />
                Error: {error?.toString()}
                <br />
                balance:{" "}
                {data !== undefined
                    ? JSON.stringify(data, (_, v) =>
                        typeof v === "bigint" ? v.toString() : v
                    )
                    : null}
            </LightDiv>
            <button onClick={call}>Get Balance</button>
        </LightDiv>
    )
}
