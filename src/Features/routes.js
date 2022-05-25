import axios from 'axios';
import { createAsyncThunk } from "@reduxjs/toolkit";

const backendURL = process.env.REACT_APP_IN_DEVELOPMENT? process.env.REACT_APP_BACKEND_URL : process.env.REACT_APP_PUBLIC_BACKEND_URL 


// endpoints
export const api = {

  // user routes

  // get user by email.
  getUserByEmail: (email) => { return axios.get(`${backendURL}/api/users/${email}`) },

  // create new user.
  addUser: (newUserObj) => { return axios.post(`${backendURL}/api/users/`, newUserObj) },

  // get list of all users.
  getUsers: () => { return axios.get(`${backendURL}/api/users`) },

  // get register date.
  getMonthAndYear: async (email, token) => {
    return axios.get(`${backendURL}/api/users/get_date/${email}`, { headers: {Authorization: `Bearer ${token}` }})
  },
  
  // get number of orders.
  getNumberOfOrders: async (email, token) => { 
    return axios.get(`${backendURL}/api/orders/get_number/${email}`, { headers: {Authorization: `Bearer ${token}` }} )
  },


  // product routes
  products: {
  
    // get list of all products.
    getProducts: createAsyncThunk(
      'productData/getProducts',
      async () => { 
        return axios.get(`${backendURL}/api/products`) 
      }
    ),

    // set product stock
    setStock: createAsyncThunk(
      'productData/setStock',
      async (obj) => {
        return { id: obj.id, data: obj.stock}
      }
    ),

    // remove from product stock.
    removeStock: createAsyncThunk(
      'productData/removeStock',
      async (obj) => {
        await axios.put(`${backendURL}/api/products`,  { quantity: obj.quantity, products_id: obj.id })
        return { quantity: obj.quantity, id: obj.id }
      }
    ),

    // add to product stock.
    addStock: createAsyncThunk(
      'productData/addStock',
      async (obj) => {
        await axios.put(`${backendURL}/api/products/add_stock`,  { quantity: obj.quantity, products_id: obj.id })
        return { quantity: obj.quantity, id: obj.id }
      }
    ),

  },




  // cart routes
  cart: {

    // get cart products by email.
    getCartProductsByEmail: createAsyncThunk(
      'cartData/getCartProductsByEmail',
      async (obj) => {
        const response = await axios.get(`${backendURL}/api/cart_items/cart_products/${obj.email}`, { headers: {Authorization: `Bearer ${obj.token}` }})
        return response.data
      }
    ),

    // get item number total from cart.
    getNumberOfCartItems: createAsyncThunk(
      'cartData/getNumberOfCartItems',
      async (obj) => { 
        const response = await axios.get(`${backendURL}/api/cart_items/total_number/${obj.email}`, { headers: {Authorization: `Bearer ${obj.token}` }}) 
        return response.data[0].sum
      }
    ),

    // change the number of total items in cart
    setNumberOfCartItems: createAsyncThunk(
      'cartData/setNumberOfCartItems',
      async (number) => { 
        return number
      }
    ),

    // change the number of total items in cart
    addToNumberOfCartItems: createAsyncThunk(
      'cartData/addToNumberOfCartItems',
      async (number) => { 
        return number
      }
    ),

    // remove from cart item quantity by product id.
    removeQuantity: createAsyncThunk(
      'cartData/removeQuantity',
      async (obj) => {
        await axios.put(`${backendURL}/api/cart_items/remove_quantity`,  { quantity: obj.quantity, products_id: obj.products_id, user_email: obj.user_email })
        return obj.quantity
      }
    ),

    // add to cart item quantity by product id.
    addQuantity: createAsyncThunk(
      'cartData/addQuantity',
      async (obj) => {
        await axios.put(`${backendURL}/api/cart_items`,  { quantity: obj.quantity, products_id: obj.products_id, user_email: obj.user_email })
        return obj.quantity
      }
    ),

    // get cart item by email and id.
    getCartByEmail: createAsyncThunk(
      'cartData/getCartProductsByEmail',
      async (obj) => {
        const response = await axios.get(`${backendURL}/api/cart_items/get_cart/${obj.email}/${obj.id}`, { headers: {Authorization: `Bearer ${obj.token}` }})
        return response
      }
    ),

    // set price total in cart
    setTotalPrice: createAsyncThunk(
      'cartData/setTotalPrice',
      async (price) => { 
        return price
      }
    ),

    // set price total in cart
    getTotalPrice: createAsyncThunk(
      'cartData/getTotalPrice',
      async (obj) => { 
        const response = await axios.get(`${backendURL}/api/cart_items/total_price/${obj.user_email}`)
        return response.data[0].sum
      }
    ),


    // add product to cart
    addProductToCart: createAsyncThunk(
      'cartData/addProductToCart',
      async (obj) => {
        const response = await axios.post(`${backendURL}/api/cart_items`, {products_id: obj.products_id, user_email: obj.user_email, quantity: obj.quantity})
        return { id: response.data, products_id: obj.products_id, user_email: obj.user_email, quantity: obj.quantity }
      }
    ),

    // set add to cart toast display
    setAddToCartToastDisplayed: createAsyncThunk(
      'cartData/setAddToCartToastDisplayed',
      async (state) => { 
        return state
      }
    ),

    deleteFromCart: createAsyncThunk(
      'cartData/deleteFromCart',
      async (obj) => {
        const response = await axios.delete(`${backendURL}/api/cart_items/delete_item/${obj.user_email}/${obj.products_id}`)
        return { ...response.data[0], index: obj.index }
      }
    ),

  },



  // order routes
  orders: {

    // get list of all orders.
    getAllOrders: createAsyncThunk(
      'orderData/getAllOrders',
      async (orderObj) => { 
        const response = await axios.get(`${backendURL}/api/orders/get_all/${orderObj.email}`, { headers: {Authorization: `Bearer ${orderObj.token}` }}) 
        return response.data
      }
    ),
    // get list of all order items by id.
    getAllOrderItems: createAsyncThunk(
      'orderData/getAllOrderItems',
      async (orderObj) => { 
        const response = await axios.get(`${backendURL}/api/orders/order_products/${orderObj.id}`, { headers: {Authorization: `Bearer ${orderObj.token}` }}) 
        return response.data
      }
    ),
    addOrder: createAsyncThunk(
      'orderData/addOrder',
      async (orderObj) => {
        const response = await axios.post(`${backendURL}/api/orders`, { user_email: orderObj.user_email, total: orderObj.total_price, status: 'Ordered'}) // fix headers and data
        return response.data
      }
    ),
    
    addOrderItems: createAsyncThunk(
      'orderData/addOrderItems',
      async (orderItems) => {
        await axios.post(`${backendURL}/api/order_items`, orderItems)
      }
    ),

    deleteAllFromCart: createAsyncThunk(
      'orderData/deleteAllFromCart',
      async (email) => {
        await axios.delete(`${backendURL}/api/cart_items/delete_cart/${email}`) 
      }
    ),

    // set order placed toast display
    setAddOrderToastDisplayed: createAsyncThunk(
      'orderData/setAddOrderToastDisplayed',
      async (state) => { 
        return state
      }
    ),

  },


  // addresses routes
  addresses: {

    addAddress: createAsyncThunk(
      'addressesData/addAddress',
      async (obj) => {
        await axios.post(`${backendURL}/api/addresses`, 
          { headers: {Authorization: `Bearer ${obj.token}` }, 
          data: { 
            user_email: obj.user_email,
            full_name: obj.full_name,
            phone_number: obj.phone_number,
            country: obj.country,
            postcode: obj.postcode,
            street_address: obj.street_address,
            city: obj.city
          }
          }
        )
      }
    ),
  }









  

}


