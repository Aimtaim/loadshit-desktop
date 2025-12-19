// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

use commands::download::{get_download_dir, get_video_info, start_download};
use commands::file_ops::{copy_file, open_file, open_folder, open_folder_with_selection};
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager, WindowEvent,
};

#[cfg(target_os = "windows")]
use window_vibrancy::apply_mica;

#[cfg(target_os = "macos")]
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

/// Set window transparency/vibrancy effect
#[tauri::command]
async fn set_window_transparent(window: tauri::Window, transparent: bool) -> Result<(), String> {
    if transparent {
        #[cfg(target_os = "windows")]
        {
            apply_mica(&window, Some(true)).map_err(|e| e.to_string())?;
        }

        #[cfg(target_os = "macos")]
        {
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
                .map_err(|e| e.to_string())?;
        }

        #[cfg(target_os = "linux")]
        {
            // Linux doesn't support native blur, but we can make window transparent
            // The CSS will handle the visual effect
        }
    }
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            // Create tray menu
            let show_i = MenuItem::with_id(app, "show", "Anzeigen", true, None::<&str>)?;
            let hide_i = MenuItem::with_id(app, "hide", "Minimieren", true, None::<&str>)?;
            let quit_i = MenuItem::with_id(app, "quit", "Beenden", true, None::<&str>)?;

            let menu = Menu::with_items(app, &[&show_i, &hide_i, &quit_i])?;

            // Create tray icon
            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .tooltip("LoadSh.it Desktop")
                .on_menu_event(|app, event| match event.id.as_ref() {
                    "show" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    "hide" => {
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.hide();
                        }
                    }
                    "quit" => {
                        app.exit(0);
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .on_window_event(|window, event| {
            // Handle window close - minimize to tray instead
            if let WindowEvent::CloseRequested { api, .. } = event {
                // Hide window instead of closing
                let _ = window.hide();
                api.prevent_close();
            }
        })
        .invoke_handler(tauri::generate_handler![
            start_download,
            get_download_dir,
            get_video_info,
            set_window_transparent,
            copy_file,
            open_file,
            open_folder,
            open_folder_with_selection
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
