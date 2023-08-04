/**
  * @file globalShortcut
  * @author sttk3.com
  * @copyright © 2023 sttk3.com
*/

// tauri
import { isRegistered, register, unregisterAll } from '@tauri-apps/api/globalShortcut' ;

// sttk3
import { quit } from './process' ;

const ShortcutList = [
  {
    'name': 'close', 
    'key': 'CommandOrControl+W', 
    'handler': quit, 
  }, 
  {
    'name': 'quit', 
    'key': 'CommandOrControl+Q', 
    'handler': quit, 
  }, 
] ;

// globalShortcutを有効にする
export const enable = async () => {
  for(let shortcut of ShortcutList) {
    if( !(await isRegistered(shortcut.key)) ) {
      await register(shortcut.key, shortcut.handler) ;
    }
  }
} ;

// globalShortcutを無効にする
export const disable = async () => {
  console.log(`unregisterAll Accelerator`) ;
  await unregisterAll() ;
} ;