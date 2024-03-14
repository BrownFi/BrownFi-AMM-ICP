import { useInternetIdentity } from "ic-use-internet-identity";
import styled from "styled-components";
import { ButtonLight } from "./Button";
import { AutoColumn } from "./Column";
import ConnectWallet from "../../public/images/connect-wallet.png";
import AppBody from "./AppBody";
import SwapHeader from "./SwapHeader";
import {
  ArrowWrapper,
  BottomGrouping,
  Dots,
  SwapCallbackError,
  Wrapper,
} from "./styleds";

import CurrencyInputPanel, {
  ShortcutAmount,
} from "../../components/CurrencyInputPanel";

const PageWrapper = styled(AutoColumn)`
  width: 100%;
`;

export default function Swap() {
  const { login, identity } = useInternetIdentity();

  return (
    <>
      <AppBody>
        <SwapHeader />
        <Wrapper id="swap-page">
          <AutoColumn gap={"md"}>
            <div style={{ display: "relative" }}>
              <CurrencyInputPanel
                label={
                  independentField === Field.OUTPUT && !showWrap
                    ? "From (at most)"
                    : "From"
                }
                value={formattedAmounts[Field.INPUT]}
                showMaxButton={showMaxButton}
                showShortcutButtons={true}
                currency={currencies[Field.INPUT]}
                onUserInput={handleTypeInput}
                onMax={handleMaxInput}
                onShortcutAmount={handleHalfInput}
                fiatValue={fiatValueInput ?? undefined}
                onCurrencySelect={handleInputSelect}
                otherCurrency={currencies[Field.OUTPUT]}
                showCommonBases={true}
                id="swap-currency-input"
              />

              <CurrencyInputPanel
                value={formattedAmounts[Field.OUTPUT]}
                onUserInput={handleTypeOutput}
                label={
                  independentField === Field.INPUT && !showWrap
                    ? "To (at least)"
                    : "To"
                }
                showMaxButton={false}
                hideBalance={false}
                fiatValue={fiatValueOutput ?? undefined}
                priceImpact={priceImpact}
                currency={currencies[Field.OUTPUT]}
                onCurrencySelect={handleOutputSelect}
                otherCurrency={currencies[Field.INPUT]}
                showCommonBases={true}
                id="swap-currency-output"
              />
            </div>
          </AutoColumn>
        </Wrapper>
      </AppBody>
    </>
  );
}
