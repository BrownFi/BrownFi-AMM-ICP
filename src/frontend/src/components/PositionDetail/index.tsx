import { TYPE } from "../../theme";
import styled, { useTheme } from "styled-components";
import { RowBetween } from "../Row";
import { GoDotFill } from "react-icons/go";
import { Button } from "rebass";
import { AutoColumn } from "../Column";

const detail = {
  id: 1,
  tokenPay: "PAY",
  tokenReceive: "REC",
  isActive: true,
  parameter: "23",
  currentLP: "2.333",
};

export default function PositionDetail() {
  const theme = useTheme();
  const PageWrapper = styled(AutoColumn)`
    width: 100%;
  `;
  return (
    <PageWrapper>
      <AutoColumn gap="lg" justify="center">
        <AutoColumn
          gap="md"
          style={{ width: "100%", justifyContent: "center" }}
        >
          <div className="flex flex-col xl:w-[894px]">
            <div className="flex flex-col bg-[#1D1C21] p-8 gap-8">
              <div className="flex flex-col gap-8">
                <div className="flex row gap-3">
                  <a
                    href="#/swap"
                    style={{
                      color: "white",
                      fontSize: "24px",
                      fontFamily: "Russo One",
                    }}
                  >
                    &lt;
                  </a>
                  <TYPE.body
                    color={theme.white}
                    fontSize={"24px"}
                    fontFamily={"Russo One"}
                  >
                    Back to Pools
                  </TYPE.body>
                </div>
                <div className="flex flex-col gap-4">
                  <RowBetween>
                    <div className="flex row gap-3">
                      <TYPE.body
                        className="flex gap-2"
                        color={theme.white}
                        fontSize={16}
                        fontWeight={700}
                      >
                        {detail?.tokenPay}/{detail?.tokenReceive}
                      </TYPE.body>
                      <div className="h-6 flex justify-center items-center bg-[#314243] px-2 gap-1">
                        <GoDotFill color={theme.green2} size={14} />
                        <TYPE.body
                          className="flex gap-1"
                          color={theme.green2}
                          fontSize={14}
                          fontWeight={500}
                        >
                          Active
                        </TYPE.body>
                      </div>
                    </div>
                    <div className="h-6 flex justify-center items-center bg-[#773030] px-2 cursor-pointer">
                      <TYPE.body
                        color={theme.white}
                        fontSize={12}
                        fontWeight={700}
                      >
                        Remove
                      </TYPE.body>
                    </div>
                  </RowBetween>
                  <div>
                    <div className="h-6 flex items-center gap-10">
                      <TYPE.body
                        className="flex gap-2"
                        color={theme.white}
                        fontSize={14}
                        fontWeight={500}
                      >
                        Parameter:
                      </TYPE.body>
                      <TYPE.body
                        color={theme.white}
                        fontSize={14}
                        fontWeight={500}
                      >
                        --
                      </TYPE.body>
                    </div>
                    <div className="h-6 flex items-center gap-10">
                      <TYPE.body
                        className="flex gap-2"
                        color={theme.white}
                        fontSize={14}
                        fontWeight={500}
                      >
                        Current LP price: --
                      </TYPE.body>
                    </div>
                  </div>
                  <div className="flex flex=col bg-[#323038]">
                    <RowBetween className="!py-3 !px-6">
                      <TYPE.body
                        color={theme.white}
                        fontSize={16}
                        fontWeight={500}
                      >
                        Liquidity
                      </TYPE.body>
                      {/* <ClickableText
                        fontWeight={700}
                        fontSize={12}
                        color={theme.white}
                        backgroundColor={"rgba(30, 30, 30, 1)"}
                        padding={"3px 19px"}
                        height={"24px"}
                      >
                        Increase liquidity
                      </ClickableText> */}
                    </RowBetween>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AutoColumn>
      </AutoColumn>
    </PageWrapper>
  );
}
