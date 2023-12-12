import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ContextMenuType, PositionCoords } from '../Models';

const initialState = {
  isVisible: false,
  currentMenu: "",
  menuPosition: { xpos: 0, ypos: 0 }
};

export const ContextMenuSlice = createSlice({
  name: 'ContextMenu',
  initialState,
  reducers: {
    setIsVisible(state, action: PayloadAction<boolean>) {
      state.isVisible = action.payload;
    },
    setCurrentMenu(state, action: PayloadAction<ContextMenuType>) {
      state.currentMenu = action.payload;
    },
    setMenuCoords(state, action: PayloadAction<PositionCoords>) {
      state.menuPosition = action.payload;
    }
  }
});

export const SelectIsVisible = (state: any) => state.ContextMenu.isVisible;
export const SelectCurrentMenu = (state: any): ContextMenuType => state.ContextMenu.currentMenu;
export const SelectMenuCoords = (state: any) => state.ContextMenu.menuPosition;
export const {
  setIsVisible,
  setCurrentMenu,
  setMenuCoords
} = ContextMenuSlice.actions;

export const { reducer } = ContextMenuSlice;