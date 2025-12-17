// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

use commands::download::{get_download_dir, get_video_info, start_download};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            start_download,
            get_download_dir,
            get_video_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
