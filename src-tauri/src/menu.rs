use tauri::{ Menu } ;

pub fn create(app_name: &String) -> Menu {
  let menu = tauri::Menu::os_default(app_name) ;

  menu
}
