/**
  * @file constants
  * @author sttk3.com
  * @copyright © 2023 sttk3.com
*/

// tauri
import { locale, platform, type, Platform, OsType } from '@tauri-apps/api/os' ;

/**
  * アプリの識別子。macOSのbundle idを流用
*/
export const AppID = {
  'illustrator': 'com.adobe.illustrator', 
  'indesign': 'com.adobe.InDesign', 
  'photoshop': 'com.adobe.Photoshop', 
} ;

/**
  * 言語・OSの種類などを保持する型
*/
export interface Host {
  locale: string|null, 
  platform: Platform, 
  type: OsType,
}

/**
  * 言語・OSの種類などを保持する変数
*/
export let OS: Host ;
(async () => {
  OS = {
    locale: await locale(), 
    platform: await platform(), 
    type: await type(),
  } ;
})() ;