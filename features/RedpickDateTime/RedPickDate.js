import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const currentDate = new Date();

//initial state
const initialState = {
  DateError: null,
  DateTotal_data: [],
  DateIsLoading: false,

  all_sale_error: null,
  all_sales: [],
  all_sales_isLoading: false,

};

export const RedPickDate = createSlice({
  name: "RedPickDate",
  initialState,

  reducers: {
    //Get Total_information
    setDataStartDate(state) {
      state.DateIsLoading = true;
      state.DateError = null;
    },
    setTotalDataSuccessDate(state, action) {
      state.DateIsLoading = false;
      state.DateTotal_data = action.payload;
    },
    setDataFailureDate(state, action) {
      state.DateIsLoading = false;
      state.DateError = action.payload;
    },


    //Get Sales_information
    set_all_salesDataStartDate(state) {
        state.all_sales_isLoading = true;
        state.all_sale_error = null;
      },
      set_all_saleDataSuccessDate(state, action) {
        state.all_sales_isLoading = false;
        state.all_sales = action.payload.sort((a, b) => new Date(b.Sales_time) - new Date(a.Sales_time));
      },
      set_all_salesDataFailureDate(state, action) {
        state.all_sales_isLoading = false;
        state.all_sale_error = action.payload;
      },

  },
});

export const { setDataStartDate, setTotalDataSuccessDate, setDataFailureDate, set_all_salesDataStartDate,set_all_saleDataSuccessDate, set_all_salesDataFailureDate } =
RedPickDate.actions;


//Fetching data
export const fetchTotalsDataDate = (dating) => async (dispatch) => {
  dispatch(setDataStartDate());

  const montly = currentDate.getMonth();
  const date = currentDate.getDate()-1;
  const year = currentDate.getFullYear();

  const formattedDate =
    year +
    "-" +
    (montly + 1).toString().padStart(2, "0") +
    "-" +
    date.toString().padStart(2, "0");

  try {
    const response = await axios.get(
      "https://www.selleasep.shop/maincondition.php/all_sales_totals",
      {
        params: {
          date: dating,
          company: 5,
        },
      }
    );
    dispatch(setTotalDataSuccessDate(response.data));
  } catch (error) {
    dispatch(setDataFailureDate(error.message));
  }
};


// Fetching Yesterday
export const fetchAllSalesDataDate = (dating) => async (dispatch) => {
    dispatch(set_all_salesDataStartDate());
    const montly = currentDate.getMonth();
    const date = currentDate.getDate()-1;
    const year = currentDate.getFullYear();
  
    const formattedDate =
      year +
      "-" +
      (montly + 1).toString().padStart(2, "0") +
      "-" +
      date.toString().padStart(2, "0");
  
    try {
      const response = await axios.get(
        "https://www.selleasep.shop/maincondition.php/all_sales_days",
        {
          params: {
            date: dating,
            company: 5,
          },
        }
      );
      dispatch(set_all_saleDataSuccessDate(response.data));
    } catch (error) {
      dispatch(set_all_salesDataFailureDate(error.message));
    }
  };

export default RedPickDate.reducer;
