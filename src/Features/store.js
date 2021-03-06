import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { persistReducer } from 'redux-persist'
import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage'
import productDataSliceReducer from "./productDataSlice";
import orderDataSliceReducer from "./orderDataSlice";
import cartDataSliceReducer from "./cartDataSlice";
import addressesDataSliceReducer from "./addressesDataSlice";
import userDataSliceReducer from "./userDataSlice";
import reviewsDataSliceReducer from "./reviewsDataSlice";
import orderReviewsDataSliceReducer from "./orderReviewsDataSlice";

const persistConfig = {
  key:'main-root',
  storage, 
  blacklist: ['loadedComponents']
}

const rootReducer = combineReducers({
  productData: productDataSliceReducer,
  orderData: orderDataSliceReducer,
  cartData: cartDataSliceReducer,
  addressesData: addressesDataSliceReducer,
  userData: userDataSliceReducer,
  reviewsData: reviewsDataSliceReducer,
  orderReviewsData: orderReviewsDataSliceReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({serializableCheck: false, immutableCheck: false})
})

setupListeners(store.dispatch);

export default store;