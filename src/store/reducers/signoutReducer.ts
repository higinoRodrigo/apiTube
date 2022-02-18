import { LoadingAction, LoadingState, SET_LOADING, SIGN_OUT } from '../types'

const initialState: LoadingState = {
  loading: false,
}

export default (state = initialState, action: LoadingAction) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      }
    case SIGN_OUT:
      return {
        ...state,
        user: null,
        authenticated: false,
        loading: false,
      }
    default:
      return state
  }
}
