use serde::{Deserialize, Serialize};
use std::process::Stdio;
use tauri::{command, AppHandle, Emitter};
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio::process::Command;

#[derive(Debug, Serialize, Deserialize)]
pub struct DownloadRequest {
    pub url: String,
    pub format: String,
    pub quality: String,
    pub output_dir: String,
}

#[derive(Debug, Serialize, Clone)]
pub struct DownloadProgress {
    pub job_id: String,
    pub progress: f32,
    pub status: String,
    pub speed: Option<String>,
    pub eta: Option<String>,
    pub filename: Option<String>,
    pub error: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct VideoInfo {
    pub title: String,
    pub channel: Option<String>,
    pub duration: Option<f64>,
    pub thumbnail: Option<String>,
    pub formats: Vec<String>,
}

#[command]
pub async fn start_download(app: AppHandle, request: DownloadRequest) -> Result<String, String> {
    let job_id = uuid::Uuid::new_v4().to_string();
    let job_id_clone = job_id.clone();
    let app_clone = app.clone();

    // Build format argument based on quality
    let format_arg = match request.quality.as_str() {
        "360p" => "bestvideo[height<=360]+bestaudio/best[height<=360]",
        "480p" => "bestvideo[height<=480]+bestaudio/best[height<=480]",
        "720p" => "bestvideo[height<=720]+bestaudio/best[height<=720]",
        "1080p" => "bestvideo[height<=1080]+bestaudio/best[height<=1080]",
        "1440p" | "2k" => "bestvideo[height<=1440]+bestaudio/best[height<=1440]",
        "2160p" | "4k" => "bestvideo[height<=2160]+bestaudio/best",
        _ => "best",
    };

    let output_template = format!("{}/%(title)s.%(ext)s", request.output_dir);
    let is_audio = matches!(
        request.format.as_str(),
        "mp3" | "aac" | "wav" | "flac" | "ogg" | "m4a" | "opus"
    );

    // Emit initial progress
    let _ = app.emit(
        "download_progress",
        DownloadProgress {
            job_id: job_id.clone(),
            progress: 0.0,
            status: "starting".to_string(),
            speed: None,
            eta: None,
            filename: None,
            error: None,
        },
    );

    tokio::spawn(async move {
        let mut cmd = Command::new("yt-dlp");

        if is_audio {
            cmd.arg("-x")
                .arg("--audio-format")
                .arg(&request.format)
                .arg("--audio-quality")
                .arg("0");
        } else {
            cmd.arg("-f")
                .arg(format_arg)
                .arg("--merge-output-format")
                .arg(&request.format);
        }

        cmd.arg("-o")
            .arg(&output_template)
            .arg("--progress")
            .arg("--newline")
            .arg("--no-playlist")
            .arg(&request.url)
            .stdout(Stdio::piped())
            .stderr(Stdio::piped());

        match cmd.spawn() {
            Ok(mut child) => {
                if let Some(stdout) = child.stdout.take() {
                    let reader = BufReader::new(stdout);
                    let mut lines = reader.lines();

                    while let Ok(Some(line)) = lines.next_line().await {
                        if line.contains("[download]") && line.contains("%") {
                            let progress = parse_progress(&line).unwrap_or(0.0);
                            let speed = parse_speed(&line);
                            let eta = parse_eta(&line);

                            let _ = app_clone.emit(
                                "download_progress",
                                DownloadProgress {
                                    job_id: job_id_clone.clone(),
                                    progress,
                                    status: "downloading".to_string(),
                                    speed,
                                    eta,
                                    filename: None,
                                    error: None,
                                },
                            );
                        } else if line.contains("[Merger]") || line.contains("[ffmpeg]") {
                            let _ = app_clone.emit(
                                "download_progress",
                                DownloadProgress {
                                    job_id: job_id_clone.clone(),
                                    progress: 99.0,
                                    status: "merging".to_string(),
                                    speed: None,
                                    eta: Some("Finalisiere...".to_string()),
                                    filename: None,
                                    error: None,
                                },
                            );
                        }
                    }
                }

                let status = child.wait().await;
                let (final_status, error) = match status {
                    Ok(s) if s.success() => ("completed".to_string(), None),
                    Ok(_) => ("failed".to_string(), Some("Download fehlgeschlagen".to_string())),
                    Err(e) => ("failed".to_string(), Some(e.to_string())),
                };

                let _ = app_clone.emit(
                    "download_progress",
                    DownloadProgress {
                        job_id: job_id_clone,
                        progress: if final_status == "completed" { 100.0 } else { 0.0 },
                        status: final_status,
                        speed: None,
                        eta: None,
                        filename: None,
                        error,
                    },
                );
            }
            Err(e) => {
                let _ = app_clone.emit(
                    "download_progress",
                    DownloadProgress {
                        job_id: job_id_clone,
                        progress: 0.0,
                        status: "failed".to_string(),
                        speed: None,
                        eta: None,
                        filename: None,
                        error: Some(format!("yt-dlp nicht gefunden: {}", e)),
                    },
                );
            }
        }
    });

    Ok(job_id)
}

#[command]
pub async fn get_download_dir() -> Result<String, String> {
    dirs::download_dir()
        .or_else(|| dirs::home_dir().map(|h| h.join("Downloads")))
        .map(|p| p.to_string_lossy().to_string())
        .ok_or_else(|| "Download-Verzeichnis nicht gefunden".to_string())
}

#[command]
pub async fn get_video_info(url: String) -> Result<VideoInfo, String> {
    let output = Command::new("yt-dlp")
        .arg("--dump-json")
        .arg("--no-download")
        .arg("--no-playlist")
        .arg(&url)
        .output()
        .await
        .map_err(|e| format!("yt-dlp nicht gefunden: {}", e))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("Fehler: {}", stderr));
    }

    let json: serde_json::Value =
        serde_json::from_slice(&output.stdout).map_err(|e| format!("JSON Parse Error: {}", e))?;

    Ok(VideoInfo {
        title: json["title"].as_str().unwrap_or("Unbekannt").to_string(),
        channel: json["channel"].as_str().map(|s| s.to_string()),
        duration: json["duration"].as_f64(),
        thumbnail: json["thumbnail"].as_str().map(|s| s.to_string()),
        formats: vec![
            "mp4".to_string(),
            "webm".to_string(),
            "mkv".to_string(),
            "mp3".to_string(),
        ],
    })
}

fn parse_progress(line: &str) -> Option<f32> {
    line.split_whitespace()
        .find(|s| s.ends_with('%'))
        .and_then(|s| s.trim_end_matches('%').parse().ok())
}

fn parse_speed(line: &str) -> Option<String> {
    line.split("at ")
        .nth(1)
        .and_then(|s| s.split_whitespace().next())
        .map(|s| s.to_string())
}

fn parse_eta(line: &str) -> Option<String> {
    line.split("ETA ")
        .nth(1)
        .map(|s| s.trim().to_string())
}
