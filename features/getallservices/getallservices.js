import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//initial state
const initialState = {
  all_service_error: null,
  all_Services: [],
  all_Services_isLoading: false,
};

export const getallservices = createSlice({
  name: "getallservices",
  initialState,

  reducers: {
    //Get_information
    set_allServicesDataStart(state) {
      state.all_Services_isLoading = true;
      state.all_service_error = null;
    },
    set_allserviceDataSuccess(state, action) {
      state.all_Services_isLoading = false;
      state.all_Services = action.payload;
    },
    set_allServicesDataFailure(state, action) {
      state.all_Services_isLoading = false;
      state.all_service_error = action.payload;
    },
  },
});

export const {
  set_allServicesDataStart,
  set_allserviceDataSuccess,
  set_allServicesDataFailure,
} = getallservices.actions;


//Fetching data
export const fetchAllServicesData = (company, spt) => async (dispatch) => {
  dispatch(set_allServicesDataStart());
  try {
    const response = await axios.get(
      "https://www.selleasep.shop/functions/service/getservicebysalespt.php/all_services",
      {
        params: {
          company: company,
          spt: spt,
        },
      }
    );
    dispatch(set_allserviceDataSuccess(response.data));
  } catch (error) {
    dispatch(set_allServicesDataFailure(error.message));
  }
};



//Fetching data
export const fetchSearchServicesData = (company, spt,search_name) => async (dispatch) => {
  dispatch(set_allServicesDataStart());
  try {
    const response = await axios.get(
      "https://www.selleasep.shop/functions/service/searchservicebyname.php/all_Services",
      {
        params: {
          company: company,
          spt: spt,
          name:search_name
        },
      }
    );
    dispatch(set_allserviceDataSuccess(response.data));
  } catch (error) {
    dispatch(set_allServicesDataFailure(error.message));
  }
};

export default getallservices.reducer;
