import { Text } from "../../theme";
import styled from "@emotion/styled";
import { RowBetween, RowFixed } from "../Row";
import { GoDotFill } from "react-icons/go";
import { AutoColumn } from "../Column";
import { useTheme } from "@emotion/react";

const detail = {
  id: 1,
  tokenPay: "PAY",
  tokenReceive: "REC",
  isActive: true,
  parameter: "23",
  currentLP: "2.333",
  somenumber: "9472.08",
  othernumber: "14231.3",
};

const PageWrapper = styled(AutoColumn)`
width: 100%;
`;

export default function PositionDetail() {
  const theme = useTheme();

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
                    href="#/pool"
                    style={{
                      color: "white",
                      fontSize: "24px",
                      fontFamily: "Russo One",
                    }}
                  >
                    &lt;
                  </a>
                  <Text.body
                    color={theme.white}
                    fontSize={24}
                    fontFamily={"Russo One"}
                  >
                    Back to Pools
                  </Text.body>
                </div>
                <div className="flex flex-col gap-4">
                  <RowBetween>
                    <div className="flex row gap-3">
                      <Text.body
                        className="flex gap-2"
                        color={theme.white}
                        fontSize={16}
                        fontWeight={700}
                      >
                        {detail?.tokenPay}/{detail?.tokenReceive}
                      </Text.body>
                      <div className="h-6 flex justify-center items-center bg-[#314243] px-2 gap-1">
                        <GoDotFill color={theme.green2} size={14} />
                        <Text.body
                          className="flex gap-1"
                          color={theme.green2}
                          fontSize={14}
                          fontWeight={500}
                        >
                          Active
                        </Text.body>
                      </div>
                    </div>
                    <div className="h-6 flex justify-center items-center bg-[#773030] px-2 cursor-pointer">
                      <Text.body
                        color={theme.white}
                        fontSize={12}
                        fontWeight={700}
                      >
                        Remove
                      </Text.body>
                    </div>
                  </RowBetween>
                  <div>
                    <div className="h-6 flex items-center gap-10">
                      <Text.body
                        className="flex gap-2"
                        color={theme.white}
                        fontSize={14}
                        fontWeight={500}
                      >
                        Parameter:
                      </Text.body>
                      <Text.body
                        color={theme.white}
                        fontSize={14}
                        fontWeight={500}
                      >
                        --
                      </Text.body>
                    </div>
                    <div className="h-6 flex items-center gap-10">
                      <Text.body
                        className="flex gap-2"
                        color={theme.white}
                        fontSize={14}
                        fontWeight={500}
                      >
                        Current LP price: --
                      </Text.body>
                    </div>
                  </div>
                  <div className="flex flex-col bg-[#323038]">
                    <RowBetween className="!py-3 !px-6">
                      <Text.body
                        color={theme.white}
                        fontSize={16}
                        fontWeight={500}
                      >
                        Liquidity
                      </Text.body>
                      <div className="h-6 flex justify-center items-center bg-[#1E1E1E] px-2 cursor-pointer">
                        <Text.body
                          color={theme.white}
                          fontSize={12}
                          fontWeight={700}
                        >
                          Increase liquidity
                        </Text.body>
                      </div>
                    </RowBetween>
                    <div className="flex flex-col pb-3 px-6 gap-2">
                      <Text.body
                        fontSize={32}
                        fontWeight={600}
                        color={theme.white}
                      >
                        $ --
                      </Text.body>

                      <RowBetween>
                        <div className="flex flex-row gap-5">
                          <img
                            src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
                            alt="token icon"
                            width="40px"
                          />
                          <Text.body
                            color={theme.white}
                            fontSize={16}
                            fontWeight={500}
                          >
                            {detail?.tokenPay}
                          </Text.body>
                        </div>
                        <div className="flex gap-6">
                          {detail ? (
                            <RowFixed>
                              <Text.body
                                color={theme.white}
                                fontSize={14}
                                fontWeight={500}
                              >
                                {detail?.somenumber}
                              </Text.body>
                            </RowFixed>
                          ) : (
                            "-"
                          )}
                          <Text.body
                            color={theme.white}
                            fontSize={14}
                            fontWeight={500}
                          >
                            -- %
                          </Text.body>
                        </div>
                      </RowBetween>
                      <RowBetween>
                        <div className="flex flex-row gap-5">
                          <img
                            src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
                            alt="token icon"
                            width="40px"
                          />
                          <Text.body
                            color={theme.white}
                            fontSize={16}
                            fontWeight={500}
                          >
                            {detail?.tokenReceive}
                          </Text.body>
                        </div>
                        <div className="flex gap-6">
                          {detail ? (
                            <RowFixed>
                              <Text.body
                                color={theme.white}
                                fontSize={14}
                                fontWeight={500}
                              >
                                {detail?.othernumber}
                              </Text.body>
                            </RowFixed>
                          ) : (
                            "-"
                          )}
                          <Text.body
                            color={theme.white}
                            fontSize={14}
                            fontWeight={500}
                          >
                            -- %
                          </Text.body>
                        </div>
                      </RowBetween>
                    </div>
                  </div>
                  <div className="flex flex-col bg-[#323038]">
                    <div className="!py-3 !px-6">
                      <Text.body
                        color={theme.white}
                        fontSize={16}
                        fontWeight={500}
                      >
                        Accrued fee
                      </Text.body>
                    </div>
                    <div className="flex flex-col pb-3 px-6 gap-2">
                      <Text.body
                        fontSize={32}
                        fontWeight={600}
                        color={theme.white}
                      >
                        $ --
                      </Text.body>

                      <RowBetween>
                        <div className="flex flex-row gap-5">
                          <img
                            src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
                            alt="token icon"
                            width="40px"
                          />
                          <Text.body
                            color={theme.white}
                            fontSize={16}
                            fontWeight={500}
                          >
                            {detail?.tokenPay}
                          </Text.body>
                        </div>
                        <Text.body
                          color={theme.white}
                          fontSize={14}
                          fontWeight={500}
                        >
                          {"--"}
                        </Text.body>
                      </RowBetween>
                      <RowBetween>
                        <div className="flex flex-row gap-5">
                          <img
                            src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
                            alt="token icon"
                            width="40px"
                          />
                          <Text.body
                            color={theme.white}
                            fontSize={16}
                            fontWeight={500}
                          >
                            {detail?.tokenReceive}
                          </Text.body>
                        </div>
                        <Text.body
                          color={theme.white}
                          fontSize={14}
                          fontWeight={500}
                        >
                          {"--"}
                        </Text.body>
                      </RowBetween>
                    </div>
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
