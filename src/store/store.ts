import { create } from "zustand";

type State = {
  tickets: string;
};

const initialState: State = {
  tickets: "hi",
};

export const [useStore, api] = create<State>(() => initialState);

const { setState, getState } = api;

export const actions = {};
