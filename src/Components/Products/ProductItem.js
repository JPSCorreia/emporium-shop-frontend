import '../../Style/App.css';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { api } from '../../Features/routes';
import { Box, Show, Hide, Text, Button, useColorModeValue, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react'
import { NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@chakra-ui/react'
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from "react-router-dom";
import { BsCartPlus } from "react-icons/bs";
import { NavLink } from 'react-router-dom';
import { ChevronRightIcon } from '@chakra-ui/icons';
import ProductReviewList from './ProductReviewList';
import Loader from '../Loader';
import ReactStars from "react-rating-stars-component";


function ProductItem() {

  // React/Redux State/Action Management.
  const { user, isAuthenticated, getAccessTokenSilently, loginWithRedirect } = useAuth0();
  const dispatch = useDispatch();
  const borderColor = useColorModeValue('blue.500', 'blue.200');
  const { id } = useParams();
  const page = Number(useParams().page);
  const navigate = useNavigate();
  const productIsLoading = useSelector((state) => state.productData.dataIsLoading)
  const product = useSelector((state) => state.productData.data || '')
  const cartData = useSelector((state) => state.cartData.cartProductsData)
  const backgroundColor = useColorModeValue('gray.100', 'gray.600');
  const themeColor = useColorModeValue('blue.500', 'blue.200');
  const discountRedColor = useColorModeValue('red.500', 'red.300');
  const discountGreenColor = useColorModeValue('green.500', 'green.300');
  const discountYellowColor = useColorModeValue('yellow.600', 'yellow.400');
  const [isLoaded, setIsLoaded] = useState(false)
  
  // define product and review based on product id and page
  const productIndex = id-1-((page-1)*9)
  const productItem = product.data[productIndex]; 
  const reviewsData = useSelector((state) => state.reviewsData[productItem.id] || [])  

  // get product average rating from all user reviews
  let totalRating = Math.ceil(reviewsData.reduce(function (previousValue, currentValue) {
    return previousValue + currentValue.rating
  }, 0)/ reviewsData.length);

  useEffect(() => {
    const getData = async () => {
      const token = process.env.REACT_APP_IN_DEVELOPMENT? 'dev token' :
      await getAccessTokenSilently({
       audience: process.env.REACT_APP_AUTH0_AUDIENCE,
       scope: 'openid'
     })
        await dispatch(api.products.getProductPage(page)) 
      if (isAuthenticated) await dispatch(api.cart.getCartProductsByEmail({ token, email: user.email }))
    }
    getData();
    
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const addToCart = async () => {

    if (isAuthenticated) {
      //Search if item has stock
      if (product.data[id-1-((page-1)*9)].stock > 0) {
        const quantity = document.getElementById(`number-input-${id}`).value;
        const token = await getAccessTokenSilently({        
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          scope: 'openid'
        })
        // create a new row if .data[id-1-((page-1)*9)] doesn't already exist
        if ( cartData.length < 1  || !(cartData.find(element => element.id === Number(id))?.id === Number(id)) ) {
          setIsLoaded(true)
          await dispatch(api.cart.addProductToCart({user_email: user.email, products_id: Number(id), quantity: quantity }))
          dispatch(api.products.removeStock({id, quantity: quantity}))
        // update row if product already exists
        } else { 
          setIsLoaded(true)
           dispatch(api.products.removeStock({id, quantity: quantity}))
          await dispatch(api.cart.addQuantity({ quantity: quantity, products_id: Number(id), user_email: user.email }))
        }
        // update number of items in cart and navigate to products page while showing toast
        await dispatch(api.cart.getNumberOfCartItems({token, email: user.email}))
        await dispatch(api.cart.getTotalPrice({user_email: user.email}))
        await dispatch(api.cart.setAddToCartToastDisplayed(false))
        navigate(`/products/${page}`, {state: { product: productItem, quantity, toast: true } } )
      }
    } else {
      loginWithRedirect();
    }
  }

  if (productIsLoading && !isLoaded) {
    return <Loader />
  }

  return(
    <Box>
      <Breadcrumb  
        display='flex' 
        width={['90%','80%']}
        margin='0.5rem auto'
        paddingTop='0.25rem'
        separator={<ChevronRightIcon color='gray.500' />}
        className='breadcrumb'
        fontSize={['sm', 'md']}
      >
        <BreadcrumbItem  marginLeft='0' marginRight='0' marginBottom='0.25rem'>
          <BreadcrumbLink  as={NavLink} to='/'>
            Home
          </BreadcrumbLink>
        </BreadcrumbItem >
        <BreadcrumbItem  marginLeft='0' marginRight='0' marginBottom='0.25rem'>
          <BreadcrumbLink as={NavLink} to={`/products/${page}`}>
            Products ({`${page}`})
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage marginLeft='0' marginRight='0' marginBottom='0.25rem'>
          <BreadcrumbLink color={themeColor}>
            Product #{id}
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      <Box
        width="100%"
        display='flex'
        justifyContent='center'
        margin='0 auto'
      >
        <Box
          className='product'
          display='flex'
          flexDirection='row'
          width={['90%','80%']}
          justifyContent='space-between'
          alignItems='center'
          borderColor={borderColor}
          backgroundColor={backgroundColor}
          borderRadius='8px'
          margin='1rem'
          marginBottom='0.75rem'
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
            <Box 
              className='product-name'
              fontSize={['sm', 'md']}
            >
              {productItem.name}
            </Box>
            <Box 
              className='product-name'
              marginTop='1rem'
              fontSize={['sm', 'md']}
            >
              {productItem.description} 
            </Box>
            <Show breakpoint='(max-width: 650px)'>
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
                    `url(/images/${productItem.image_link}.png`
                }}
              >
              </Box>
            </Show>
            {!isNaN(totalRating) &&
              <Box
                marginTop='1rem'
                display='flex'
              >
                
                <ReactStars
                  count={5}
                  value={totalRating}
                  edit={false}
                  size={18}
                  color2={'#ffd700'} 
                />
                { reviewsData.length === 1 && <Text fontSize='xs' mr='0.25rem'>({reviewsData.length} Rating)</Text> }
                { reviewsData.length !== 1 && <Text fontSize='xs' mr='0.25rem'>({reviewsData.length} Ratings)</Text> }
  
              </Box>
            }
            {isNaN(totalRating) &&
              <Box
                marginTop='1rem'
                display='flex'
              >
                <ReactStars
                  count={5}
                  value={0}
                  edit={false}
                  size={18}
                  color2={'#ffd700'} 
                />
                <Text fontSize='xs' mr='0.25rem'>({reviewsData.length} Ratings)</Text>
              </Box>
            }
            <Box 
              className='product-price'
              marginTop='1rem'
              marginBottom='1rem'
              fontSize={['sm', 'md']}
            >
              Price:  
              { productItem.discount?
              <>
                <Text as='span' fontSize={['xs','sm']} textDecoration='line-through' color={discountRedColor}> {productItem.price.toFixed(2).replace('.', ',')}€</Text>
                <Text as='span' fontSize={['lg','xl']} color={discountGreenColor}>{(productItem.price*(1-(productItem.discount / 100))).toFixed(2).replace('.', ',')}€</Text>
                <Text as='span' fontSize={['sm','md']} color={discountYellowColor}>(-{productItem.discount}%)</Text>
              </>
              :
              <>
                <Text as='span' fontSize={['sm','md']} >{(productItem.price).toFixed(2).replace('.', ',')}€</Text>
              </>
              }
            </Box>
            <Box 
              className='product-stock'
              marginBottom='0.5rem'
              fontSize={['sm', 'md']}
            >
              Stock: {productItem.stock}
            </Box>
              <NumberInput 
                id={'number-input-'+id} 
                defaultValue={1} 
                min={1} 
                max={productItem.stock}
                marginBottom='0.75rem'
              >
                <NumberInputField />
                <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>

              <Button 
                colorScheme='blue' 
                width='144px'
                className='button'
                rightIcon={<BsCartPlus />}
                onClick={() => addToCart()}
              >
                Add to Cart
              </Button>
          </Box>
          <Hide breakpoint='(max-width: 650px)'>
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
                  `url(/images/${productItem.image_link}.png`
              }}
            >
            </Box>
          </Hide>
        </Box>
      </Box>
      <ProductReviewList 
        productsId={productItem.id}
      />
    </Box>
  )
}

export default ProductItem;