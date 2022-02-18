import { ThunkAction } from 'redux-thunk'

import { LoadingAction, SET_LOADING, SIGN_OUT } from '../types'
import { RootState } from '..'
import FirebaseApi from '../../FirebaseApi'

// Set loading
export const setLoading = (
  value: boolean,
): ThunkAction<void, RootState, null, LoadingAction> => {
  return (dispatch) => {
    dispatch({
      type: SET_LOADING,
      payload: value,
    })
  }
}

// Log out
export const signout = (): ThunkAction<
  void,
  RootState,
  null,
  LoadingAction
> => {
  return async (dispatch) => {
    try {
      dispatch(setLoading(true))
      await FirebaseApi.firebaseApp.auth().signOut()
      dispatch({
        type: SIGN_OUT,
      })
    } catch (err) {
      // console.log(err)
      dispatch(setLoading(false))
    }
  }
}
