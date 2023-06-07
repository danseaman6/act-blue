// // Mostly derived from https://github.com/jacobworrel/react-counter-input/blob/master/src/CounterInput.js
//
// import { DisplayField } from "components/FormFields";
// import { ReactComponent as MinusIcon } from "images/icons/minus.svg";
// import { ReactComponent as PlusIcon } from "images/icons/plus.svg";
// import React, { ChangeEvent } from "react";
// import styled from "styled-components";
// import { InlineRow } from "ui";
// import Input from ".";
// import SmallCircleButton from "../SmallCircleButton";
//
// const CounterRow = styled(InlineRow)`
//   & > *:not(:last-child) {
//     margin-right: 12px;
//   }
// `;
//
// const NumberInput = styled(Input)`
//   padding: 0;
//   width: 36px;
//   height: 36px;
//
//   text-align: center;
// `;
//
// function CounterInput({
//   count = 0,
//   min = -Infinity,
//   max = Infinity,
//   onCountChange,
//   disabled = false,
//   readonly = false,
//   className,
// }: {
//   count?: null | number;
//   min?: number;
//   max?: number;
//   onCountChange: (newVal: number) => void;
//   disabled?: boolean;
//   readonly?: boolean;
//   className?: string;
// }) {
//   const countVal = count ?? 0;
//
//   const [inputValue, setInputValue] = React.useState("");
//   const setInputToCount = () => setInputValue((countVal ?? "").toString());
//
//   React.useEffect(setInputToCount, [countVal]);
//
//   function decrement() {
//     if (countVal <= min) return;
//
//     onCountChange(countVal - 1);
//   }
//
//   function increment() {
//     if (countVal >= max) return;
//
//     onCountChange(countVal + 1);
//   }
//
//   function handleChangeInput({
//     target: { value: inputValue },
//   }: ChangeEvent<HTMLInputElement>) {
//     const isValidInteger = (input: string) => /^-?[0-9]+$/.test(input);
//     const isPartialInteger = (input: string) =>
//       input === "" || input === "-" || isValidInteger(input);
//
//     if (isValidInteger(inputValue)) {
//       let num = parseInt(inputValue);
//       num = num > max ? max : num;
//       num = num < min ? min : num;
//
//       onCountChange(num);
//       setInputValue(num.toString()); // if the erase and re-type "1"
//     } else if (isPartialInteger(inputValue)) {
//       setInputValue(inputValue);
//     }
//   }
//
//   return (
//     <CounterRow alignItems="center" className={className}>
//       {!disabled && (
//         <SmallCircleButton onClick={decrement}>
//           <MinusIcon />
//         </SmallCircleButton>
//       )}
//       <NumberInput
//         disabled={disabled}
//         type="text"
//         value={inputValue}
//         onBlur={setInputToCount}
//         onChange={handleChangeInput}
//       />
//       {!disabled && (
//         <SmallCircleButton onClick={increment}>
//           <PlusIcon />
//         </SmallCircleButton>
//       )}
//     </CounterRow>
//   );
// }
//
// export default CounterInput;
