import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const currentDate = new Date();

//initial state
const initialState = {
  Current_product_error: null,
  Current_products: [],
  Current_products_isLoading: false,
};

export const get_current = createSlice({
  name: "get_current",
  initialState,

  reducers: {
    //Get_information
    setCurrentDataStart(state) {
      state.Current_products_isLoading = true;
      state.Current_product_error = null;
    },
    setCurrentDataSuccess(state, action) {
      state.Current_products_isLoading = false;
      state.Current_products = action.payload;
    },
    set_CurrentDataFailure(state, action) {
      state.Current_products_isLoading = false;
      state.Current_product_error = action.payload;
    },
  },
});

export const {
  setCurrentDataStart,
  setCurrentDataSuccess,
  set_CurrentDataFailure,
} = get_current.actions;

//Fetching data
export const fetchCurrentProductData =
  (currentCompany, currentSpt) => async (dispatch) => {
    dispatch(setCurrentDataStart());

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
        "https://www.selleasep.shop/functions/sales/getalldaysaleswithcompanysptLast5.php/all_sales_days",
        {
          params: {
            date: formattedDate,
            company: currentCompany,
            spt: currentSpt,
          },
        }
      );
      dispatch(setCurrentDataSuccess(response.data));
    } catch (error) {
      dispatch(set_CurrentDataFailure(error.message));
    }
  };

export default get_current.reducer;
