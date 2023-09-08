import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//initial state
const initialState = {
  types_error: null,
  all_types: [],
  types_isLoading: false,
};

export const getalltypes = createSlice({
  name: "getalltypes",
  initialState,

  reducers: {
    //Get_information
    set_allTypesDataStart(state) {
      state.types_isLoading = true;
      state.types_error = null;
    },
    set_allTypesDataSuccess(state, action) {
      state.types_isLoading = false;
      state.all_types = action.payload;
    },
    set_allTypesDataFailure(state, action) {
      state.types_isLoading = false;
      state.types_error = action.payload;
    },
  },
});

export const {
    set_allTypesDataStart,
    set_allTypesDataSuccess,
    set_allTypesDataFailure,
} = getalltypes.actions;


//Fetching data
export const fetchAllTypesData = ({sales_point_id}) => async (dispatch) => {
  dispatch(set_allTypesDataStart());
  try {
    const response = await axios.get(
      "https://www.selleasep.shop/getalltypes.php/getallexpensetype",
      {
        params: {
            salespoint: sales_point_id,
        },
      }
    );
    dispatch(set_allTypesDataSuccess(response.data));
  } catch (error) {
    dispatch(set_allTypesDataFailure(error.message));
  }
};

export default getalltypes.reducer;
