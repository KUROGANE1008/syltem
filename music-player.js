(() => {
  const tracks = [...document.querySelectorAll('.track audio')];
  const time = value => {
    if (!Number.isFinite(value) || value < 0) return '--:--';
    return `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`;
  };
  tracks.forEach(audio => {
    const title = document.getElementById(audio.getAttribute('aria-labelledby')).textContent;
    const player = document.createElement('div');
    player.className = 'terminal-player';
    player.setAttribute('role', 'group');
    player.setAttribute('aria-label', `${title}の再生操作`);
    player.innerHTML = `<div class="player-top"><button type="button" class="player-play"><span class="player-icon" aria-hidden="true">▶</span><span class="player-play-label">再生</span></button><div class="player-signal"><div class="player-bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><span class="player-state" role="status">待機中</span></div></div><div class="player-timeline"><span class="player-current">0:00</span><input class="player-seek" type="range" min="0" max="1000" step="1" value="0" disabled><span class="player-duration">--:--</span></div><div class="player-bottom"><span class="player-channel" aria-hidden="true">S.Y.L.T.E.M. / AUDIO</span><div class="player-volume"><button type="button" class="player-mute" aria-pressed="false">消音</button><input class="player-level" type="range" min="0" max="100" step="1" value="100"></div></div>`;
    const play = player.querySelector('.player-play');
    const playLabel = player.querySelector('.player-play-label');
    const icon = player.querySelector('.player-icon');
    const state = player.querySelector('.player-state');
    const seek = player.querySelector('.player-seek');
    const current = player.querySelector('.player-current');
    const duration = player.querySelector('.player-duration');
    const mute = player.querySelector('.player-mute');
    const volume = player.querySelector('.player-level');
    seek.setAttribute('aria-label', `${title}の再生位置`);
    volume.setAttribute('aria-label', `${title}の音量`);
    mute.setAttribute('aria-label', `${title}を消音`);
    play.setAttribute('aria-label', `${title}を再生`);
    let requestPending = false;
    function playbackState(message) {
      const active = !audio.paused && !audio.ended;
      player.classList.toggle('is-playing', active && !document.hidden && !player.classList.contains('is-buffering'));
      playLabel.textContent = active ? '一時停止' : '再生';
      icon.textContent = active ? 'Ⅱ' : '▶';
      play.setAttribute('aria-label', `${title}を${active ? '一時停止' : '再生'}`);
      if (message) state.textContent = message;
    }
    function updateTime() {
      const ready = Number.isFinite(audio.duration) && audio.duration > 0;
      seek.disabled = !ready;
      current.textContent = time(audio.currentTime);
      duration.textContent = time(audio.duration);
      const progress = ready ? Math.min(1000, audio.currentTime / audio.duration * 1000) : 0;
      seek.value = String(progress);
      seek.style.setProperty('--progress', `${progress / 10}%`);
      seek.setAttribute('aria-valuetext', `${time(audio.currentTime)} / ${time(audio.duration)}`);
    }
    play.addEventListener('click', async () => {
      if (requestPending) return;
      if (!audio.paused) { audio.pause(); return; }
      requestPending = true;
      play.setAttribute('aria-busy', 'true');
      state.textContent = '読み込み中';
      try {
        if (audio.error) audio.load();
        await audio.play();
      } catch {
        playbackState('再生できませんでした。もう一度お試しください。');
      } finally {
        requestPending = false;
        play.removeAttribute('aria-busy');
      }
    });
    audio.addEventListener('play', () => {
      tracks.forEach(other => { if (other !== audio) other.pause(); });
      playbackState('再生中');
    });
    audio.addEventListener('playing', () => {
      player.classList.remove('is-buffering'); playbackState('再生中');
    });
    audio.addEventListener('pause', () => {
      player.classList.remove('is-buffering'); playbackState(audio.ended ? '再生終了' : '一時停止');
    });
    audio.addEventListener('ended', () => playbackState('再生終了'));
    audio.addEventListener('waiting', () => {
      if (!audio.paused) { player.classList.add('is-buffering'); playbackState('読み込み中'); }
    });
    audio.addEventListener('error', () => {
      player.classList.remove('is-buffering'); player.classList.remove('is-playing');
      state.textContent = '音声を読み込めませんでした。再生ボタンで再試行できます。';
    });
    ['loadedmetadata', 'durationchange', 'timeupdate', 'ended'].forEach(event => audio.addEventListener(event, updateTime));
    seek.addEventListener('input', () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = Number(seek.value) / 1000 * audio.duration; updateTime();
      }
    });
    mute.addEventListener('click', () => { audio.muted = !audio.muted; });
    volume.addEventListener('input', () => {
      audio.volume = Number(volume.value) / 100;
      if (audio.volume > 0) audio.muted = false;
    });
    audio.addEventListener('volumechange', () => {
      const silent = audio.muted || audio.volume === 0;
      mute.textContent = silent ? '消音解除' : '消音';
      mute.setAttribute('aria-pressed', String(silent));
      mute.setAttribute('aria-label', `${title}の${silent ? '消音を解除' : '音を消す'}`);
      volume.value = String(Math.round(audio.volume * 100));
      volume.style.setProperty('--progress', `${silent ? 0 : audio.volume * 100}%`);
    });
    document.addEventListener('visibilitychange', () => playbackState());
    audio.after(player);
    audio.hidden = true;
    audio.controls = false;
    audio.preload = 'metadata';
    volume.style.setProperty('--progress', '100%');
    updateTime();
  });
})();
