import { H as Hls } from "./hls-vendor-dru42stk.js";

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-player]").forEach(function (shell) {
        var video = shell.querySelector("video");
        var overlay = shell.querySelector("[data-player-overlay]");
        var startButton = shell.querySelector("[data-player-start]");
        var message = shell.querySelector("[data-player-message]");
        var hls = null;
        var initialized = false;
        var source = video ? video.getAttribute("data-hls") : "";

        function showMessage(text) {
            if (!message) {
                return;
            }
            message.textContent = text;
            message.classList.add("is-visible");
            window.setTimeout(function () {
                message.classList.remove("is-visible");
            }, 2600);
        }

        function initialize() {
            if (!video || initialized || !source) {
                return;
            }
            initialized = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
                return;
            }

            if (Hls.isSupported()) {
                hls = new Hls({ enableWorker: true, lowLatencyMode: true });
                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        showMessage("播放暂不可用");
                    }
                });
                return;
            }

            showMessage("播放暂不可用");
        }

        function play() {
            initialize();
            if (!video) {
                return;
            }
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
            var wait = window.setTimeout(function () {
                video.play().catch(function () {
                    showMessage("点击视频继续播放");
                });
            }, 80);
            video.addEventListener("canplay", function () {
                window.clearTimeout(wait);
                video.play().catch(function () {
                    showMessage("点击视频继续播放");
                });
            }, { once: true });
        }

        function toggle() {
            if (!video) {
                return;
            }
            if (video.paused) {
                play();
            } else {
                video.pause();
            }
        }

        if (startButton) {
            startButton.addEventListener("click", play);
        }
        if (overlay) {
            overlay.addEventListener("click", play);
        }
        if (video) {
            video.addEventListener("click", toggle);
            video.addEventListener("play", function () {
                if (overlay) {
                    overlay.classList.add("is-hidden");
                }
            });
        }

        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    });
});
