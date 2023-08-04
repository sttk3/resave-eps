use tauri::{ Menu } ;

#[cfg(target_os = "macos")]
pub fn create(app_name: &String) -> Menu {
  let menu = tauri::Menu::os_default(app_name) ;

  menu
}

#[cfg(not(target_os = "macos"))]
pub fn create(_app_name: &String) -> Menu {
  use tauri::{ CustomMenuItem, MenuItem, Submenu } ;

  // let close = CustomMenuItem::new("close".to_string(), "Close").accelerator("CommandOrControl+W") ;
  // let quit = CustomMenuItem::new("quit".to_string(), "Quit").accelerator("CommandOrControl+Q") ;
  let close = CustomMenuItem::new("close".to_string(), "Close") ;
  let quit = CustomMenuItem::new("quit".to_string(), "Quit") ;
  let file_menu = Submenu::new(
    "File", 
    Menu::new()
      .add_item(close)
      .add_item(quit)
  ) ;

  let edit_menu = Submenu::new(
    "Edit",
    Menu::new()
      .add_native_item(MenuItem::Cut)
      .add_native_item(MenuItem::Copy)
      .add_native_item(MenuItem::Paste)
      .add_native_item(MenuItem::SelectAll),
  ) ;

  let menu = Menu::new()
    .add_submenu(file_menu)
    .add_submenu(edit_menu) ;
  
  menu
}