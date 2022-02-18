export const SIGN_OUT = 'SIGN_OUT'
export const SET_LOADING = 'SET_LOADING'

export interface LoadingState {
  loading: boolean
}

// Actions
interface SetLoadingAction {
  type: typeof SET_LOADING
  payload: boolean
}

interface SignOutAction {
  type: typeof SIGN_OUT
}

export type LoadingAction = SetLoadingAction | SignOutAction
