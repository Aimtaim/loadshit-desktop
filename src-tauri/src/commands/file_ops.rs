use std::path::Path;
use std::process::Command as StdCommand;
use tauri::command;

/// Copy a file from source to destination
#[command]
pub async fn copy_file(source: String, destination: String) -> Result<(), String> {
    let source_path = Path::new(&source);
    let dest_path = Path::new(&destination);

    if !source_path.exists() {
        return Err("Quelldatei nicht gefunden".to_string());
    }

    std::fs::copy(source_path, dest_path)
        .map_err(|e| format!("Kopieren fehlgeschlagen: {}", e))?;

    Ok(())
}

/// Open folder in file manager and select/highlight a specific file
#[command]
pub async fn open_folder_with_selection(file_path: String) -> Result<(), String> {
    let path = Path::new(&file_path);

    if !path.exists() {
        // If file doesn't exist, try to open parent directory
        if let Some(parent) = path.parent() {
            return open_folder(parent.to_string_lossy().to_string()).await;
        }
        return Err("Datei nicht gefunden".to_string());
    }

    #[cfg(target_os = "windows")]
    {
        StdCommand::new("explorer")
            .args(["/select,", &file_path])
            .spawn()
            .map_err(|e| format!("Fehler beim Öffnen: {}", e))?;
    }

    #[cfg(target_os = "macos")]
    {
        StdCommand::new("open")
            .args(["-R", &file_path])
            .spawn()
            .map_err(|e| format!("Fehler beim Öffnen: {}", e))?;
    }

    #[cfg(target_os = "linux")]
    {
        // Try dbus method first (works with most modern file managers)
        let dbus_result = StdCommand::new("dbus-send")
            .args([
                "--session",
                "--dest=org.freedesktop.FileManager1",
                "--type=method_call",
                "/org/freedesktop/FileManager1",
                "org.freedesktop.FileManager1.ShowItems",
                &format!("array:string:file://{}", file_path),
                "string:",
            ])
            .spawn();

        if dbus_result.is_err() {
            // Fallback: just open the parent folder with xdg-open
            if let Some(parent) = path.parent() {
                StdCommand::new("xdg-open")
                    .arg(parent.to_string_lossy().to_string())
                    .spawn()
                    .map_err(|e| format!("Fehler beim Öffnen: {}", e))?;
            }
        }
    }

    Ok(())
}

/// Open a file with the system's default application (e.g., video player)
#[command]
pub async fn open_file(file_path: String) -> Result<(), String> {
    let path = Path::new(&file_path);

    if !path.exists() {
        return Err(format!("Datei nicht gefunden: {}", file_path));
    }

    #[cfg(target_os = "windows")]
    {
        StdCommand::new("cmd")
            .args(["/C", "start", "", &file_path])
            .spawn()
            .map_err(|e| format!("Fehler beim Öffnen: {}", e))?;
    }

    #[cfg(target_os = "macos")]
    {
        StdCommand::new("open")
            .arg(&file_path)
            .spawn()
            .map_err(|e| format!("Fehler beim Öffnen: {}", e))?;
    }

    #[cfg(target_os = "linux")]
    {
        StdCommand::new("xdg-open")
            .arg(&file_path)
            .spawn()
            .map_err(|e| format!("Fehler beim Öffnen: {}", e))?;
    }

    Ok(())
}

/// Open a folder in the default file manager
#[command]
pub async fn open_folder(folder_path: String) -> Result<(), String> {
    let path = Path::new(&folder_path);

    if !path.exists() {
        return Err("Ordner nicht gefunden".to_string());
    }

    #[cfg(target_os = "windows")]
    {
        StdCommand::new("explorer")
            .arg(&folder_path)
            .spawn()
            .map_err(|e| format!("Fehler beim Öffnen: {}", e))?;
    }

    #[cfg(target_os = "macos")]
    {
        StdCommand::new("open")
            .arg(&folder_path)
            .spawn()
            .map_err(|e| format!("Fehler beim Öffnen: {}", e))?;
    }

    #[cfg(target_os = "linux")]
    {
        StdCommand::new("xdg-open")
            .arg(&folder_path)
            .spawn()
            .map_err(|e| format!("Fehler beim Öffnen: {}", e))?;
    }

    Ok(())
}
