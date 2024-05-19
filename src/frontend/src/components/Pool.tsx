import { Plus } from "react-feather";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import styled from '@emotion/styled';
import LIQUIDITY_POSITION_ICON from '/images/inbox.svg';
import { ButtonLight, ButtonPrimary } from './Button';
import { AutoColumn } from './Column';
import { RowBetween, RowFixed } from './Row';
import { MEDIA_WIDTHS, Text } from "../theme";
import { useTheme } from "@emotion/react";
import { useAuth } from "@ic-reactor/react";
import useFetchPairList from "../hooks/useFetchPairList";
import { SwapPoolTabs } from "./NavigationTabs";
import Login from "./Login";
import PositionList from "./PositionList/PositionList";


const PageWrapper = styled(AutoColumn)`
  width: 100%;
`;

const TitleRow = styled(RowBetween)`
  ${MEDIA_WIDTHS.upToSmall} {
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  };
`;

const ButtonRow = styled(RowFixed)`
  gap: 8px;
  ${MEDIA_WIDTHS.upToSmall} {
    width: 100%;
    flex-direction: row-reverse;
    justify-content: space-between;
  };
`;

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  width: fit-content;
  ${MEDIA_WIDTHS.upToSmall} {
    width: 48%;
  };
`;

export const EmptyProposals = styled.div`
  border: 1px solid ${({ theme }) => theme.primary1};
  padding: 16px 12px;
  border-radius: 23px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

function BottomSection() {
  const theme = useTheme();

  return (
    <div className='flex flex-col justify-center items-center py-3 gap-[2px] bg-[#323038]'>
      <div className='flex gap-1'>
        <Text.body color={theme.white} fontSize={14}>
          Learn about providing liquidity
        </Text.body>
      </div>
      <Text.body
        color={'#ffffff80'}
        fontSize={12}
        fontWeight={500}
        textAlign={'center'}
        lineHeight={'18px'}
      >
        Check out BrownFi parameter concept
      </Text.body>
    </div>
  )
}

interface PoolDetails {
  id: number;
  tokenPay: string;
  tokenReceive: string;
  isActive: boolean;
  parameter: string;
  currentLP: string;
}

export default function Pool() {
  const theme = useTheme();
  const { authenticated } = useAuth();
  const [positions, setPositions] = useState<PoolDetails[]>([]);
  const loading = false;
  // const { call, data, error, loading } = useFetchPairList();

  useEffect(() => {
    setPositions([
      {
        id: 1,
        tokenPay: "PAY",
        tokenReceive: "REC",
        isActive: true,
        parameter: "23",
        currentLP: "2.333",
      },
      {
        id: 2,
        tokenPay: "TEST1",
        tokenReceive: "TEST2",
        isActive: true,
        parameter: "12",
        currentLP: "4.3",
      },
      {
        id: 1,
        tokenPay: "PAY",
        tokenReceive: "REC",
        isActive: true,
        parameter: "23",
        currentLP: "2.333",
      },
      {
        id: 2,
        tokenPay: "TEST1",
        tokenReceive: "TEST2",
        isActive: true,
        parameter: "12",
        currentLP: "4.3",
      },
      {
        id: 2,
        tokenPay: "TEST1",
        tokenReceive: "TEST2",
        isActive: true,
        parameter: "12",
        currentLP: "4.3",
      },
      {
        id: 1,
        tokenPay: "PAY",
        tokenReceive: "REC",
        isActive: true,
        parameter: "23",
        currentLP: "2.333",
      },
      {
        id: 2,
        tokenPay: "TEST1",
        tokenReceive: "TEST2",
        isActive: true,
        parameter: "12",
        currentLP: "4.3",
      },
      {
        id: 1,
        tokenPay: "PAY",
        tokenReceive: "REC",
        isActive: true,
        parameter: "23",
        currentLP: "2.333",
      },
    ])
    // call();
  }, [authenticated])

  return (
    <>
      <PageWrapper>
        <SwapPoolTabs active={"pool"} />
        <AutoColumn gap="lg" justify="center">
          <AutoColumn
            gap="md"
            style={{ width: "100%", justifyContent: "center" }}
          >
            {
              !authenticated ? (
                <div className="flex flex-col xl:w-[894px]">
                  <div className="flex flex-col bg-[#1D1C21] p-8 gap-8">
                    <div className="flex flex-col">
                      <Text.body
                        color={theme.white}
                        fontSize={24}
                        fontFamily={"Russo One"}
                      >
                        Pools
                      </Text.body>
                      <div className="flex flex-col gap-4 justify-center items-center">
                        <div className="flex flex-col gap-4 items-center max-w-[288px]">
                          <img
                            src={LIQUIDITY_POSITION_ICON}
                            alt=""
                            className="w-[100px] h-[100px]"
                          />
                          <Text.body
                            color={"#ffffff80"}
                            fontSize={16}
                            fontWeight={500}
                            textAlign={"center"}
                          >
                            Your active liquidity position will appear here.
                          </Text.body>
                          <Login asButton />
                        </div>
                      </div>
                    </div>
                  </div>
                  <BottomSection />
                </div>
              ) : (
                <>
                  <div className="flex flex-col xl:w-[894px]">
                    <div className="flex flex-col bg-[#1D1C21] p-8 gap-8">
                      <RowBetween>
                        <Text.body
                          color={theme.white}
                          fontSize={24}
                          fontFamily={"Russo One"}
                        >
                          Pools
                        </Text.body>
                        <Link to="/add/v2">
                          <div className="flex w-full justify-center">
                            {/* <ButtonLight href="/add/v2">
                              <Plus size="16" color={theme.white} /> &nbsp; New
                              Position
                            </ButtonLight> */}
                          </div>
                        </Link>
                      </RowBetween>
                      <div className="flex flex-col bg-[#323038]">
                        <RowBetween className="!py-3 !px-6">
                          <Text.body
                            color={theme.white}
                            fontSize={16}
                            fontWeight={700}
                          >
                            Your positions ({positions.length})
                          </Text.body>
                        </RowBetween>
                        <div className="w-full h-[1px] bg-[#4c4a4f]" />
                        {loading ? (
                          <div className="flex justify-center items-center w-full h-[100px]">
                          </div>
                        ) : (
                          <PositionList positions={positions}></PositionList>
                        )}
                      </div>
                    </div>
                    <BottomSection />
                  </div>
                </>
              )
            }
          </AutoColumn>
        </AutoColumn >
      </PageWrapper >
    </>
  );
}
