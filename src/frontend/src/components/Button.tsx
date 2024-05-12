import styled from "@emotion/styled";
import { darken } from "polished";
import { Button as RebassButton, ButtonProps } from "@rebass/emotion";

const Base = styled(RebassButton)<{
  padding?: string;
  width?: string;
  borderRadius?: string;
  altDisabledStyle?: boolean;
}>`
  padding: ${({ padding }) => (padding ? padding : "16px")};
  width: ${({ width }) => (width ? width : "100%")};
  font-weight: 700;
  font-family: 'Montserrat';
  font-size: 16px;
  text-align: center;
  outline: none;
  color: ${({ theme }) => theme.text2};
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  border-radius: 0px;
  z-index: 1;
  &:disabled {
    cursor: auto;
    pointer-events: none;
  }

  will-change: transform;
  transition: transform 450ms ease;
  transform: perspective(1px) translateZ(0);

  &:hover {
    transform: scale(0.99);
  }

  > * {
    user-select: none;
  }

  > a {
    text-decoration: none;
  }
`;

export const ButtonPrimary = styled(Base)`
  background: ${({ theme }) => theme.red2};
  color: ${({ theme }) => theme.text1};
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.red2)};
    background-color: ${({ theme }) => darken(0.05, theme.red2)};
  }
  &:hover {
    background: ${({ theme }) => theme.red2};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.red2)};
    background-color: ${({ theme }) => darken(0.1, theme.red2)};
  }
  &:disabled {
    background-color: ${({ theme }) => theme.primary3};
    color: ${({ theme }) => theme.text2};
    cursor: auto;
    box-shadow: none;
    outline: none;
    border: 1px solid ${({ theme }) => theme.primary3};
    opacity: 0.4;
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? "0.5" : "0.4")};
  }
`;

export const ButtonLight = styled(Base)`
  background-color: ${({ theme }) => theme.red2};
  color: ${({ theme }) => theme.text1};
  font-size: 16px;
  font-weight: 500;
  :disabled {
    opacity: 0.4;
    :hover {
      cursor: auto;
      background-color: ${({ theme }) => theme.red2};
      box-shadow: none;
      border: 1px solid transparent;
      outline: none;
    }
  }
`;

export const ButtonGray = styled(Base)`
  background-color: ${({ theme }) => theme.bg0};
  color: ${({ theme }) => theme.primary1};
  font-size: 16px;
  font-weight: 500;
`;

export const ButtonSecondary = styled(Base)`
  border: 1px solid ${({ theme }) => theme.primary1};
  color: ${({ theme }) => theme.primary1};
  background-color: transparent;
  font-size: 16px;
  padding: ${({ padding }) => (padding ? padding : "10px")};
`;

export const ButtonPink = styled(Base)`
  background-color: ${({ theme }) => theme.primary1};
  color: white;
`;

export const ButtonUNIGradient = styled(ButtonPrimary)`
  color: white;
  padding: 4px 8px;
  height: 36px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.bg3};
  background: radial-gradient(174.47% 188.91% at 1.84% 0%, #ff007a 0%, #2172e5 100%), #edeef2;
  width: fit-content;
  position: relative;
  cursor: pointer;
  border: none;
  white-space: no-wrap;
  :hover {
    opacity: 0.8;
  }
  :active {
    opacity: 0.9;
  }
`;

export const ButtonOutlined = styled(Base)`
  background-color: transparent;
  color: ${({ theme }) => theme.primary1};

  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`;

export const ButtonEmpty = styled(Base)`
  background-color: transparent;
  color: ${({ theme }) => theme.primary1};
  background: ${({ theme }) => theme.bg0};
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus {
    text-decoration: underline;
  }
  &:hover {
    text-decoration: none;
  }
  &:active {
    text-decoration: none;
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`;

export const ButtonText = styled(Base)`
  padding: 0;
  width: fit-content;
  background: none;
  text-decoration: none;
  &:focus {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    text-decoration: underline;
  }
  &:hover {
    // text-decoration: underline;
    opacity: 0.9;
  }
  &:active {
    text-decoration: underline;
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`;

export const ButtonWhite = styled(Base)`
  border: 1px solid #edeef2;
  background-color: ${({ theme }) => theme.bg0};
  color: black;

  &:focus {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    box-shadow: 0 0 0 1pt ${darken(0.05, "#edeef2")};
  }
  &:hover {
    box-shadow: 0 0 0 1pt ${darken(0.1, "#edeef2")};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${darken(0.1, "#edeef2")};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`;

const ButtonConfirmedStyle = styled(Base)`
  background-color: ${({ theme }) => theme.red2};
  color: ${({ theme }) => theme.text1};

  &:disabled {
    opacity: 50%;
    background-color: ${({ theme }) => theme.red2};
    color: ${({ theme }) => theme.text1};
    cursor: auto;
  }
`;

const ButtonErrorStyle = styled(Base)`
  background-color: ${({ theme }) => theme.red2};
  color: ${({ theme }) => theme.text1};
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.red2)};
    background-color: ${({ theme }) => darken(0.05, theme.red2)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.red2)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.red2)};
    background-color: ${({ theme }) => darken(0.1, theme.red2)};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
    box-shadow: none;
    background-color: ${({ theme }) => theme.red2};
    border: 1px solid ${({ theme }) => theme.red2};
  }
`;

export function ButtonConfirmed({
  confirmed,
  altDisabledStyle,
  ...rest
}: { confirmed?: boolean; altDisabledStyle?: boolean } & ButtonProps) {
  if (confirmed) {
    return <ButtonConfirmedStyle {...rest} />;
  } else {
    return <ButtonPrimary {...rest} altDisabledStyle={altDisabledStyle} />;
  }
}

export function ButtonError({
  error,
  ...rest
}: { error?: boolean } & ButtonProps) {
  if (error) {
    return <ButtonErrorStyle {...rest} />;
  } else {
    return <ButtonPrimary {...rest} />;
  }
}

export function ButtonRadio({
  active,
  ...rest
}: { active?: boolean } & ButtonProps) {
  if (!active) {
    return <ButtonWhite {...rest} />;
  } else {
    return <ButtonPrimary {...rest} />;
  }
}

const ActiveOutlined = styled(ButtonOutlined)`
  border: 1px solid;
  border-color: ${({ theme }) => theme.primary1};
`;

const Circle = styled.div`
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primary1};
  display: flex;
  align-items: center;
  justify-content: center;
`;
