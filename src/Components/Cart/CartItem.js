import '../../Style/App.css';
import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { api } from '../../Features/routes';
import { useAuth0 } from "@auth0/auth0-react";
import { Box, Hide, Show, Button, ListItem, useColorModeValue } from '@chakra-ui/react'
import { NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@chakra-ui/react'
import { BsCartDash } from "react-icons/bs";

function CartItem(props) {

  // React/Redux State/Action Management.
  const { user, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const numberOfCartItems = useSelector((state) => state.cartData.numberOfCartItems)
  const totalPrice = useSelector((state) => state.cartData.totalPrice)
  const borderColor = useColorModeValue('blue.500', 'blue.200');
  const cartData = useSelector((state) => state.cartData.cartProductsData)
  const backgroundColor = useColorModeValue('gray.100', 'gray.600');

  const removeFromCart = async () => {
    const quantityNumberInput = document.getElementById(`number-input-${props.product.id}`).value;
    const token = process.env.REACT_APP_IN_DEVELOPMENT? 'dev token' :
    await getAccessTokenSilently({
     audience: process.env.REACT_APP_AUTH0_AUDIENCE,
     scope: 'openid'
   })
    const index = cartData.findIndex((element) => (element.id === props.product.id))

    if (props.product.quantity - quantityNumberInput === 0) {
      await dispatch(api.cart.setNumberOfCartItems(numberOfCartItems - quantityNumberInput))

      props.product.discount? 
      await dispatch(api.cart.setTotalPrice(totalPrice - ((props.product.price*(1-(props.product.discount / 100)) * props.product.quantity))))
      :
      await dispatch(api.cart.setTotalPrice(totalPrice - (props.product.price)));

      await dispatch(api.cart.removeQuantity({ quantity: quantityNumberInput, products_id: Number(props.product.id), user_email: user.email, index }))
      await dispatch(api.products.addStock({id: props.product.id, quantity: quantityNumberInput}))
      await dispatch(api.cart.deleteFromCart({products_id: props.product.id, user_email: user.email, index}))
      await dispatch(api.cart.getCartProductsByEmail({token, email: user.email}))
    }
    if (props.product.quantity - quantityNumberInput > 0) {

      await dispatch(api.cart.setNumberOfCartItems(numberOfCartItems - quantityNumberInput))
      props.product.discount? 
        await dispatch(api.cart.setTotalPrice(totalPrice - ((props.product.price*(1-(props.product.discount / 100)) * quantityNumberInput))))
        :
        await dispatch(api.cart.setTotalPrice(totalPrice - (props.product.price)));
      
      await dispatch(api.cart.removeQuantity({ quantity: quantityNumberInput, products_id: Number(props.product.id), user_email: user.email, index }))
      await dispatch(api.products.addStock({id: props.product.id, quantity: quantityNumberInput}))
      await dispatch(api.cart.getCartProductsByEmail({token, email: user.email}))
    }
  }

  return(
    <>
      { 
        <ListItem 
          className='product'
          id={`cart-item-${props.product.id}`}
          display='flex'
          flexDirection='row'
          width={['90%','80%']} 
          justifyContent='space-between'
          alignSelf='center'
          alignItems='center'
          // border='1px solid'
          borderRadius='8px'
          borderColor={borderColor}
          margin='1rem'
          backgroundColor={backgroundColor}
        >
        <Box 
          className='product-description'
          display='flex'
          flexDirection='column'
          justifyContent='flex-start'
          textAlign='left'
          margin='1.25rem 1rem'
          width={['95%','95%','50%']}
        >
          <Box className='product-name' fontWeight="bold" fontSize={['sm', 'md']}>
            {props.product.name} 
          </Box>
          <Box 
            className='product-name' 
            fontSize={['sm', 'md']} 
            marginTop='1rem'
          >
            {props.product.description} 
          </Box>
          <Show breakpoint='(max-width: 550px)'>
          <Box
            h={['160px', '180px', '216px']}
            w={['220px', '240px', "288px"]}
            margin='0 auto'
            marginTop='1rem'
            rounded="lg"
            bgSize="cover"
            bgPos="center"
            style={{
              backgroundImage:
                `url(/images/${props.product.image_link}.png`
            }}
          >
          </Box>
          </Show>
          <Box 
            className='product-price'
            marginTop='1rem'
            marginBottom='1rem'
            fontSize={['sm', 'md']}
          >
            Total Price: {props.product.discount? 
              (((props.product.price*(1-(props.product.discount / 100)) * props.product.quantity).toFixed(2).replace('.', ','))) 
              : props.product.price  
            }€
          </Box>
          <Box 
            className='product-quantity'
            marginBottom='0.5rem'
            fontSize={['sm', 'md']}
          >
            Quantity: {props.product.quantity}
          </Box>
          <NumberInput 
            id={'number-input-'+props.product.id} 
            defaultValue={1} 
            min={1} 
            max={props.product.quantity}
            marginBottom='0.75rem'

          >
            <NumberInputField />
            <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Button 
            width='192px'
            colorScheme='blue' 
            rightIcon={<BsCartDash />}
            className='button'
            onClick={() => removeFromCart()}
          >
            Remove from Cart
          </Button>
        </Box>
        <Hide breakpoint='(max-width: 550px)'>
        <Box
          h={['170px', '180px', '270px']}
          w={["400px", "380px", "320px"]}
          marginRight='1.25rem'
          marginTop='1.25rem'
          marginBottom='1.25rem'
          rounded="lg"
          bgSize="cover"
          bgPos="center"
          style={{
            backgroundImage:
              `url(/images/${props.product.image_link}.png`
          }}
        >
        </Box>
        </Hide>
      </ListItem>
      }
    </>
  )
}

export default CartItem;