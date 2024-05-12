import styled from "@emotion/styled";
import { MEDIA_WIDTHS } from "../theme";

export const HideSmall = styled.span`
  ${MEDIA_WIDTHS.upToSmall} {
    display: none;
  };
`;

export const HideMedium = styled.span`
  ${MEDIA_WIDTHS.upToMedium} {
    display: none;
  };
`;