import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//initial state
const initialState = {
  all_product_error: null,
  all_products: [],
  all_products_isLoading: false,
};

export const getallproducts = createSlice({
  name: "getallproducts",
  initialState,

  reducers: {
    //Get_information
    set_allProductsDataStart(state) {
      state.all_products_isLoading = true;
      state.all_product_error = null;
    },
    set_allProductDataSuccess(state, action) {
      state.all_products_isLoading = false;
      state.all_products = action.payload;
    },
    set_allProductsDataFailure(state, action) {
      state.all_products_isLoading = false;
      state.all_product_error = action.payload;
    },


    search_AllProductsData(state, action) {
      state.all_products_isLoading = false;
      const query = action.payload.toLowerCase();
      
      // Assuming state.all_products is a normalized object or a Map
      state.all_products = Object.values(state.all_products).filter(obj => {
        const productName = obj.name.toLowerCase();
        return productName.includes(query);
      });
    },
    



  },
});

export const {
  set_allProductsDataStart,
  set_allProductDataSuccess,
  set_allProductsDataFailure,
  search_AllProductsData
} = getallproducts.actions;


//Fetching data
export const fetchAllProductsData = (company, spt) => async (dispatch) => {
  dispatch(set_allProductsDataStart());
  try {
    const response = await axios.get(
      "https://www.selleasep.shop/functions/product/getproductsbysalespt.php/all_products",
      {
        params: {
          company: company,
          spt: spt,
        },
      }
    );
    dispatch(set_allProductDataSuccess(response.data));
  } catch (error) {
    dispatch(set_allProductsDataFailure(error.message));
  }
};



//Fetching data
export const fetchSearchProductsData = (company, spt,search_name) => async (dispatch) => {
  dispatch(set_allProductsDataStart());
  try {
    const response = await axios.get(
      "https://www.selleasep.shop/functions/product/searchproductbyname.php/all_products",
      {
        params: {
          company: company,
          spt: spt,
          name:search_name
        },
      }
    );
    dispatch(set_allProductDataSuccess(response.data));
  } catch (error) {
    dispatch(set_allProductsDataFailure(error.message));
  }
};




export default getallproducts.reducer;
