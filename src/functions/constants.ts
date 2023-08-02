/**
  * @file constants
  * @author sttk3.com
  * @copyright © 2023 sttk3.com
*/

import { locale, platform, type, Platform, OsType } from '@tauri-apps/api/os' ;

export const AppID = {
  'illustrator': 'com.adobe.illustrator', 
  'indesign': 'com.adobe.InDesign', 
  'photoshop': 'com.adobe.Photoshop', 
} ;

export type Host = {
  locale: string|null, 
  platform: Platform, 
  type: OsType,
} ;

export let OS: Host ;
(async () => {
  OS = {
    locale: await locale(), 
    platform: await platform(), 
    type: await type(),
  } ;
})() ;