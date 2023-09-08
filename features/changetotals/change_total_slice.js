import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const currentDate = new Date();

//initial state
const initialState = {
  error: null,
  Total_data: [],
  isLoading: false,
};

export const change_total_slice = createSlice({
  name: "change_total_slice",
  initialState,

  reducers: {
    //Get_information
    setDataStart(state) {
      state.isLoading = true;
      state.error = null;
    },
    setTotalDataSuccess(state, action) {
      state.isLoading = false;
      state.Total_data = action.payload;
    },
    setDataFailure(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const { setTotalDataSuccess, setDataStart, setDataFailure } =
  change_total_slice.actions;

//Fetching data
export const fetchTotalsData = (salesP) => async (dispatch) => {
  dispatch(setDataStart());

  const montly = currentDate.getMonth();
  const date = currentDate.getDate();
  const year = currentDate.getFullYear();

  const formattedDate =
    year +
    "-" +
    (montly + 1).toString().padStart(2, "0") +
    "-" +
    date.toString().padStart(2, "0");

  try {
    const response = await axios.get(
      "https://www.selleasep.shop/functions/sales/daytotalandcountspt.php/DaysTotal",
      {
        params: {
          date: formattedDate,
          spt: salesP,
        },
      }
    );
    dispatch(setTotalDataSuccess(response.data));
  } catch (error) {
    dispatch(setDataFailure(error.message));
  }
};

export default change_total_slice.reducer;
