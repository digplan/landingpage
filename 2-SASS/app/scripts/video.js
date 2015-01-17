var onYouTubeIframeAPIReady;

+(function() {
    'use strict';

    if(miniGoOptions.background.type !== 'video') {
        return;
    }

    var videoOptions = miniGoOptions.background.video,
    wrapper = $('<div id="video-container"></div>'),
    poster = videoOptions.imageFallback,
    volume = videoOptions.volume;

    if(poster.length) {
        wrapper.css({backgroundImage: 'url(' + poster + ')'});
    }

    var init = function() {
        if(Modernizr.touch) {
            wrapper.appendTo('body');
            return;
        }

        switch(videoOptions.source)
        {
        case 'local':
            loadLocal();
            break;

        case 'youtube':
            loadYoutube();
            break;
        }
    };

    var loadLocal = function() {
        var video = $('<video autoplay loop class="fillWidth">').appendTo(wrapper);

        var sourceTemplate = '<source src="{file}" type="video/{type}">';


        for(var file in videoOptions.localFiles) {
            video.append(sourceTemplate.replace('{file}', videoOptions.localFiles[file]).replace('{type}', file));
        }

        video.children().last().add(video).on('error', function(e) {
            e.stopPropagation();
            video.children().unwrap();
            window.miniGo.videoReady = true;
        });

        if(typeof video[0].volume !== 'undefined') {
            video[0].volume = volume / 100;
        } else {
            window.miniGo.videoReady = true;
        }

        video.on('canplay', function() {
            window.miniGo.videoReady = true;
        });

        if(videoOptions.localFiles.mp4.length) {
            var videoPath = videoOptions.localFiles.mp4;

            if(typeof window.minigoSwfURLPrefix === 'undefined') {
                var minigoSwfURLPrefix = '';
            } else {
                var minigoSwfURLPrefix = window.minigoSwfURLPrefix;
            }

            var flashTemplate = '<object class="fillWidth">' +
                                    '<param name="movie" value="' + minigoSwfURLPrefix + 'inc/StrobeMediaPlayback.swf"></param>' +
                                    '<param name="flashvars" value="src={file}&loop=true&autoPlay=true&playButtonOverlay=false&scaleMode=zoom&controlBarMode=none&volume={volume}&bufferingOverlay=false&poster={poster}"></param>' +
                                    '<param name="allowFullScreen" value="true"></param>' +
                                    '<param name="allowscriptaccess" value="always"></param>' +
                                    '<param name="wmode" value="direct"></param>' +
                                    '<embed class="fillWidth" src="' + minigoSwfURLPrefix + 'inc/StrobeMediaPlayback.swf" type="application/x-shockwave-flash" allowscriptaccess="always" allowfullscreen="true" wmode="opaque" flashvars="src={file}&loop=true&autoPlay=true&playButtonOverlay=false&scaleMode=zoom&controlBarMode=none&volume={volume}&bufferingOverlay=false&poster={poster}"></embed>' +
                                '</object>';

            if(videoPath.indexOf('://') == -1) {
                videoPath = encodeURIComponent(getFileUrl(videoPath));
            }


            video.append(
                flashTemplate
                    .replace(/\{file\}/g, videoPath)
                    .replace(/\{poster\}/g, encodeURIComponent(getFileUrl(poster)))
                    .replace(/\{volume\}/g, volume / 100)
            );
        }

        wrapper.appendTo('body');
    };

    var loadYoutube = function () {
        var youtubeWrap = $('<div id="youtubeWrap" class="fillWidth"></div>').appendTo(wrapper);
        wrapper.appendTo('body');

        // 2. This code loads the IFrame Player API code asynchronously.
        var tag = $('<script></script>');

        $('body').append(tag.attr('src', 'https://www.youtube.com/iframe_api'));

        var params = getUrlParams(videoOptions.youtube.url);

        var videoSize = getFillSize();

        youtubeWrap.css({
            width: videoSize.width,
            height: videoSize.height
        });

        // 3. This function creates an <iframe> (and YouTube player)
        //    after the API code downloads.
        var player;
        onYouTubeIframeAPIReady = function() {
            player = new YT.Player('youtubeWrap', {
                width: videoSize.width,
                height: videoSize.height,
                videoId: params.v ? params.v : '',
                playerVars: {
                    autoplay: 1,
                    controls: 0,
                    enablejsapi: 1,
                    loop: 1,
                    modestbranding: 1,
                    iv_load_policy: 3,
                    start: videoOptions.youtube.startAt,
                    end: videoOptions.youtube.endAt,
                    listType: 'playlist',
                    list: params.list ? params.list : '',
                    wmode: "opaque",
                    origin: window.location.origin
                },

                events: {
                    'onReady': onPlayerReady,
                    'onStateChange': onPlayerStateChange
                }
            });
        };

        // 4. The API will call this function when the video player is ready.
        var onPlayerReady = function() {
            youtubeWrap = $('#youtubeWrap');

            player.setVolume(volume);
        };

        // 5. The API calls this function when the player's state changes.
        //    The function indicates that when playing a video (state=1),
        //    the player should play for six seconds and then stop.
        // var done = false;
        var onPlayerStateChange = function(event) {
            if (!params.list && event.data === YT.PlayerState.ENDED) {
                player.playVideo();
            }
            if(event.data === YT.PlayerState.PLAYING) {
                window.miniGo.videoReady = true;
            }
        };

        var timeoutYoutube;
        $(window).on('resize.youtube', function() {
            clearTimeout(timeoutYoutube);
            timeoutYoutube = setTimeout(function() {
                var videoSize = getFillSize();
                youtubeWrap.css({
                    width: videoSize.width,
                    height: videoSize.height
                });
            }, 100);
        });
    };

    var getFileUrl = function(path) {
        var url = window.location;

        if(path[0] === '/') {
            return url.protocol + '//' + url.host + path;
        }

        var urlPath = url.pathname;
        if(urlPath[urlPath.length - 1] !== '/') {
            urlPath = urlPath.slice(0, urlPath.lastIndexOf('/'));
        }

        return url.protocol + '//' + url.host + urlPath + path;
    };

    var getFillSize = function() {
        var wW = window.innerWidth,
        wH = window.innerHeight,
        wAspect = wW/wH,
        newSize = {};

        if(wAspect < 1.777777) {
            newSize.width = Math.round(16 * (wH / 9));
            newSize.height = wH;
        } else {
            newSize.width = wW;
            newSize.height = Math.round(9 * (wW / 16));
        }

        return newSize;
    };


    var getUrlParams = function(url) {
        var hashPosition = url.indexOf('#');
        var params = url.slice(url.indexOf('?'), hashPosition === -1 ? url.length : hashPosition).substr(1).split('&');

        if (params === "") return {};

        var b = {};
        for (var i = 0; i < params.length; ++i)
        {
            var p=params[i].split('=');
            if (p.length !== 2) {
                continue;
            }
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' '));
        }
        return b;
    };

    init();
}());