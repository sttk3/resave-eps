// use tauri::{ CustomMenuItem, Menu, Submenu } ;
use tauri::{ Menu } ;

#[cfg(target_os = "macos")]
pub fn create(app_name: &String) -> Menu {
  let menu = tauri::Menu::os_default(app_name) ;

  menu
}

#[cfg(not(target_os = "macos"))]
pub fn create(app_name: &String) -> Menu {
  use tauri::{ CustomMenuItem, Submenu } ;
  
  let quit = CustomMenuItem::new("quit".to_string(), "Quit") ;
  let close = CustomMenuItem::new("close".to_string(), "Close") ;
  let file_menu = Submenu::new("File", Menu::new().add_item(quit).add_item(close)) ;
  let menu = Menu::new()
    .add_submenu(file_menu) ;
  
  menu
}