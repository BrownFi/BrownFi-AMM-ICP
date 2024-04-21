import { styled } from "styled-components";

export const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToSmall` 
    display: none;
  `};
`;

export const HideMedium = styled.span`
  ${({ theme }) => theme.mediaWidth.upToMedium` 
    display: none;
  `};
`;