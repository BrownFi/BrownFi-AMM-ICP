import styled from "@emotion/styled";
import { ReactNode } from "react";
import type * as CSS from 'csstype';

export const RowWrapper = ({ children, ...props }: { children?: ReactNode} & CSS.Properties & React.ButtonHTMLAttributes<HTMLDivElement>) => {
  return <div style={props}> {children} </div>;
}

const Row = styled(RowWrapper)<{
  width?: string;
  align?: string;
  justify?: string;
  padding?: string;
  border?: string;
  borderRadius?: string;
}>`
  width: ${({ width }) => width ?? "100%"};
  display: flex;
  align-items: ${({ align }) => align ?? "center"};
  justify-content: ${({ justify }) => justify ?? "flex-start"};
  padding: ${({ padding }) => padding ?? "0"};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`;

export const RowBetween = styled(Row)`
  justify-content: space-between;
`;

export const RowFlat = styled.div`
  display: flex;
  align-items: flex-end;
`;

export const AutoRow = styled(Row)<{ gap?: string; justify?: string }>`
  flex-wrap: wrap;
  margin: ${({ gap }) => gap && `-${gap}`};
  justify-content: ${({ justify }) => justify && justify};

  & > * {
    margin: ${({ gap }) => gap} !important;
  }
`;

export const RowFixed = styled(Row)<{ gap?: string; justify?: string }>`
  width: fit-content;
  margin: ${({ gap }) => gap && `-${gap}`};
`;

export const ResponsiveRow = styled.div<{
  breakpoint?: "xs" | "sm" | "md" | "lg";
  rowAlignment?: "center" | "flex-start" | "flex-end" | string;
}>`
  display: flex;
  flex-direction: row;
  align-items: ${({ rowAlignment }) => rowAlignment || "center"};
  justify-content: initial;
`;
  // ${({ theme, breakpoint, rowAlignment }) =>
  //   ((breakpoint === "sm" && theme.mediaWidth.upToSmall) ||
  //     (breakpoint === "md" && theme.mediaWidth.upToMedium) ||
  //     (breakpoint === "lg" && theme.mediaWidth.upToLarge) ||
  //     theme.mediaWidth.upToExtraSmall)`
  //   flex-direction: column;
  //   justify-content: ${rowAlignment || "center"};
  //   align-items: initial;
  // `};


export default Row;
