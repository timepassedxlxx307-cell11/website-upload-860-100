(function () {
    function attachSource(video, url) {
        if (video.getAttribute('data-ready') === '1') {
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
            video.setAttribute('data-ready', '1');
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: false
            });
            hls.loadSource(url);
            hls.attachMedia(video);
            video._hls = hls;
            video.setAttribute('data-ready', '1');
        } else {
            video.src = url;
            video.setAttribute('data-ready', '1');
        }
    }

    window.setupMoviePlayer = function (videoId, overlayId, url) {
        var video = document.getElementById(videoId);
        var overlay = document.getElementById(overlayId);

        if (!video || !overlay || !url) {
            return;
        }

        function start() {
            attachSource(video, url);
            overlay.classList.add('is-hidden');
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {});
            }
        }

        overlay.addEventListener('click', start);
        video.addEventListener('click', function () {
            if (video.getAttribute('data-ready') !== '1') {
                start();
            }
        });
    };
}());
