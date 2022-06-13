import '../../Style/App.css';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../../Features/routes';
import { useToast, Icon, useColorModeValue, IconButton, Textarea, Select, VStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Input, FormControl, FormLabel, FormErrorMessage, Button, useDisclosure, propNames } from '@chakra-ui/react'
import { useAuth0 } from "@auth0/auth0-react";
import { reviewSchema } from '../../Validations/ReviewValidation';
import {RiPlayListAddFill} from 'react-icons/ri'
import { useFormik, Field } from 'formik';
import { ImStarEmpty, ImStarHalf, ImStarFull } from 'react-icons/im'
import ReactStars from "react-rating-stars-component";

function ProductNewReviewButton(props) {

  // React/Redux State/Action Management.
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();
  const toast = useToast()
  const backgroundColor = useColorModeValue("white", "gray.700")


  const formik = useFormik({

    initialValues: {
      name: '',
      comment: '',
      rating: ''
    },

    validationSchema: reviewSchema,

    onSubmit: async (values, actions) => {
      const token = process.env.REACT_APP_IN_DEVELOPMENT? 'dev token' :
      await getAccessTokenSilently({
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: 'openid'
      })

      // dispatch review

      await dispatch(api.reviews.addReview({
        token, 
        products_id: props.productsId,
        user_email: user.email, 
        full_name: formik.values.name,
        comment: formik.values.comment,
        rating: formik.values.rating,
      }))

      onClose();
      actions.resetForm();

      toast({
        title: `Review Created`,
        description: 'Your review was created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })  

    }
  })

  const handleKeypress = (e) => {
    //it triggers by pressing the enter key
    if (e.charCode === 13) {
      formik.handleSubmit();
    }
  };

  const ratingChanged = (newRating) => {
    formik.setFieldValue('rating', newRating)
  };





  return(
    <VStack
      display='flex'
      width={['90%','80%']}
      flexDirection='row'
      justifyContent='flex-start'
      margin='0.75rem auto' 
      as='form'
    >
      <Button 
        colorScheme='green' 
        className='button'
        onClick={onOpen}
        rightIcon={<RiPlayListAddFill />}
      >
        Review Product
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size='3xl'
      >
      <ModalOverlay />
      <ModalContent width='90%'>
        <ModalHeader>Create review</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl mt={4} isInvalid={formik.errors.name && formik.touched.name}>  
            <FormLabel>Full name</FormLabel>
            <Input 
              id='form-name'
              name='name' 
              placeholder='' 
              onKeyPress={handleKeypress}
              {...formik.getFieldProps('name')}
            />
            <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
          </FormControl>
          <FormControl className='react-stars-edit' display='flex' mt={4} isInvalid={formik.errors.rating && formik.touched.rating}>
            <FormLabel marginBottom='0'>Overall rating:</FormLabel>
            <ReactStars
              className='react-stars-edit'
              name='rating'
              count={5}
              onChange={ratingChanged}
              size={21}
              color2={'#ffd700'} 
              onBlur={formik.handleBlur}
              // {...formik.getFieldProps('rating')}
            />
            <FormErrorMessage>{formik.errors.rating}</FormErrorMessage>
          </FormControl>
          <FormControl mt={3} isInvalid={formik.errors.comment && formik.touched.comment}>
            <FormLabel >Add a written review</FormLabel>
            <Textarea 
              id='form-comment'
              placeholder='What did you like or dislike? What did you use this product for?'
              name='comment'
              // onKeyPress={handleKeypress} 
              {...formik.getFieldProps('comment')}
            />
            <FormErrorMessage>{formik.errors.comment}</FormErrorMessage>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={formik.handleSubmit} >
            Save
          </Button>
          <Button onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
      </Modal>
    </VStack>
  )

}

export default ProductNewReviewButton;