import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const currentDate = new Date();

//initial state
const initialState = {
  debts_error: null,
  all_debt: [],
  debt_isLoading: false,

  Totaldebts_error: null,
  TotalASll_debt: [],
  Totaldebt_isLoading: false,


  debts_errorIn: null,
  all_debtIn: [],
  debt_isLoadingIn: false,

};

export const getalldebts = createSlice({
  name: "getalldebts",
  initialState,

  reducers: {
    
    //Get_information
    set_alldebtsDataStart(state) {
      state.debt_isLoading = true;
      state.debts_error = null;
    },
    set_alldebtsDataSuccess(state, action) {
      state.debt_isLoading = false;
      state.all_debt = action.payload;
    },
    set_alldebtsDataFailure(state, action) {
      state.debt_isLoading = false;
      state.debts_error = action.payload;
    },

    
    //Get_Day_Total
    set_totalAlldebtsDataStart(state) {
      state.Totaldebt_isLoading = true;
      state.Totaldebts_error = null;
    },
    set_totalAlldebtsDataSuccess(state, action) {
      state.Totaldebt_isLoading = false;
      state.TotalASll_debt = action.payload;
    },
    set_totalAlldebtsDataFailure(state, action) {
      state.Totaldebt_isLoading = false;
      state.Totaldebts_error = action.payload;
    },

        //Get_information In
        set_alldebtsDataStartIn(state) {
          state.debt_isLoadingIn = true;
          state.debts_errorIn = null;
        },
        set_alldebtsDataSuccessIn(state, action) {
          state.debt_isLoadingIn = false;
          state.all_debtIn = action.payload;
        },
        set_alldebtsDataFailureIn(state, action) {
          state.debt_isLoadingIn = false;
          state.debts_errorIn = action.payload;
        },


  },
});

export const {
    set_alldebtsDataStart,
    set_alldebtsDataSuccess,
    set_alldebtsDataFailure,

    set_totalAlldebtsDataStart,
    set_totalAlldebtsDataSuccess,
    set_totalAlldebtsDataFailure,

    set_alldebtsDataStartIn,
    set_alldebtsDataSuccessIn,
    set_alldebtsDataFailureIn,
    
} = getalldebts.actions;


//Fetching data
export const fetchAlldebtsData = (sales_point_id) => async (dispatch) => {
  dispatch(set_alldebtsDataStart());

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
      "https://www.selleasep.shop/functions/debts/getalldebtssptsession.php/all_debts",
      {
        params: {
          spt: sales_point_id,
        },
      }
    );
    dispatch(set_alldebtsDataSuccess(response.data));
  } catch (error) {
    dispatch(set_alldebtsDataFailure(error.message));
  }
};


//Fetching TOTALS data
export const fetchAlldebtsDataTotals = (sales_point_id) => async (dispatch) => {
  dispatch(set_totalAlldebtsDataStart());

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
      "https://www.selleasep.shop/functions/debts/AllDebtscount.php/getTotalDebts",
      {
        params: {
          salespoint: sales_point_id,
        },
      }
    );
    dispatch(set_totalAlldebtsDataSuccess(response.data));
  } catch (error) {
    dispatch(set_totalAlldebtsDataFailure(error.message));
  }
};



//Fetching data
export const fetchAlldebtsDatain = (sales_point_id, sess_id) => async (dispatch) => {
  dispatch(set_alldebtsDataStartIn());

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
      "https://www.selleasep.shop/functions/debts/getalldebtssptsessionid.php/all_debts",
      {
        params: {
          spt: sales_point_id,
          sess_id:sess_id
        },
      }
    );
    dispatch(set_alldebtsDataSuccessIn(response.data));
  } catch (error) {
    dispatch(set_alldebtsDataFailureIn(error.message));
  }
};

export default getalldebts.reducer;
