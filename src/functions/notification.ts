/**
  * @file notification
  * @author sttk3.com
  * @copyright © 2023 sttk3.com
*/

// tauri
import { isPermissionGranted, requestPermission, sendNotification, Options } from '@tauri-apps/api/notification' ;

/**
  * 通知を出す
  * @param notificationOptions {title: string, boby?:string, icon?: string}
*/
export const notify = async (notificationOptions: Options): Promise<void> => {
  let permissionGranted = await isPermissionGranted() ;
  if(!permissionGranted) {
    const permission = await requestPermission() ;
    permissionGranted = permission === 'granted' ;
  }
  if(permissionGranted) {
    sendNotification(notificationOptions) ;
  }
} ;
