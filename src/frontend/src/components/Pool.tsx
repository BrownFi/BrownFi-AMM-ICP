import { Plus } from "react-feather";
import { Link } from "react-router-dom";

import styled, { useTheme } from 'styled-components';
import LIQUIDITY_POSITION_ICON from '/images/inbox.svg';
import { ButtonLight, ButtonPrimary } from './Button';
import { AutoColumn } from './Column';
import { SwapPoolTabs } from './NavigationTabs';
import { RowBetween, RowFixed } from './Row';
import { TYPE } from '../theme';
import Login from './Login';
import PositionList from "./PositionList/PositionList";
import { CoreActorProvider } from "../hooks/coreActor";
import { usePositions } from "../hooks/usePositions";

const PageWrapper = styled(AutoColumn)`
  width: 100%;
`;

const TitleRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`;

const ButtonRow = styled(RowFixed)`
  gap: 8px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100%;
    flex-direction: row-reverse;
    justify-content: space-between;
  `};
`;

const ResponsiveButtonPrimary = styled(ButtonPrimary)`
  width: fit-content;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 48%;
  `};
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
        <TYPE.body color={theme.white} fontSize={'14px'}>
          Learn about providing liquidity
        </TYPE.body>
      </div>
      <TYPE.body
        color={'#ffffff80'}
        fontSize={'12px'}
        fontWeight={500}
        textAlign={'center'}
        lineHeight={'18px'}
      >
        Check out BrownFi parameter concept
      </TYPE.body>
    </div>
  )
}

function Pool() {
  const theme = useTheme();
  const { authenticated, positions, error, loading } = usePositions();

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
                      <TYPE.body
                        color={theme.white}
                        fontSize={"24px"}
                        fontFamily={"Russo One"}
                      >
                        Pools
                      </TYPE.body>
                      <div className="flex flex-col gap-4 justify-center items-center">
                        <div className="flex flex-col gap-4 items-center max-w-[288px]">
                          <img
                            src={LIQUIDITY_POSITION_ICON}
                            alt=""
                            className="w-[100px] h-[100px]"
                          />
                          <TYPE.body
                            color={"#ffffff80"}
                            fontSize={"16x"}
                            fontWeight={500}
                            textAlign={"center"}
                          >
                            Your active liquidity position will appear here.
                          </TYPE.body>
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
                        <TYPE.body
                          color={theme.white}
                          fontSize={"24px"}
                          fontFamily={"Russo One"}
                        >
                          Pools
                        </TYPE.body>
                        <Link to="/add/v2">
                          <div className="flex w-full justify-center">
                            <ButtonLight maxWidth={"436px"} href="/add/v2">
                              <Plus size="16" color={theme.white} /> &nbsp; New
                              Position
                            </ButtonLight>
                          </div>
                        </Link>
                      </RowBetween>
                      <div className="flex flex-col bg-[#323038]">
                        <RowBetween className="!py-3 !px-6">
                          <TYPE.body
                            color={theme.white}
                            fontSize={16}
                            fontWeight={700}
                          >
                            Your positions ({positions.length})
                          </TYPE.body>
                        </RowBetween>
                        <div className="w-full h-[1px] bg-[#4c4a4f]" />
                        <PositionList positions={positions}></PositionList>
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

export default function WrappedPool() {
  return (
    <CoreActorProvider
      canisterId={import.meta.env.CANISTER_ID_CORE}
      loadingComponent={<div>Loading Core Agent ...</div>}
    >
      <Pool />
    </CoreActorProvider>
  )
}