import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const currentDate = new Date();

//initial state
const initialState = {
  currentUser: null,
  currentUserType: null,
  currentUserCompany: null,
  current_theme: null,
  Theme_loading: false,
  error: null,
  currentCompanyID: null,
  currentSalesPointID: null,
  currentUserID: null,
  accountUsername: null,
  UserPhone: null,
  SptLocation:null,
  Companylogo:null,
  CompanyColors:null,
  currentWebUrl:"https://www.selleasep.shop/",
  UserLanguage:null,

};

export const userInfos = createSlice({
  name: "userInfos",
  initialState,

  reducers: {
    //Get Total_information
    setDataTheme(state) {
      state.Theme_loading = true;
      state.error = null;
    },
    setDataThemeSuccess(state, action) {
      state.Theme_loading = false;
      state.current_theme = action.payload;
    },

    setDataUsernames(state, action) {
      state.Theme_loading = false;
      state.currentUser = action.payload;
    },

    setDataAccountUsername(state, action) {
      state.Theme_loading = false;
      state.accountUsername = action.payload;
    },

    setDataUserPhone(state, action) {
      state.Theme_loading = false;
      state.UserPhone = action.payload;
    },

    setDataUserID(state, action) {
      state.Theme_loading = false;
      state.currentUserID = action.payload;
    },
    setDataUserType(state, action) {
      state.Theme_loading = false;
      state.currentUserType = action.payload;
    },

    setDataUserCompany(state, action) {
      state.Theme_loading = false;
      state.currentUserCompany = action.payload;
    },

    setDataCurrentCompanyID(state, action) {
      state.Theme_loading = false;
      state.currentCompanyID = action.payload;
    },

    setDataCurrentSPT(state, action) {
      state.Theme_loading = false;
      state.currentSalesPointID = action.payload;
    },

    setDataSptLocation(state, action) {
      state.Theme_loading = false;
      state.SptLocation = action.payload;
    },

    setDataCompanyLogo(state, action) {
      state.Theme_loading = false;
      state.Companylogo = action.payload;
      //console.log("Company logo: "+action.payload)
    },

    setDataCompanyColors(state, action) {
      state.Theme_loading = false;
      state.CompanyColors = action.payload;
      //console.log("Company Colors: "+action.payload)
    },

    setDataThemeFailure(state, action) {
      state.Theme_loading = false;
      state.error = action.payload;
    },

    setUserLanguage(state, action) {
      state.UserLanguage = false;
      state.error = action.payload;
    },



  },
});

export const {
  setDataUserID,
  setDataCurrentCompanyID,
  setDataCurrentSPT,
  setDataTheme,
  setDataThemeSuccess,
  setDataThemeFailure,
  setDataUsernames,
  setDataUserType,
  setDataUserCompany,
  setDataUserPhone,
  setDataAccountUsername,
  setDataSptLocation,
  setDataCompanyLogo,
  setDataCompanyColors,
  setUserLanguage,
 

} = userInfos.actions;

export default userInfos.reducer;
