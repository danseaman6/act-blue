import { Row, Column } from "./ui.ts";
import { Button, OutlinedInput } from "@mui/material";
import { styled } from "styled-components";
import { ChangeEvent } from "react";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const NumberInput = styled(OutlinedInput)`
  padding: 0;
  width: 90px;
  height: 70px;
  text-align: center;
  justify-content: center;
  border-radius: 0;
  background-color: #ffffff;
  border: 2px solid #797a7a;
  border-right: 1px solid #797a7a;

  .MuiOutlinedInput-notchedOutline {
    border: none;
  }
`;

const IncrementButton = styled(Button)`
  width: 40px;
  height: 35px;
  background-color: #ffffff;
  border-radius: 0;
  border: 1px solid #797a7a;
  border-top: 2px solid #797a7a;
  border-right: 2px solid #797a7a;
`;

const DecrementButton = styled(Button)`
  width: 40px;
  height: 35px;
  background-color: #ffffff;
  border-radius: 0;
  border: 1px solid #797a7a;
  border-bottom: 2px solid #797a7a;
  border-right: 2px solid #797a7a;
`;

export const CounterInput = ({
  value = 0,
  onChange,
}: {
  value?: number;
  onChange: (newVal: number) => void;
}) => {
  const onIncrement = () => {
    onChange && value !== undefined && onChange(value + 1);
  };

  const onDecrement = () => {
    onChange && value !== undefined && onChange(value - 1);
  };

  function handleChangeInput({
    target: { value: inputValue },
  }: ChangeEvent<HTMLInputElement>) {
    const isValidInteger = (input: string) => /^-?[0-9]+$/.test(input);

    if (isValidInteger(inputValue)) {
      let num = parseInt(inputValue);
      num = num < 0 ? 0 : num;

      onChange(num);
    }
  }

  return (
    <Row>
      <NumberInput value={value} onChange={handleChangeInput} />
      <Column>
        <IncrementButton onClick={onIncrement}>
          <ArrowDropUpIcon />
        </IncrementButton>
        <DecrementButton onClick={onDecrement}>
          <ArrowDropDownIcon />
        </DecrementButton>
      </Column>
    </Row>
  );
};
