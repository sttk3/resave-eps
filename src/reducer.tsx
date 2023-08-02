/**
  * @file reducer
  * @author sttk3.com
  * @copyright © 2023 sttk3.com
*/

export type State = {
  theme: string, 
  fileDropHover: boolean, 
} ;

export const defaultState: State = {
  theme: 'light', 
  fileDropHover: false, 
} ;

/**
  * ActionType
*/
const appIdentifier = 'resaveEPS' ;
export const ActionType = {
  setTheme: `${appIdentifier}.setResultType`, 
  setFileDropHover: `${appIdentifier}.setFileDropHover`, 
} as const ;
export type ActionType = typeof ActionType[keyof typeof ActionType] ;

const setTheme = (value: string) => {
  return {
    type: ActionType.setTheme, 
    payload: {value}, 
  } ;
} ;

const setFileDropHover = (value: boolean) => {
  return {
    type: ActionType.setFileDropHover, 
    payload: {value}, 
  } ;
} ;

export type Action = 
  | ReturnType<typeof setTheme>
  | ReturnType<typeof setFileDropHover>
;

export const reducer = (state: State, action: Action): State => {
  let tempState = structuredClone(state) ;

  let newState: State ;
  switch(action.type) {
    case ActionType.setTheme:
      tempState.theme = action.payload.value ;
      newState = tempState ;
      break ;
    case ActionType.setFileDropHover:
      tempState.fileDropHover = action.payload.value ;
      newState = tempState ;
      break ;
  } ;

  return newState ;
} ;