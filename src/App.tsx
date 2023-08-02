// preact
import { h } from 'preact' ;
import { useEffect, useReducer } from 'preact/hooks' ;

// tauri
import { appWindow } from '@tauri-apps/api/window' ;
import { listen, UnlistenFn } from '@tauri-apps/api/event' ;
import { message } from '@tauri-apps/api/dialog' ;

// adobe
import '@spectrum-web-components/theme/sp-theme.js' ;
import '@spectrum-web-components/theme/src/themes.js' ;

// sttk3
import { iconDrop } from './icons' ;
import { ActionType, defaultState, reducer } from './reducer' ;
import { AppID } from './functions/constants' ;
import { execJavaScript } from './functions/exec' ;
import { resaveEPS } from './functions/resaveEPS' ;
import './App.css' ;

export const App = () => {
  const [state, dispatch] = useReducer(reducer, defaultState) ;

  // mount時初回実行
  useEffect(() => {
    let unlistenThemeChanged: UnlistenFn, unlistenFileDrop: UnlistenFn, unlistenFileDropHover: UnlistenFn, unlistenFileDropCancelled: UnlistenFn ;

    (async () => {
      // theme-changedの監視を始める
      const currentTheme = await appWindow.theme() ;
      dispatch({type: ActionType.setTheme, payload: {value: currentTheme ?? 'light'}}) ;
      unlistenThemeChanged = await listen<string>('tauri://theme-changed', (event) => {
        dispatch({type: ActionType.setTheme, payload: {value: event.payload}}) ;
      }) ;

      // file-dropの監視を始める
      unlistenFileDrop = await listen<string>('tauri://file-drop', async (event) => {
        // ドロップした後はずっとhover状態になるので，自力でOFFにする
        dispatch({type: ActionType.setFileDropHover, payload: {value: false}}) ;

        // ここにファイル処理を入れる
        const dropPathList = event.payload as unknown as Array<string> ;
        await resaveEPS(dropPathList) ;
      }) ;

      // file-drop-hoverの監視を始める
      unlistenFileDropHover = await listen<string>('tauri://file-drop-hover', (event) => {
        dispatch({type: ActionType.setFileDropHover, payload: {value: true}}) ;
      }) ;

      // file-drop-cancelledの監視を始める
      unlistenFileDropCancelled = await listen<string>('tauri://file-drop-cancelled', (event) => {
        dispatch({type: ActionType.setFileDropHover, payload: {value: false}}) ;
      }) ;
    })() ;
    
    // unmount時，監視を止める
    return () => {
      const unlistenList = [unlistenThemeChanged, unlistenFileDrop, unlistenFileDropHover, unlistenFileDropCancelled] ;
      for(let unlisten of unlistenList) {
        if(unlisten) {unlisten() ;}
      }
    } ;
  }, []) ;

  return (
    <sp-theme
      class={`container${state.fileDropHover ? ' window-hover' : ''}`}
      theme='spectrum'
      color={state.theme}
      scale='large'
    >
      <div>
        <div class={`icon-drop${state.fileDropHover ? '-hover' : ''}`}>{iconDrop}</div>
      </div>
    </sp-theme>
  );
} ;