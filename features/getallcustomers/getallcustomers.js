import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const currentDate = new Date();
//initial state
const initialState = {
  all_customers_error: null,
  all_customers: [],
  all_customers_isLoading: false,

  all_customersHistory_error: null,
  all_customersHistory: [],
  all_customersHistory_isLoading: false,

  all_customersAlert_error: null,
  all_customersAlert: [],
  all_customersAlert_isLoading: false,
};

export const getallcustomers = createSlice({
  name: "getallcustomers",
  initialState,

  reducers: {
    //Get_information
    set_allCustomersDataStart(state) {
      state.all_customers_isLoading = true;
      state.all_customers_error = null;
    },
    set_allCustomersDataSuccess(state, action) {
      state.all_customers_isLoading = false;
      state.all_customers = action.payload.sort(
        (a, b) => new Date(b.Sales_time) - new Date(a.Sales_time)
      );
    },
    set_allCustomersDataFailure(state, action) {
      state.all_customers_isLoading = false;
      state.all_customers_error = action.payload;
    },



    //Get_History_information
    set_allCustomersHistoryDataStart(state) {
      state.all_customersHistory_isLoading = true;
      state.all_customersHistory_error = null;
    },
    set_allCustomersHistoryDataSuccess(state, action) {
      state.all_customersHistory_isLoading = false;
      state.all_customersHistory = action.payload.sort(
        (a, b) => new Date(b.Sales_time) - new Date(a.Sales_time)
      );
    },
    set_allCustomersHistoryDataFailure(state, action) {
      state.all_customersHistory_isLoading = false;
      state.all_customersHistory_error = action.payload;
    },



        //Get_Alert_information
        set_allCustomersAlertDataStart(state) {
          state.all_customersAlert_isLoading = true;
          state.all_customersAlert_error = null;
        },
        set_allCustomersAlertDataSuccess(state, action) {
          state.all_customersAlert_isLoading = false;
          state.all_customersAlert = action.payload.sort(
            (a, b) => new Date(b.Sales_time) - new Date(a.Sales_time)
          );
        },
        set_allCustomersAlertDataFailure(state, action) {
          state.all_customersAlert_isLoading = false;
          state.all_customersAlert_error = action.payload;
        },




  },
});

export const {
  set_allCustomersDataStart,
  set_allCustomersDataSuccess,
  set_allCustomersDataFailure,

  set_allCustomersHistoryDataStart,
  set_allCustomersHistoryDataSuccess,
  set_allCustomersHistoryDataFailure,

  set_allCustomersAlertDataStart,
  set_allCustomersAlertDataSuccess,
  set_allCustomersAlertDataFailure

} = getallcustomers.actions;

//Fetching data
export const fetchallCustomersData =
  (currentSpt) => async (dispatch) => {
    dispatch(set_allCustomersDataStart());

    try {
      const response = await axios.get(
        "https://selleasep.shop/functions/customer/getallcustcompanyspt.php/all_customers",
        {
          params: {
            spt: currentSpt,
          },
        }
      );
      dispatch(set_allCustomersDataSuccess(response.data));
    } catch (error) {
      dispatch(set_allCustomersDataFailure(error.message));
    }
  };

export default getallcustomers.reducer;
