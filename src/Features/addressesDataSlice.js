import { createSlice } from '@reduxjs/toolkit'
import { api } from './routes';

export const addressesDataSlice = createSlice({
  name: 'addressesData',
  initialState: {
    data: [],
    dataIsLoading: true,
  },
  reducers: {
  },
  extraReducers: {


    [api.addresses.getAddresses.pending]: (state, action) => {
      state.dataIsLoading = true;
    },
    [api.addresses.getAddresses.fulfilled]: (state, action) => {
      state.data = action.payload;
      state.dataIsLoading = false;
    },
    [api.addresses.getAddresses.rejected]: (state, action) => {
      state.dataIsLoading = true;
    },

  }
})

export default addressesDataSlice.reducer;