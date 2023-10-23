import { configureStore } from '@reduxjs/toolkit';
import My_change_totals from '../features/changetotals/change_total_slice';
import get_current from '../features/getcurrentproducts/get_current';
import getallproducts from '../features/getfullproducts/getallproducts';
import getallsales from '../features/getallsales/getallsales';
import yesterdaySales from '../features/yesterdaySales/yesterdaySales';
import RedPickDate from '../features/RedpickDateTime/RedPickDate';
import getalltypes from '../features/getalltypes/getalltypes';
import userInfos from '../features/userinfo/userInfos';
import getallinventory from '../features/getallinventory/getallinventory';
import getallservices from '../features/getallservices/getallservices';
import getallexpenses from '../features/getallexpenses/getallexpenses';
import getalldebts from '../features/gettalldebts/getalldebts';
import getllincidentals from '../features/getllincidentals/getllincidentals';
import getallcustomers  from '../features/getallcustomers/getallcustomers';
export const store = configureStore({
  reducer: {
    changeTotals:My_change_totals,
    get_current_products:get_current,
    all_products:getallproducts,
    all_sales:getallsales,
    yesterdaySales:yesterdaySales,
    RedPickDate:RedPickDate,
    getalltypes:getalltypes,
    getallexpenses:getallexpenses,
    userInfos:userInfos,
    getallinventory:getallinventory,
    getallservices:getallservices,
    getalldebts:getalldebts,
    getllincidentals:getllincidentals,
    getallcustomers:getallcustomers
  },
})