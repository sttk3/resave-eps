/**
  * @file globalShortcut
  * @author sttk3.com
  * @copyright © 2023 sttk3.com
*/

// tauri
import { ShortcutHandler, isRegistered, register, unregisterAll } from '@tauri-apps/api/globalShortcut' ;

// sttk3
import { close, quit } from './process' ;

type ShortcutItem = {
  'name': string, 
  'key': string, 
  'handler': ShortcutHandler, 
} ;

const ShortcutList: Array<ShortcutItem> = [
  {
    'name': 'close', 
    'key': 'CommandOrControl+W', 
    'handler': close, 
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
    const reserved = await isRegistered(shortcut.key) ;
    if( !reserved ) {
      await register(shortcut.key, shortcut.handler) ;
      console.log(`Registered shortcut "${shortcut.name}"`) ;
    }
  }
} ;

// globalShortcutを無効にする
export const disable = async () => {
  console.log(`Unregistered all shortcuts`) ;
  await unregisterAll() ;
} ;