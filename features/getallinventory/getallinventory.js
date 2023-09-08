import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const currentDate = new Date();
//initial state
const initialState = {
  all_inventory_error: null,
  all_inventory: [],
  all_inventory_isLoading: false,

  all_inventoryHistory_error: null,
  all_inventoryHistory: [],
  all_inventoryHistory_isLoading: false,

  all_inventoryAlert_error: null,
  all_inventoryAlert: [],
  all_inventoryAlert_isLoading: false,
};

export const getallinventory = createSlice({
  name: "getallinventory",
  initialState,

  reducers: {
    //Get_information
    set_allInventoryDataStart(state) {
      state.all_inventory_isLoading = true;
      state.all_inventory_error = null;
    },
    set_allInventoryDataSuccess(state, action) {
      state.all_inventory_isLoading = false;
      state.all_inventory = action.payload.sort(
        (a, b) => new Date(b.Sales_time) - new Date(a.Sales_time)
      );
    },
    set_allInventoryDataFailure(state, action) {
      state.all_inventory_isLoading = false;
      state.all_inventory_error = action.payload;
    },



    //Get_History_information
    set_allInventoryHistoryDataStart(state) {
      state.all_inventoryHistory_isLoading = true;
      state.all_inventoryHistory_error = null;
    },
    set_allInventoryHistoryDataSuccess(state, action) {
      state.all_inventoryHistory_isLoading = false;
      state.all_inventoryHistory = action.payload.sort(
        (a, b) => new Date(b.Sales_time) - new Date(a.Sales_time)
      );
    },
    set_allInventoryHistoryDataFailure(state, action) {
      state.all_inventoryHistory_isLoading = false;
      state.all_inventoryHistory_error = action.payload;
    },



        //Get_Alert_information
        set_allInventoryAlertDataStart(state) {
          state.all_inventoryAlert_isLoading = true;
          state.all_inventoryAlert_error = null;
        },
        set_allInventoryAlertDataSuccess(state, action) {
          state.all_inventoryAlert_isLoading = false;
          state.all_inventoryAlert = action.payload.sort(
            (a, b) => new Date(b.Sales_time) - new Date(a.Sales_time)
          );
        },
        set_allInventoryAlertDataFailure(state, action) {
          state.all_inventoryAlert_isLoading = false;
          state.all_inventoryAlert_error = action.payload;
        },




  },
});

export const {
  set_allInventoryDataStart,
  set_allInventoryDataSuccess,
  set_allInventoryDataFailure,

  set_allInventoryHistoryDataStart,
  set_allInventoryHistoryDataSuccess,
  set_allInventoryHistoryDataFailure,

  set_allInventoryAlertDataStart,
  set_allInventoryAlertDataSuccess,
  set_allInventoryAlertDataFailure

} = getallinventory.actions;

//Fetching data
export const fetchAllInventoryData =
  (currentCompany, currentSpt) => async (dispatch) => {
    dispatch(set_allInventoryDataStart());
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
        "https://www.selleasep.shop/functions/inventory/getproductsandinventoryspt.php/all_inventory",
        {
          params: {
            company: currentCompany,
            spt: currentSpt,
          },
        }
      );
      dispatch(set_allInventoryDataSuccess(response.data));
    } catch (error) {
      dispatch(set_allInventoryDataFailure(error.message));
    }
  };

//Fetching data
export const fetchSearchInventoryData =
  (currentCompany, currentSpt, search_name) => async (dispatch) => {
    dispatch(set_allInventoryDataStart());
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
        "https://www.selleasep.shop/functions/inventory/getproductsandinventorysptbyname.php/all_inventory",
        {
          params: {
            company: currentCompany,
            spt: currentSpt,
            name: search_name,
          },
        }
      );
      dispatch(set_allInventoryDataSuccess(response.data));
    } catch (error) {
      dispatch(set_allInventoryDataFailure(error.message));
    }
  };




//Fetching data
export const fetchInventoryHistoryData =
  (currentSpt, dating) => async (dispatch) => {
    dispatch(set_allInventoryHistoryDataStart());
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
        "https://www.selleasep.shop/functions/inventory/getinventoryHistory.php/all_inventory_history",
        {
          params: {
            spt: currentSpt,
            date:dating
          },
        }
      );
      dispatch(set_allInventoryHistoryDataSuccess(response.data));
    } catch (error) {
      dispatch(set_allInventoryHistoryDataFailure(error.message));
    }
  };



  //Fetching data
export const fetchInventoryHistoryDataSearch =
(currentSpt, dating, name) => async (dispatch) => {
  dispatch(set_allInventoryHistoryDataStart());
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
      "https://www.selleasep.shop/functions/inventory/getinventoryHistorySearch.php/all_inventory_history",
      {
        params: {
          spt: currentSpt,
          date:dating,
          name:name
        },
      }
    );
    dispatch(set_allInventoryHistoryDataSuccess(response.data));
  } catch (error) {
    dispatch(set_allInventoryHistoryDataFailure(error.message));
  }
};




//Fetching data
export const fetchInventoryAlertData =
(currentSpt) => async (dispatch) => {
  dispatch(set_allInventoryAlertDataStart());
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
      "https://www.selleasep.shop/functions/inventory/getinventoryAlertDialog.php/all_inventory_alert",
      {
        params: {
          spt: currentSpt,
        },
      }
    );
    dispatch(set_allInventoryAlertDataSuccess(response.data));
  } catch (error) {
    dispatch(set_allInventoryAlertDataFailure(error.message));
  }
};


//Fetching data
export const fetchInventoryAlertDataSearch =
(currentSpt, name) => async (dispatch) => {
  dispatch(set_allInventoryAlertDataStart());
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
      "https://www.selleasep.shop/functions/inventory/getinventoryAlertDialogSearch.php/all_inventory_alert",
      {
        params: {
          spt: currentSpt,
          name:name
        },
      }
    );
    dispatch(set_allInventoryAlertDataSuccess(response.data));
  } catch (error) {
    dispatch(set_allInventoryAlertDataFailure(error.message));
  }
};

export default getallinventory.reducer;
