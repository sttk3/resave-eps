/**
  * @file process
  * @author sttk3.com
  * @copyright © 2023 sttk3.com
*/

// tauri
import { exit } from '@tauri-apps/api/process' ;

export const close = async (): Promise<void> => {
  await exit(0) ;
} ;

export const quit = async (): Promise<void> => {
  await exit(0) ;
} ;