/**
  * @file process
  * @author sttk3.com
  * @copyright © 2023 sttk3.com
*/

// tauri
import { exit } from '@tauri-apps/api/process' ;
import { message } from '@tauri-apps/api/dialog' ;

export const quit = async () => {
  await message('quit') ;
  // await exit(0) ;
} ;

export const close = async () => {
  await message('close') ;
  // await exit(0) ;
} ;