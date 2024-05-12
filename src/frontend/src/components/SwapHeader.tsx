import styled from '@emotion/styled';

import { TYPE } from '../theme';
import { RowBetween, RowFixed } from './Row';
import { useTheme } from '@emotion/react';

const StyledSwapHeader = styled.div`
  padding: 26px 25px 5px;
  width: 100%;
  color: ${({ theme }) => theme.primary1};
`;
const Box = styled.div`
  height: 40px;
  width: 40px;
  background: ${({ theme }) => theme.red2};
  display: flex;
  align-items: center;
  justify-content: center;
`;
export default function SwapHeader() {
  const theme = useTheme();
  return (
    <StyledSwapHeader>
      <RowBetween>
        <RowFixed>
          <TYPE.body fontFamily={'Russo One'} fontSize={24} color={theme.text1} style={{ marginRight: '8px' }}>
            Swap Token
          </TYPE.body>
        </RowFixed>

      </RowBetween>
    </StyledSwapHeader>
  );
}
