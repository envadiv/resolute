import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchDelegatorTotalRewards } from './distributionAPI';

const initialState = {
  delegatorRewards: {
    list: [],
    status: 'idle',
    errMsg: '',
    pagination: {},
  }

};

export const getDelegatorTotalRewards = createAsyncThunk(
  'distribution/totalRewards',
  async (data) => {
    const response = await fetchDelegatorTotalRewards(data.baseURL, data.address, data.key, data.limit);
    return response.data;
  }
);


export const bankSlice = createSlice({
  name: 'distribution',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDelegatorTotalRewards.pending, (state) => {
        state.delegatorRewards.status = 'loading';
        state.delegatorRewards.errMsg = ''
        state.delegatorRewards.list = []
        state.delegatorRewards.pagination = {}

      })
      .addCase(getDelegatorTotalRewards.fulfilled, (state, action) => {
        state.delegatorRewards.status = 'idle';
        state.delegatorRewards.list = action.payload.rewards
        state.delegatorRewards.pagination = action.payload.pagination
        state.delegatorRewards.errMsg = ''
      })
      .addCase(getDelegatorTotalRewards.rejected, (state, action) => {
        state.delegatorRewards.status = 'rejected';
        state.delegatorRewards.errMsg = action.error.message
      })

      
  },
});

export const { delegatorRewards } = bankSlice.actions;

export default bankSlice.reducer;
