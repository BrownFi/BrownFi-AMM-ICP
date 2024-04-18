import { Plus } from 'react-feather';
import { Link } from 'react-router-dom';

import styled, { ThemeContext, useTheme } from 'styled-components';
import LIQUIDITY_POSITION_ICON from '/images/inbox.svg';
import { ButtonLight, ButtonPrimary } from './Button';
import { AutoColumn } from './Column';
import { SwapPoolTabs } from './NavigationTabs';
import { RowBetween, RowFixed } from './Row';
import { TYPE } from '../theme';
import Login from './Login';
import { useAuth } from '@ic-reactor/react';

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

export default function Pool() {
  const theme = useTheme();
  const { authenticated } = useAuth();

  return (
    <>
      <PageWrapper>
        <SwapPoolTabs active={'pool'} />
        <AutoColumn gap='lg' justify='center'>
          <AutoColumn gap='md' style={{ width: '100%', justifyContent: 'center' }}>
            <div className='flex flex-col xl:w-[894px]'>
              <div className='flex flex-col bg-[#1D1C21] p-8 gap-8'>
                <div className='flex flex-col'>
                  <TYPE.body color={theme.white} fontSize={'24px'} fontFamily={'Russo One'}>
                    Pools
                  </TYPE.body>
                  {
                    authenticated ? (
                      <div className='flex flex-col gap-4 justify-center items-center'>
                        <div className='flex flex-col gap-4 items-center max-w-[288px]'>
                          <img src={LIQUIDITY_POSITION_ICON} alt='' className='w-[100px] h-[100px]' />
                          <TYPE.body color={'#ffffff80'} fontSize={'16x'} fontWeight={500} textAlign={'center'}>
                            RENDER YOUR POSITION HERE BRO
                          </TYPE.body>
                        </div>
                      </div>
                    ) : (
                      <div className='flex flex-col gap-4 justify-center items-center'>
                        <div className='flex flex-col gap-4 items-center max-w-[288px]'>
                          <img src={LIQUIDITY_POSITION_ICON} alt='' className='w-[100px] h-[100px]' />
                          <TYPE.body color={'#ffffff80'} fontSize={'16x'} fontWeight={500} textAlign={'center'}>
                            Your active liquidity position will appear here.
                          </TYPE.body>
                          <Login asButton />
                        </div>
                      </div>
                    )
                  }
                </div>
              </div>
              <BottomSection />
            </div>
          </AutoColumn>
        </AutoColumn >
      </PageWrapper >
    </>
  );
}
