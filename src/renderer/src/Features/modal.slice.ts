import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  isVisible: false,
  currentModal: "",
};

export const ModalsSlice = createSlice({
  name: "Modals",
  initialState,
  reducers: {
    setModalIsVisible(state, action: PayloadAction<boolean>) {
      // Set the visibility of the modal
      state.isVisible = action.payload;
    },
    setCurrentModal(state, action: PayloadAction<string>) {
      // Set the current modal to be displayed
      state.currentModal = action.payload;
    },
  },
});

export const SelectIsVisible = (state: any) => state.Modals.isVisible;
export const SelectCurrentModal = (state: any) => state.Modals.currentModal;

export const { setModalIsVisible, setCurrentModal } = ModalsSlice.actions;
export const { reducer } = ModalsSlice;
