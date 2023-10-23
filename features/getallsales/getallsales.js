import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const currentDate = new Date();
//initial state
const initialState = {
  all_sale_error: null,
  all_sales: [],
  all_sales_isLoading: false,


  daysTotalsload:null,
  all_DayTotals: [],
  daysTotalsfailes:null,


  SoldLoad:null,
  all_MostSold: [],
  SoldLoadError:null,


  SoldBenefitLoad:null,
  all_MostSoldBenefit: [],
  SoldBenefitLoadError:null,


  BalanceLoad:null,
  all_Balance: [],
  BalanceError:null,


  SPTLoad:null,
  all_SPT: [],
  SPTError:null,


  EmpLoad:null,
  all_Emp: [],
  EmpError:null,

  CARTLoad:null,
  CARTs_array:[],
  CARTError:null,


  WEEKDATALoad:null,
  WEEKDATA_array:[],
  WEEKDATAError:null,

};

export const getallsales = createSlice({
  name: "getallsales",
  initialState,

  reducers: {
    //Get_information
    set_allsalesDataStart(state) {
      state.all_sales_isLoading = true;
      state.all_sale_error = null;
    },
    set_allsaleDataSuccess(state, action) {
      state.all_sales_isLoading = false;
      state.all_sales = action.payload.sort(
        (a, b) => new Date(b.Sales_time) - new Date(a.Sales_time)
      );
    },
    set_allsalesDataFailure(state, action) {
      state.all_sales_isLoading = false;
      state.all_sale_error = action.payload;
    },

    Set_allDayTotals(state, action) {
      state.daysTotalsload = false;
      state.all_DayTotals = action.payload;
    },

    set_allDayLoad(state, action) {
      state.daysTotalsload = true;
      state.daysTotalsfailes = null;
    },

    set_allDayFailed(state, action) {
      state.daysTotalsload = false;
      state.all_DayTotals = action.payload;
    },

    // Most Sold
    set_allMostSoldLoad(state, action) {
      state.SoldLoad = true;
      state.SoldLoadError = null;
    },

    set_allMostSoldSuccess(state, action) {
      state.SoldLoad = false;
      state.all_MostSold = action.payload;
    },

    set_allMostSoldFailed(state, action) {
      state.SoldLoad = false;
      state.SoldLoadError = action.payload;
    },

    // Most Benefit
    set_allMostSoldBenefitLoad(state, action) {
      state.SoldBenefitLoad = true;
      state.SoldBenefitLoadError = null;
    },

    set_allMostSoldBenefitSuccess(state, action) {
      state.SoldBenefitLoad = false;
      state.all_MostSoldBenefit = action.payload;
    },

    set_allMostSoldBenefitFailed(state, action) {
      state.SoldBenefitLoad = false;
      state.SoldBenefitLoadError = action.payload;
    },

    // Balance
    set_BalanceLoad(state, action) {
      state.BalanceLoad = true;
      state.BalanceError = null;
    },

    set_BalanceSuccess(state, action) {
      state.BalanceLoad = false;
      state.all_Balance = action.payload;
    },

    set_BalanceFailed(state, action) {
      state.BalanceLoad = false;
      state.BalanceError = action.payload;
    },

    //SPT
    set_SPTLoad(state, action) {
      state.SPTLoad = true;
      state.SPTError = null;
    },

    set_SPTSuccess(state, action) {
      state.SPTLoad = false;
      state.all_SPT = action.payload;
    },

    set_SPTFailed(state, action) {
      state.SPTLoad = false;
      state.SPTError = action.payload;
    },

    // Sales Array

    set_CARTLoad(state, action) {
      state.CARTLoad = true;
      state.CARTError = null;
    },

    set_CARTSuccess(state, action) {
      state.CARTLoad = false;
      state.CARTs_array = [...state.CARTs_array, action.payload];
    },

    set_CARTFailed(state, action) {
      state.CARTLoad = false;
      state.CARTError = action.payload;
    },

    removeCartItem(state, action) {
      if (state.CARTs_array.length === 0) {
        console.log("The array is empty");
      } else {
        const itemIndex = state.CARTs_array.findIndex(
          (item) => item.id === action.payload
        );

        if (itemIndex !== -1) {
          state.CARTs_array.splice(itemIndex, 1);
        }

        //console.log("Received id: "+action.payload);
      }
    },

    
    increaseCartItem(state, action) {
      if (state.CARTs_array.length === 0) {
        console.log("The array is empty");
      } else {
        const itemIndex = state.CARTs_array.findIndex(
          (item) => item.id === action.payload
        );

        var currentQty = parseInt(state.CARTs_array[itemIndex].qty);
        var currentPrice = parseFloat(state.CARTs_array[itemIndex].price);
        var currentBenef = parseFloat(state.CARTs_array[itemIndex].benefit);

        if (itemIndex !== -1) {
          state.CARTs_array[itemIndex].qty = currentQty + 1;

          var currentQtyNow = parseInt(state.CARTs_array[itemIndex].qty);
          state.CARTs_array[itemIndex].total_amount =
            currentPrice * currentQtyNow;

            state.CARTs_array[itemIndex].total_benefit =
            currentBenef * currentQtyNow;
        }

        //console.log("Received id: "+action.payload);
      }
    },

    decreaseCartItem(state, action) {
      if (state.CARTs_array.length === 0) {
        console.log("The array is empty");
      } else {
        const itemIndex = state.CARTs_array.findIndex(
          (item) => item.id === action.payload
        );

        var currentPrice = parseFloat(state.CARTs_array[itemIndex].price);
        var currentBenef = parseFloat(state.CARTs_array[itemIndex].benefit);
        if (itemIndex !== -1) {
          if (state.CARTs_array[itemIndex].qty == 1) {
            state.CARTs_array[itemIndex].qty = 1;
            var currentQtyNow = parseInt(state.CARTs_array[itemIndex].qty);
            state.CARTs_array[itemIndex].total_amount =
              currentPrice * currentQtyNow;
          } else {
            state.CARTs_array[itemIndex].qty -= 1;
            var currentQtyNow = parseInt(state.CARTs_array[itemIndex].qty);
            state.CARTs_array[itemIndex].total_amount =
              currentPrice * currentQtyNow;

            state.CARTs_array[itemIndex].total_benefit =
              currentBenef * currentQtyNow;
          }
        }

        //console.log("Received id: "+action.payload);
      }
    },

    clearCart(state) {
      state.CARTs_array = [];
    },



    //Employees
    set_EmpLoad(state, action) {
      state.EmpLoad = true;
      state.EmpError = null;
    },

    set_EmpSuccess(state, action) {
      state.EmpLoad = false;
      state.all_Emp = action.payload;
    },

    set_EmpFailed(state, action) {
      state.EmpLoad = false;
      state.EmpError = action.payload;
    },



    //wEEK DATA
    set_WEEKDATALoad(state, action) {
      state.WEEKDATALoad = true;
      state.WEEKDATAError = null;
    },

    set_WEEKDATASuccess(state, action) {
      state.WEEKDATALoad = false;
      state.WEEKDATA_array = action.payload;
    },

    set_WEEKDATAFailed(state, action) {
      state.WEEKDATALoad = false;
      state.WEEKDATAError = action.payload;
    },


  },
});

export const {
  set_allsalesDataStart,
  set_allsaleDataSuccess,
  set_allsalesDataFailure,

  Set_allDayTotals,
  set_allDayLoad,
  set_allDayFailed,

  set_allMostSoldLoad,
  set_allMostSoldSuccess,
  set_allMostSoldFailed,

  set_allMostSoldBenefitLoad,
  set_allMostSoldBenefitSuccess,
  set_allMostSoldBenefitFailed,

  set_BalanceLoad,
  set_BalanceSuccess,
  set_BalanceFailed,

  set_SPTLoad,
  set_SPTSuccess,
  set_SPTFailed,


  set_EmpLoad,
  set_EmpSuccess,
  set_EmpFailed,

  set_CARTLoad,
  set_CARTSuccess,
  set_CARTFailed,
  removeCartItem,
  increaseCartItem,
  decreaseCartItem,
  clearCart,
  set_WEEKDATALoad,
  set_WEEKDATASuccess,
  set_WEEKDATAFailed

} = getallsales.actions;



//Fetching data
export const fetchAllSalesData = (currentCompany,currentSpt) => async (dispatch) => {
  dispatch(set_allsalesDataStart());
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
      "https://www.selleasep.shop/functions/sales/getalldaysaleswithcompanyspt.php/all_sales_days",
      {
        params: {
          date: formattedDate,
          company: currentCompany,
          spt:currentSpt
        },
      }
    );
    dispatch(set_allsaleDataSuccess(response.data));
  } catch (error) {
    dispatch(set_allsalesDataFailure(error.message));
  }
};



//Fetching week data
export const fetchAllWeekData = (currentSpt) => async (dispatch) => {
  dispatch(set_WEEKDATALoad());
 
  try {
    const response = await axios.get(
      "https://www.selleasep.shop/functions/sales/weekperformance.php/performance",
      {
        params: {
          spt:currentSpt
        },
      }
    );
    dispatch(set_WEEKDATASuccess(response.data));
    
  } catch (error) {
    dispatch(set_WEEKDATAFailed(error.message));
  }
};




//Fetching data
export const fetchSearchSalesData = (currentCompany, currentSpt,search_name) => async (dispatch) => {
  dispatch(set_allsalesDataStart());
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
      "https://www.selleasep.shop/functions/sales/getalldaysaleswithcompanysptbyname.php/all_sales_days",
      {
        params: {
          date: formattedDate,
          company: currentCompany,
          spt:currentSpt,
          name:search_name
        },
      }
    );
    dispatch(set_allsaleDataSuccess(response.data));
  } catch (error) {
    dispatch(set_allsalesDataFailure(error.message));
  }
};


//Fetching data
export const fetchdaytotals = (currentSpt) => async (dispatch) => {
  dispatch(set_allDayLoad());
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
      "https://www.selleasep.shop/functions/sales/daytotalandcountspt.php/DaysTotal",
      {
        params: {
          date: formattedDate,
          spt:currentSpt,
        },
      }
    );

    dispatch(Set_allDayTotals(response.data));

  } catch (error) {
    dispatch(set_allDayFailed(error.message));
  }
};









//Fetching data of Yesterday
export const fetchAllYesterdaySalesData = (currentCompany,currentSpt) => async (dispatch) => {
  dispatch(set_allsalesDataStart());
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
      "https://www.selleasep.shop/functions/sales/getalldaysaleswithcompanyspt.php/all_sales_days",
      {
        params: {
          date: formattedDate,
          company: currentCompany,
          spt:currentSpt
        },
      }
    );
    dispatch(set_allsaleDataSuccess(response.data));
  } catch (error) {
    dispatch(set_allsalesDataFailure(error.message));
  }
};


//Fetching data of Yesterday
export const fetchSearchYesterdaySalesData = (currentCompany, currentSpt,search_name) => async (dispatch) => {
  dispatch(set_allsalesDataStart());
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
      "https://www.selleasep.shop/functions/sales/getalldaysaleswithcompanysptbyname.php/all_sales_days",
      {
        params: {
          date: formattedDate,
          company: currentCompany,
          spt:currentSpt,
          name:search_name
        },
      }
    );
    dispatch(set_allsaleDataSuccess(response.data));
  } catch (error) {
    dispatch(set_allsalesDataFailure(error.message));
  }
};


//Fetching data of Yesterday
export const fetchYesterdaytotals = (currentSpt) => async (dispatch) => {
  dispatch(set_allDayLoad());
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
      "https://www.selleasep.shop/functions/sales/daytotalandcountspt.php/DaysTotal",
      {
        params: {
          date: formattedDate,
          spt:currentSpt,
        },
      }
    );

    dispatch(Set_allDayTotals(response.data));

  } catch (error) {
    dispatch(set_allDayFailed(error.message));
  }
};










//Fetching data of Yesterday
export const fetchAllPickingSalesData = (currentCompany,currentSpt,dates) => async (dispatch) => {
  dispatch(set_allsalesDataStart());

  try {
    const response = await axios.get(
      "https://www.selleasep.shop/functions/sales/getalldaysaleswithcompanyspt.php/all_sales_days",
      {
        params: {
          date: dates,
          company: currentCompany,
          spt:currentSpt
        },
      }
    );
    dispatch(set_allsaleDataSuccess(response.data));
  } catch (error) {
    dispatch(set_allsalesDataFailure(error.message));
  }
};


//Fetching data of Yesterday
export const fetchSearchPickingSalesData = (currentCompany, currentSpt,dates,search_name) => async (dispatch) => {
  dispatch(set_allsalesDataStart());

  try {
    const response = await axios.get(
      "https://www.selleasep.shop/functions/sales/getalldaysaleswithcompanysptbyname.php/all_sales_days",
      {
        params: {
          date: dates,
          company: currentCompany,
          spt:currentSpt,
          name:search_name
        },
      }
    );
    dispatch(set_allsaleDataSuccess(response.data));
  } catch (error) {
    dispatch(set_allsalesDataFailure(error.message));
  }
};


//Fetching data of Yesterday
export const fetchPickingtotals = (currentSpt,dates) => async (dispatch) => {
  dispatch(set_allDayLoad());

  try {
    const response = await axios.get(
      "https://www.selleasep.shop/functions/sales/daytotalandcountspt.php/DaysTotal",
      {
        params: {
          date: dates,
          spt:currentSpt,
        },
      }
    );

    dispatch(Set_allDayTotals(response.data));

  } catch (error) {
    dispatch(set_allDayFailed(error.message));
  }
};








//Fetching data of From to

export const fetchAllPickingfromtoSalesData = (currentCompany,currentSpt,monday,sunday) => async (dispatch) => {
  dispatch(set_allsalesDataStart());

  try {
    const response = await axios.get(
      "https://www.selleasep.shop/functions/sales/getalldaysaleswithcompanysptweek.php/all_sales_days",
      {
        params: {
          company: currentCompany,
          spt:currentSpt,
          monday:monday,
          sunday:sunday
        },
      }
    );
    dispatch(set_allsaleDataSuccess(response.data));
  } catch (error) {
    dispatch(set_allsalesDataFailure(error.message));
  }
};


//Fetching data of From to
export const fetchSearchPickingfromtoSalesData = (currentCompany, currentSpt,monday,sunday,search_name) => async (dispatch) => {
  dispatch(set_allsalesDataStart());

  try {
    const response = await axios.get(
      "https://www.selleasep.shop/functions/sales/getalldaysaleswithcompanysptweekname.php/all_sales_days",
      {
        params: {
          company: currentCompany,
          spt:currentSpt,
          monday:monday,
          sunday:sunday,
          name:search_name,
        },
      }
    );
    dispatch(set_allsaleDataSuccess(response.data));
  } catch (error) {
    dispatch(set_allsalesDataFailure(error.message));
  }
};


//Fetching data of From to
export const fetchPickingfromtototals = (currentSpt,monday,sunday) => async (dispatch) => {
  dispatch(set_allDayLoad());

  try {
    const response = await axios.get(
      "https://www.selleasep.shop/functions/sales/daytotalandcountsptweek.php/DaysTotal",
      {
        params: {
          spt:currentSpt,
          monday:monday,
          sunday:sunday
        },
      }
    );

    dispatch(Set_allDayTotals(response.data));

  } catch (error) {
    dispatch(set_allDayFailed(error.message));
  }
};



//Fetching fetchMostSold
export const fetchMostSold = (currentSpt) => async (dispatch) => {
  dispatch(set_allMostSoldLoad());
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
      "https://www.selleasep.shop/functions/sales/mostsaldproductday.php/DaysTotal",
      {
        params: {
          date:formattedDate,
          spt:currentSpt,
        },
      }
    );
    dispatch(set_allMostSoldSuccess(response.data));

  } catch (error) {
    dispatch(set_allMostSoldFailed(error.message));
  }
};



//Fetching fetchMostBenefit
export const fetchMostBenefit = (currentSpt) => async (dispatch) => {
  dispatch(set_allMostSoldBenefitLoad());
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
      "https://www.selleasep.shop/functions/sales/mostbenefitproductday.php/DaysTotal",
      {
        params: {
          date:formattedDate,
          spt:currentSpt,
        },
      }
    );

    dispatch(set_allMostSoldBenefitSuccess(response.data));

  } catch (error) {
    dispatch(set_allMostSoldBenefitFailed(error.message));
  }
};




//Fetching Balance
export const fetchBalance = (currentSpt) => async (dispatch) => {
  dispatch(set_BalanceLoad());
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
      "https://www.selleasep.shop/functions/sales/getdailybalancespt.php/dailybalance",
      {
        params: {
          date:formattedDate,
          spt:currentSpt,
        },
      }
    );

    dispatch(set_BalanceSuccess(response.data));

  } catch (error) {
    dispatch(set_BalanceFailed(error.message));
  }
};


//Fetching Balance
export const fetchSPT = (currentCompany) => async (dispatch) => {
  dispatch(set_SPTLoad());

  try {
    const response = await axios.get(
      "https://www.selleasep.shop/functions/salespoint/getsalesptbycompany.php/all_sales_point",
      {
        params: {
          com_id:currentCompany,
        },
      }
    );

    dispatch(set_SPTSuccess(response.data));

  } catch (error) {
    dispatch(set_SPTFailed(error.message));
  }
};




//Fetching Balance
export const fetchEmp = (currentCompany) => async (dispatch) => {
  dispatch(set_EmpLoad());

  try {
    const response = await axios.get(
      "https://www.selleasep.shop/functions/employee/getemployees.php/all_employees",
      {
        params: {
          company:currentCompany,
        },
      }
    );

    dispatch(set_EmpSuccess(response.data));

  } catch (error) {
    dispatch(set_EmpFailed(error.message));
  }
};




//Get sales by user
//Fetching data of Yesterday
export const fetchAllSalesDatabyUser = (currentCompany,dates,user_id) => async (dispatch) => {
  dispatch(set_allsalesDataStart());

  try {
    const response = await axios.get(
      "https://www.selleasep.shop/functions/sales/getAllSalesBySptAndUser.php/all_sales_days",
      {
        params: {
          date: dates,
          company: currentCompany,
          use_id:user_id
        },
      }
    );
    dispatch(set_allsaleDataSuccess(response.data));
  } catch (error) {
    dispatch(set_allsalesDataFailure(error.message));
  }
};




//Fetching data of Yesterday
export const fetchuserssalestotals = (user_id,dates) => async (dispatch) => {
  dispatch(set_allDayLoad());

  try {
    const response = await axios.get(
      "https://www.selleasep.shop/functions/sales/daytotalandcountuser.php/DaysTotal",
      {
        params: {
          date: dates,
          use_id:user_id,
        },
      }
    );

    dispatch(Set_allDayTotals(response.data));

  } catch (error) {
    dispatch(set_allDayFailed(error.message));
  }
};



//Fetching data of Yesterday
export const fetchSearchUsersSalesData = (currentCompany,dates,search_name, user_id) => async (dispatch) => {
  dispatch(set_allsalesDataStart());

  try {
    const response = await axios.get(
      "https://www.selleasep.shop/functions/sales/getalldaysaleswithcompanysptbynameuser.php/all_sales_days",
      {
        params: {
          date: dates,
          company: currentCompany,
          name:search_name,
          use_id:user_id
        },
      }
    );
    dispatch(set_allsaleDataSuccess(response.data));
  } catch (error) {
    dispatch(set_allsalesDataFailure(error.message));
  }
};

export default getallsales.reducer;
