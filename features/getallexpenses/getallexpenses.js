import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const currentDate = new Date();

//initial state
const initialState = {
  expenses_error: null,
  all_expense: [],
  expense_isLoading: false,

  TotalExpenses_error: null,
  TotalASll_expense: [],
  TotalExpense_isLoading: false,

  expensesTypes_error: null,
  all_expenseTypes: [],
  expense_isLoadingTypes: false,


};

export const getallexpenses = createSlice({
  name: "getallexpenses",
  initialState,

  reducers: {
    //Get_information
    set_allExpensesDataStart(state) {
      state.expense_isLoading = true;
      state.expenses_error = null;
    },
    set_allExpensesDataSuccess(state, action) {
      state.expense_isLoading = false;
      state.all_expense = action.payload;
    },
    set_allExpensesDataFailure(state, action) {
      state.expense_isLoading = false;
      state.expenses_error = action.payload;
    },

    
    //Get_Day_Total
    set_totalAllExpensesDataStart(state) {
      state.TotalExpense_isLoading = true;
      state.TotalExpenses_error = null;
    },
    set_totalAllExpensesDataSuccess(state, action) {
      state.TotalExpense_isLoading = false;
      state.TotalASll_expense = action.payload;
    },
    set_totalAllExpensesDataFailure(state, action) {
      state.TotalExpense_isLoading = false;
      state.TotalExpenses_error = action.payload;
    },


    //Get all_Types
    set_AllExpensesTypesDataStart(state) {
      state.expense_isLoadingTypes = true;
      state.expensesTypes_error = null;
    },
    set_AllExpensesTypesDataSuccess(state, action) {
      state.expense_isLoadingTypes = false;
      state.all_expenseTypes = action.payload;
    },
    set_AllExpensesTypesDataFailure(state, action) {
      state.expense_isLoadingTypes = false;
      state.expensesTypes_error = action.payload;
    },
  },
});

export const {
    set_allExpensesDataStart,
    set_allExpensesDataSuccess,
    set_allExpensesDataFailure,

    set_totalAllExpensesDataStart,
    set_totalAllExpensesDataSuccess,
    set_totalAllExpensesDataFailure,

    set_AllExpensesTypesDataStart,
    set_AllExpensesTypesDataSuccess,
    set_AllExpensesTypesDataFailure

    
} = getallexpenses.actions;


//Fetching data
export const fetchAllExpensesData = (sales_point_id) => async (dispatch) => {
  dispatch(set_allExpensesDataStart());

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
      "https://www.selleasep.shop/functions/expenses/getsallexpensescompanysptdays.php/getallexpense",
      {
        params: {
            salespoint: sales_point_id,
            date:formattedDate
        },
      }
    );
    dispatch(set_allExpensesDataSuccess(response.data));
  } catch (error) {
    dispatch(set_allExpensesDataFailure(error.message));
  }
};


//Fetching TOTALS data
export const fetchAllExpensesDataTotals = (sales_point_id) => async (dispatch) => {
  dispatch(set_totalAllExpensesDataStart());

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
      "https://www.selleasep.shop/functions/expenses/dayExpenses.php/getTotalExpenses",
      {
        params: {
            salespoint: sales_point_id,
            date:formattedDate
        },
      }
    );
    dispatch(set_totalAllExpensesDataSuccess(response.data));
  } catch (error) {
    dispatch(set_totalAllExpensesDataFailure(error.message));
  }
};

//Fetching data
export const fetchAllExpensesTypeData = (sales_point_id) => async (dispatch) => {
  dispatch(set_AllExpensesTypesDataStart());
  try {
    const response = await axios.get(
      "https://www.selleasep.shop/functions/expenses/getsallexpensestypeid.php/getallexpensetype",
      {
        params: {
            salespoint: sales_point_id
        },
      }
    );
    dispatch(set_AllExpensesTypesDataSuccess(response.data));
  } catch (error) {
    dispatch(set_AllExpensesTypesDataFailure(error.message));
  }
};

export default getallexpenses.reducer;
