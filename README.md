# YT-Playlist-Player
# 🎵 YouTube Playlist Audio Player

A sleek and intuitive YouTube audio player built for seamless playlist streaming, focused on audio playback. Designed for distraction-free listening with looping, play/pause, and smart video loading — ideal for podcasts, music playlists, and more.


🔗 Screenshot: *(https://i.postimg.cc/sXXQXJcQ/YTPAP.png)*

🔗 Live Demo: *(https://khandakerhub.github.io/YT-Playlist-Player/)*
---

## 📌 Features

- 🎧 **Audio-Only YouTube Playback**  
  Plays YouTube videos with visuals hidden for minimal distraction.

- 📂 **YouTube Playlist Support**  
  Load and stream videos directly from any public YouTube playlist.

- ▶️ **Play / Pause Controls**  
  Toggle audio playback with a clean and simple interface.

- 🔁 **Loop Modes**  
  - Loop current track (single loop)
  - Loop entire playlist
  - Normal playback (no loop)

- ⏭️ **Next / Previous Navigation**  
  Skip forward or backward through the playlist manually.

- 🧠 **Smart State Tracking**  
  Handles video end states, user interactions, and playlist indexing accurately.

- 💡 **Lightweight & Responsive UI**  
  Mobile-friendly design with responsive layout.

---

## 🚀 How to Use

### 1. Clone the Repository

```bash
git clone https://github.com/Khandakerhub/YouTube-Playlist-Audio-Player.git
cd YouTube-Playlist-Audio-Player
````

### 2. Open the App

Open `Youtube-Playlist-Audio-Player.html` in your web browser. No server required.

### 3. Configure Your Playlist

Edit the JavaScript section to add your YouTube playlist ID:

```javascript
const playlistId = 'YOUR_YOUTUBE_PLAYLIST_ID';
```

Or dynamically fetch and populate videos using the YouTube Data API (already supported in code).

---

## 🎛️ Controls Overview

| Control              | Function                                 |
| -------------------- | ---------------------------------------- |
| ▶️ / ⏸️ Play / Pause | Starts or stops the current video audio  |
| ⏮️ Previous          | Plays the previous video in the playlist |
| ⏭️ Next              | Plays the next video in the playlist     |
| 🔁 Loop One          | Repeats the current track continuously   |
| 🔁🔁 Loop All        | Loops the entire playlist from beginning |

---

## 🧰 Tech Stack

* **HTML5**
* **Vanilla JavaScript**
* **YouTube IFrame Player API**
* **YouTube Data API v3**

---

## 🛠️ Setup YouTube Data API (Optional)

To dynamically fetch playlist content using the YouTube API:

1. Get your API key from [Google Cloud Console](https://console.cloud.google.com/).
2. Replace the placeholder in the script:

```javascript
const apiKey = 'YOUR_YOUTUBE_API_KEY';
```

3. Make sure your API key has access to YouTube Data API v3.

---

## ✅ TODO / Enhancements

* [ ] Add dark/light theme toggle
* [ ] Save user loop preferences in localStorage
* [ ] Add volume control
* [ ] Add search within playlist

---

## 📄 License

Apache License 2.0 © 2025 [Khandakerhub](https://github.com/Khandakerhub)

