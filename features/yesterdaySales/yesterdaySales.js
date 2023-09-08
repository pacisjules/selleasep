import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const currentDate = new Date();

//initial state
const initialState = {
  error: null,
  Total_data: [],
  YestisLoading: false,

  all_sale_error: null,
  all_sales: [],
  all_sales_isLoading: false,

};

export const yesterdaySales = createSlice({
  name: "yesterdaySales",
  initialState,

  reducers: {
    //Get Total_information
    setDataStartYest(state) {
      state.YestisLoading = true;
      state.error = null;
    },
    setTotalDataSuccessYest(state, action) {
      state.YestisLoading = false;
      state.Total_data = action.payload;
    },
    setDataFailureYest(state, action) {
      state.YestisLoading = false;
      state.error = action.payload;
    },


    //Get Sales_information
    set_all_salesDataStartYest(state) {
        state.all_sales_isLoading = true;
        state.all_sale_error = null;
      },
      set_all_saleDataSuccessYest(state, action) {
        state.all_sales_isLoading = false;
        state.all_sales = action.payload.sort((a, b) => new Date(b.Sales_time) - new Date(a.Sales_time));
      },
      set_all_salesDataFailureYest(state, action) {
        state.all_sales_isLoading = false;
        state.all_sale_error = action.payload;
      },

  },
});

export const { setDataStartYest, setTotalDataSuccessYest, setDataFailureYest, set_all_salesDataStartYest,set_all_saleDataSuccessYest, set_all_salesDataFailureYest } =
yesterdaySales.actions;


//Fetching data
export const fetchTotalsDataYesterDay = () => async (dispatch) => {
  dispatch(setDataStartYest());

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
          date: formattedDate,
          company: 5,
        },
      }
    );
    dispatch(setTotalDataSuccessYest(response.data));
  } catch (error) {
    dispatch(setDataFailureYest(error.message));
  }
};


// Fetching Yesterday
export const fetchAllSalesDataYesterDay = () => async (dispatch) => {
    dispatch(set_all_salesDataStartYest());
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
            date: formattedDate,
            company: 5,
          },
        }
      );
      dispatch(set_all_saleDataSuccessYest(response.data));
    } catch (error) {
      dispatch(set_all_salesDataFailureYest(error.message));
    }
  };

export default yesterdaySales.reducer;
