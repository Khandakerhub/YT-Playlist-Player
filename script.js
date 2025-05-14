let player;
		let playlistId = '';
		let isPlaylistLoaded = false;
		let loopMode = 0; // 0 = OFF, 1 = Single, 2 = Playlist
		let isLoopingSingleTrack = false;
		let isLoopingPlaylist = false;
		let isMuted = false;

		const tag = document.createElement('script');
		tag.src = "https://www.youtube.com/iframe_api";
		document.head.appendChild(tag);

		function onYouTubeIframeAPIReady() {
			console.log('✅ YouTube API Ready');
		}

		function createPlayer(id, isPlaylist = true) {
			player = new YT.Player('player', {
				height: '0',
				width: '0',
				playerVars: {
					listType: isPlaylist ? 'playlist' : 'single', // Playlist vs Single
					list: id,
					playlist: isPlaylist ? id : undefined, // If it's a playlist, use 'playlist' parameter
					controls: 0,
					disablekb: 1,
					fs: 0,
					modestbranding: 1,
					rel: 0,
					loop: isPlaylist ? 1 : 0, // Loop the entire playlist if it's true
					enablejsapi: 1
				},
				events: {
					onReady: onPlayerReady,
					onStateChange: onPlayerStateChange,
					onError: onPlayerError
				}
			});
		}

		function updateVolumeSlider(value) {
			const fill = document.getElementById('volumeFill');
			if (fill) {
				fill.style.width = value + '%';
			}
		}

		document.getElementById('volumeBar').addEventListener('click', function (e) {
			const bar = this;
			const rect = bar.getBoundingClientRect();
			const offsetX = e.clientX - rect.left;
			const percentage = Math.min(Math.max((offsetX / rect.width) * 100, 0), 100);

			if (player && typeof player.setVolume === 'function') {
				player.setVolume(percentage);
				updateVolumeSlider(percentage);
			}
		});

		document.getElementById('btnMute').addEventListener('click', function () {
			if (player.isMuted()) {
				player.unMute();
				this.innerHTML = '<i class="fas fa-volume-up"></i>';
				updateVolumeSlider(player.getVolume());
			} else {
				player.mute();
				this.innerHTML = '<i class="fas fa-volume-mute"></i>';
				updateVolumeSlider(0);
			}
		});

		function onPlayerReady(event) {
			console.log('🎉 Player Ready');
			event.target.playVideo();
			updateVideoMeta();
			player.setVolume(50); // Set initial volume to 50%
			updateVolumeSlider(50); // Optional: update your custom slider if exists
		}

		function onPlayerStateChange(event) {
			console.log('🎬 State Changed:', event.data);
			// Update play/pause button UI
			if (event.data === YT.PlayerState.PLAYING) {
				document.getElementById('btnPlayPause').innerHTML = '<i class="fas fa-pause"></i>'; // ✅ ADD THIS LINE
				updateVideoMeta();
			} else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
				document.getElementById('btnPlayPause').innerHTML = '<i class="fas fa-play"></i>'; // ✅ ADD THIS LINE
			}


			// Check if we are looping a single track
			if (event.data === YT.PlayerState.ENDED) {
				if (isLoopingSingleTrack) {
					console.log('🔁 Single loop triggered. Reloading current video...');
					
					const currentVideo = player.getPlaylist()[player.getPlaylistIndex()];
					player.cueVideoById(currentVideo); // Load the video fresh
					player.playVideo(); // Play it again
					return;
				}
		
				if (isLoopingPlaylist) {
					console.log('🔁 Playlist loop. Restarting...');
					player.playVideoAt(0);
					return;
				}

			}

			// Update mute icon
			if (player.isMuted()) {
				document.getElementById('btnMute').innerHTML = '<i class="fas fa-volume-mute"></i>';
				isMuted = true;
			} else {
				document.getElementById('btnMute').innerHTML = '<i class="fas fa-volume-up"></i>';
				isMuted = false;
			}
		}
	

		function extractPlaylistID(input) {
			try {
				const url = new URL(input);
				const listID = url.searchParams.get('list');
				return listID;
			} catch {
				// Handle plain ID input
				if (input.startsWith('PL') || input.startsWith('UU') || input.length > 10) {
					return input;
				}
				return null;
			}
		}

		function onPlayerError(event) {
			console.error('❌ Player Error:', event.data);
			showModal('⚠️ Playlist failed to load. Please check the Playlist ID.');

			clearPlaylist();
		}

		function loadPlaylistToggle() {
			const inputField = document.getElementById('playlistInput');
			const input = inputField.value.trim();
			const btn = document.getElementById('loadPlaylistBtn');

			if (!isPlaylistLoaded) {
				if (!input) return showModal('⚠️ Please enter a Playlist URL or ID.');

				const extractedId = extractPlaylistID(input);

				if (!extractedId) return showModal('❌ Invalid YouTube Playlist URL or ID.');

				playlistId = extractedId;

				if (player) {
					player.loadPlaylist({ list: playlistId, listType: 'playlist' });
				} else {
					createPlayer(playlistId);
				}

				isPlaylistLoaded = true;
			} else {
				clearPlaylist();
			}

			updateLoadClearButton();
		}


		function clearPlaylist() {
			if (player && typeof player.stopVideo === 'function') {
				player.stopVideo();
			}
			document.getElementById('playlistInput').value = '';
			playlistId = '';
			isPlaylistLoaded = false;
			updateLoadClearButton();
		}

		function updateLoadClearButton() {
			const btn = document.getElementById('loadPlaylistBtn');
			if (isPlaylistLoaded) {
				btn.innerHTML = '<i class="fas fa-times-circle"></i> Clear Playlist';
				btn.classList.add('active');
			} else {
				btn.innerHTML = '<i class="fas fa-cloud-download-alt"></i> Load Playlist';
				btn.classList.remove('active');
			}
		}

		function updateVideoMeta() {
			if (!player) return;
			const data = player.getVideoData();
			document.getElementById('videoTitle').textContent = `Title: ${data.title || 'N/A'}`;
			document.getElementById('channelTitle').textContent = `Channel: ${data.author || 'N/A'}`;
			const videoId = data.video_id;
			if (videoId) {
				const thumbUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
				const thumb = document.getElementById('thumbnail');
				thumb.src = thumbUrl;
				thumb.style.display = 'block';
			}
		}

		function updateProgress() {
			if (!player || typeof player.getCurrentTime !== 'function') return;
			const currentTime = player.getCurrentTime();
			const duration = player.getDuration();
			const percent = (currentTime / duration) * 100;
			document.getElementById('progressFill').style.width = `${percent}%`;
			document.getElementById('currentTime').textContent = formatTime(currentTime);
			document.getElementById('duration').textContent = formatTime(duration);
		}

		function formatTime(seconds) {
			seconds = Math.floor(seconds);
			const mins = Math.floor(seconds / 60);
			const secs = seconds % 60;
			return `${mins}:${secs.toString().padStart(2, '0')}`;
		}

		document.getElementById('progressBar').addEventListener('click', function (e) {
			const bar = this;
			const rect = bar.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const clickedPercent = x / bar.offsetWidth;

			if (player && player.getDuration) {
				const duration = player.getDuration();
				const seekToSeconds = duration * clickedPercent;
				player.seekTo(seekToSeconds, true);
			}
		});


		function showModal(message) {
			const modal = document.getElementById('alertModal');
			const msg = document.getElementById('modalMessage');
			const closeBtn = document.getElementById('modalClose');

			msg.textContent = message;
			modal.style.display = 'block';

			closeBtn.onclick = () => modal.style.display = 'none';
			window.onclick = (event) => {
				if (event.target === modal) modal.style.display = 'none';
			};
		}


		document.addEventListener('DOMContentLoaded', () => {
			console.log('🚀 DOM Loaded');

			document.getElementById('loadPlaylistBtn').addEventListener('click', loadPlaylistToggle);

			document.getElementById('btnPlayPause').addEventListener('click', () => {
				if (!player) return;
				const state = player.getPlayerState();
				if (state === YT.PlayerState.PLAYING) {
					player.pauseVideo();
					document.getElementById('btnPlayPause').innerHTML = '<i class="fas fa-play"></i>';
				} else {
					player.playVideo();
					document.getElementById('btnPlayPause').innerHTML = '<i class="fas fa-pause"></i>';
				}
			});

			document.getElementById('btnNext').addEventListener('click', () => {
				if (player) player.nextVideo();
			});

			document.getElementById('btnPrev').addEventListener('click', () => {
				if (player) player.previousVideo();
			});

			// Loop Button (Single Track / Playlist)
			document.getElementById('btnLoop').addEventListener('click', function () {
				loopMode = (loopMode + 1) % 3;

				isLoopingSingleTrack = loopMode === 1;
				isLoopingPlaylist = loopMode === 2;

				// Update loop setting in player
				if (player && typeof player.setLoop === 'function') {
					player.setLoop(isLoopingPlaylist); // Only affects playlist looping
				}

				// Update button UI
				switch (loopMode) {
					case 0:
						this.innerHTML = '<i class="fas fa-repeat"></i>';
						this.classList.remove('active');
						break;
					case 1:
						this.innerHTML = '<i class="fas fa-redo-alt"></i>';
						this.classList.add('active');
						break;
					case 2:
						this.innerHTML = '<i class="fas fa-sync"></i>';
						this.classList.add('active');
						break;
				}
			});

			document.getElementById('btnShuffle').addEventListener('click', () => {
				showModal("🔀 Shuffle mode is not officially supported via API. Manual shuffling required.");

			});

			document.getElementById('btnMute').addEventListener('click', () => {
				if (!player) return;
				isMuted = !isMuted;
				if (isMuted) {
					player.mute();
				} else {
					player.unMute();
				}
				document.getElementById('btnMute').innerHTML = isMuted
					? '<i class="fas fa-volume-mute"></i>'
					: '<i class="fas fa-volume-up"></i>';
			});

			document.getElementById('volumeBar').addEventListener('click', (e) => {
				if (!player) return;
				const bar = e.currentTarget;
				const clickX = e.offsetX;
				const volumePercent = Math.floor((clickX / bar.clientWidth) * 100);
				document.getElementById('volumeFill').style.width = `${volumePercent}%`;
				player.setVolume(volumePercent);
				if (volumePercent > 0 && player.isMuted()) {
					player.unMute();
					isMuted = false;
				}
			});
		});

		// Poll for progress every 500ms
		setInterval(updateProgress, 500);
	
		// Loop through all buttons
		document.querySelectorAll('.copyBtn').forEach(function (button, index) {
			button.addEventListener('click', function () {
				// Get the corresponding paragraph by id (list1, list2, ...)
				const listId = 'list' + (index + 1);
				const textToCopy = document.getElementById(listId).innerText;

				// Use Clipboard API to copy
				navigator.clipboard.writeText(textToCopy).then(function () {
					showModal('Copied: ' + textToCopy);
				}).catch(function (err) {
					showModal('Failed to copy text: ' + err);
				});
			});
		});

		document.getElementById('pastePlaylistBtn').addEventListener('click', function () {
			navigator.clipboard.readText().then(function (text) {
				document.getElementById('playlistInput').value = text;
			}).catch(function (err) {
				alert('Failed to read clipboard: ' + err);
			});
		});