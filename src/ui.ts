import { CSSProperties } from "react";
import styled from "styled-components";

type BaseProps = {
  alignItems?: CSSProperties["alignItems"];
  justifyContent?: CSSProperties["justifyContent"];
  gap?: CSSProperties["gap"];
  flex?: CSSProperties["flex"];
};

const Base = styled.div<BaseProps>`
  display: flex;
  ${(props) =>
    props.justifyContent && `justify-content: ${props.justifyContent};`};
  ${(props) => props.alignItems && `align-items: ${props.alignItems};`};
  ${(props) => props.gap && `gap: ${props.gap};`};
  ${(props) => props.flex && `flex: ${props.flex};`};
`;

export const Row = styled(Base)`
  flex-direction: row;
  width: 100%;
`;

export const Column = styled(Base)`
  flex-direction: column;
  align-items: ${({ alignItems }) => alignItems ?? "flex-start"};
`;
