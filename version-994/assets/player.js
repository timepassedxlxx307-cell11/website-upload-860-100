import { H as Hls } from './hls-dru42stk.js';

export function initMoviePlayer(stream, videoId, overlayId) {
  const video = document.getElementById(videoId);
  const overlay = document.getElementById(overlayId);

  if (!video) {
    return;
  }

  let ready = false;
  let hls = null;

  const prepare = () => {
    if (ready) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
    } else if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(stream);
      hls.attachMedia(video);
    } else {
      video.src = stream;
    }

    video.setAttribute('controls', 'controls');
    ready = true;
  };

  const play = () => {
    prepare();

    if (overlay) {
      overlay.classList.add('is-hidden');
    }

    const action = video.play();

    if (action && typeof action.catch === 'function') {
      action.catch(() => {});
    }
  };

  if (overlay) {
    overlay.addEventListener('click', play);
  }

  video.addEventListener('click', () => {
    if (video.paused) {
      play();
    }
  });

  video.addEventListener('play', () => {
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
  });

  window.addEventListener('pagehide', () => {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
}
