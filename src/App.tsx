// preact
import { h } from 'preact' ;
import { useEffect, useReducer } from 'preact/hooks' ;

// tauri
import { appWindow } from '@tauri-apps/api/window' ;
import { listen, TauriEvent, UnlistenFn } from '@tauri-apps/api/event' ;
import { getMatches } from '@tauri-apps/api/cli' ;

// adobe
import '@spectrum-web-components/theme/sp-theme.js' ;
import '@spectrum-web-components/theme/src/themes.js' ;

// sttk3
import { iconDrop } from './icons' ;
import { ActionType, defaultState, reducer } from './reducer' ;
import './App.css' ;
import { OS } from './functions/constants' ;
import { resaveEPS } from './functions/resaveEPS' ;
import { enable, disable } from './functions/globalShortcut' ;
import { quit } from './functions/process' ;

export const App = () => {
  const [state, dispatch] = useReducer(reducer, defaultState) ;

  // mount時初回実行
  useEffect(() => {
    let unlistenThemeChanged: UnlistenFn, unlistenFileDrop: UnlistenFn, unlistenFileDropHover: UnlistenFn, unlistenFileDropCancelled: UnlistenFn, unlistenFocus: UnlistenFn, unlistenBlur: UnlistenFn, unlistenCloseRequested: UnlistenFn ;

    (async () => {
      // theme-changedの監視を始める
      const currentTheme = await appWindow.theme() ;
      dispatch({type: ActionType.setTheme, payload: {value: currentTheme ?? 'light'}}) ;
      unlistenThemeChanged = await listen<string>(TauriEvent.WINDOW_THEME_CHANGED, (event) => {
        dispatch({type: ActionType.setTheme, payload: {value: event.payload}}) ;
      }) ;

      // file-dropの監視を始める
      unlistenFileDrop = await listen<string>(TauriEvent.WINDOW_FILE_DROP, async (event) => {
        // ドロップした後はずっとhover状態になるので，自力でOFFにする
        dispatch({type: ActionType.setFileDropHover, payload: {value: false}}) ;

        // ここにファイル処理を入れる
        const dropPathList = event.payload as unknown as Array<string> ;
        await resaveEPS(dropPathList) ;
      }) ;

      // file-drop-hoverの監視を始める
      unlistenFileDropHover = await listen<string>(TauriEvent.WINDOW_FILE_DROP_HOVER, (event) => {
        dispatch({type: ActionType.setFileDropHover, payload: {value: true}}) ;
      }) ;

      // file-drop-cancelledの監視を始める
      unlistenFileDropCancelled = await listen<string>(TauriEvent.WINDOW_FILE_DROP_CANCELLED, (event) => {
        dispatch({type: ActionType.setFileDropHover, payload: {value: false}}) ;
      }) ;

      // Windows限定globalShortcut操作
      if(OS.type === 'Windows_NT') {
        // ウインドウフォーカス時，globalShortcutを有効にする
        unlistenFocus = await listen<string>(TauriEvent.WINDOW_FOCUS, enable) ;

        // ウインドウのフォーカスが外れたとき，globalShortcutを無効にする
        unlistenBlur = await listen<string>(TauriEvent.WINDOW_BLUR, disable) ;

        // ウインドウを閉じるとき，globalShortcutを無効にする
        unlistenCloseRequested = await listen<string>(TauriEvent.WINDOW_CLOSE_REQUESTED, disable) ;

        // 初回，明示的にglobalShortcutを有効化する。ここをsetFocusで実現するのは難しいようだ
        await enable() ;
      }

      // cliで実行された場合は処理する
      getMatches().then(async (matches) => {
        const argValue = matches.args.from?.value ;
        if(Array.isArray(argValue)) {
          const targetItems = argValue.filter((item) => {return (typeof item === 'string')}) ;
          await resaveEPS(targetItems) ;
        }

        // 通知が見れるくらいの余裕を持ってから終了する
        setTimeout(async () => {
          await quit() ;
        }, 3000) ;
      }) ;
    })() ;
    
    // unmount時，監視を止める
    return () => {
      const unlistenList = [unlistenThemeChanged, unlistenFileDrop, unlistenFileDropHover, unlistenFileDropCancelled
      , unlistenFocus, unlistenBlur, unlistenCloseRequested] ;
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