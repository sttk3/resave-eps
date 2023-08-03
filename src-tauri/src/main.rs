// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod menu ;

fn main() {
  let context = tauri::generate_context!() ;
  let app_name = &context.package_info().name ;
  tauri::Builder::default()
    .menu(menu::create(app_name))
    .on_menu_event(|event| match event.menu_item_id() {
      "close" => {
        event.window().close().unwrap() ;
      }
      "quit" => {
        std::process::exit(0) ;
      }
      _ => {}
    })
    .run(context)
    .expect("error while running tauri application") ;
}
