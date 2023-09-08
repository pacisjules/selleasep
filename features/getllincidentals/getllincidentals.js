import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const currentDate = new Date();

//initial state
const initialState = {
  incidentals_error: null,
  all_incidental: [],
  incidental_isLoading: false,

};

export const getllincidentals = createSlice({
  name: "getllincidentals",
  initialState,

  reducers: {
    //Get_information
    set_allincidentalsDataStart(state) {
      state.incidental_isLoading = true;
      state.incidentals_error = null;
    },
    set_allincidentalsDataSuccess(state, action) {
      state.incidental_isLoading = false;
      state.all_incidental = action.payload;
    },
    set_allincidentalsDataFailure(state, action) {
      state.incidental_isLoading = false;
      state.incidentals_error = action.payload;
    },


  },
});

export const {
    set_allincidentalsDataStart,
    set_allincidentalsDataSuccess,
    set_allincidentalsDataFailure,
} = getllincidentals.actions;


//Fetching data
export const fetchAllincidentalsData = (sales_point_id) => async (dispatch) => {
  dispatch(set_allincidentalsDataStart());

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
      "https://www.selleasep.shop/functions/incidental/getincedentalsbysalespt.php/all_incedentals",
      {
        params: {
          spt: sales_point_id,
        },
      }
    );
    dispatch(set_allincidentalsDataSuccess(response.data));
  } catch (error) {
    dispatch(set_allincidentalsDataFailure(error.message));
  }
};


//Fetching data
export const fetchAllincidentalsDataSearch = (sales_point_id, name) => async (dispatch) => {
  dispatch(set_allincidentalsDataStart());

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
      "https://www.selleasep.shop/functions/incidental/getincedentalsbysalesptSearch.php/all_incedentals",
      {
        params: {
          spt: sales_point_id,
          name:name
        },
      }
    );
    dispatch(set_allincidentalsDataSuccess(response.data));
  } catch (error) {
    dispatch(set_allincidentalsDataFailure(error.message));
  }
};

export default getllincidentals.reducer;
