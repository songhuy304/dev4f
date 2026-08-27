import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ReactNode } from 'react';
import { type RootState } from '..';

export type BreadcrumbItemType = {
  title: ReactNode;
  href?: string;
};

interface CommonState {
  subHeaders: BreadcrumbItemType[];
}

const initialState: CommonState = {
  subHeaders: [],
};

export const commonSlice = createSlice({
  name: 'common',
  reducers: {
    setSubHeaders: (state, action: PayloadAction<BreadcrumbItemType[]>) => {
      state.subHeaders = action.payload as typeof state.subHeaders;
    },
  },
  initialState,
});

export const { setSubHeaders } = commonSlice.actions;
export const selectSubHeaders = (state: RootState) => {
  return state.common.subHeaders;
};

export default commonSlice.reducer;
