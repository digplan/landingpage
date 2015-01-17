+function ($) {
    "use strict";

    if(miniGoOptions.background.type !== 'slideshow') {
        $('.bg-wrapper').remove();
        return;
    }

    function randomizer(min,max) {
        var randomresult = Math.random() * (max - min) + min;
        return randomresult;
    }

    var resizeImages = function(imageSet) {
        var wW = window.innerWidth,
        wH = window.innerHeight,
        wAspect = wW/wH;

        if(typeof imageSet === "undefined" || !imageSet.length) {
            var imageSet = $('.bg-wrapper img[src]');
        }

        if(typeof imageSet === "undefined" || !imageSet.length) {
            return;
        }

        imageSet.each(function() {
            var el = $(this),
            w,
            h;

            if(typeof this.naturalWidth !== "undefined") {
                w = this.naturalWidth;
                h = this.naturalHeight;
            } else if (el.attr("width") && el.attr("height")) {
                w = el.attr("width");
                h = el.attr("height");
            } else if(typeof this.complete !== "undefined" && this.complete) {
                w = el.width();
                h = el.height();

                el.attr("width", w);
                el.attr("height", h);
            } else {
                return;
            }

            w = parseInt(w);
            h = parseInt(h);

            var aspect = w/h,
            newW,
            newH;

            if(wH * aspect < wW) {
                newW = wW;
                newH = wW * (1 / aspect);
            } else {
                newW = wH * aspect;
                newH = wH;
            }

            if(newW == w && newH == h)
                return;

            el.css({
                left: '50%',
                top: '50%',
                width: newW,
                height: newH,
                //"margin-top": -1 * newH / 2,
                //"margin-left": -1 * newW / 2
            })
        });
    };

    var timeout;
    $(window).on('resize.bgImages', function() {
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            clearTimeout(timeout);

            resizeImages();
        }, 100);
    }).load(resizeImages);

    resizeImages();

    var options = miniGoOptions.background.slideshow || {},
    wrapper = $('.bg-wrapper'),
    maxscale = miniGoOptions.background.slideshow.kenburns.maxScale,
    minscale = miniGoOptions.background.slideshow.kenburns.minScale,
    minMov = miniGoOptions.background.slideshow.kenburns.minMove,
    maxMov = miniGoOptions.background.slideshow.kenburns.maxMove,
    duration = options.duration || 15,
    animationType = options.type || 'kenburns',

    animateFrame = function(el) {
        switch(animationType) {
            case "fade":
                fadeFrame(el);
                break;

            case "continuousFade":
                continuousFadeFrame(el);
                break;

            default:
                kenBurnsFrame(el);
        }
    },

    kenBurnsFrame = function(el) {
        var el = $(el);
        resizeImages(el);

        var scalarStart = randomizer(minscale,maxscale).toFixed(2);
        scalarStart = 1;
        var scalarEnd = randomizer(minscale,maxscale).toFixed(2);

        maxMov = ((scalarEnd - 1) * 100 / 3).toFixed(2);

        var moveX = randomizer(minMov,maxMov).toFixed(2);
        moveX = Math.random() < 0.5 ? -Math.abs(moveX) : Math.abs(moveX);

        var moveY = randomizer(minMov,maxMov).toFixed(2);
        moveY = Math.random() < 0.5 ? -Math.abs(moveY) : Math.abs(moveY);


        if (Modernizr.csstransitions){
            var transform = inflectProperty(Modernizr.prefixed('transform'));
            var transition = inflectProperty(Modernizr.prefixed('transition'));

            var transformStart = 'translate(-50%, -50%) scale(' + scalarStart + ')';
            var transformEnd = 'translate(' + -1 * (50 - moveX) + '%,' + -1 * (50 - moveY) + '%) scale(' + scalarEnd + ')';

            if(Math.floor((Math.random()*2)+1) == 2) {
                var tmp = transformStart;
                transformStart = transformEnd;
                transformEnd = tmp;
            }

            el.css({
                opacity: 1,
                transform: transformStart,
                visibility: 'visible',
                //zIndex: 1
            });

            window.requestAnimationFrame(function() {
                el.addClass('animated').css({
                    transition: transform + ' ' + duration + 's linear, opacity ' + (Math.round((duration/5) * 1000) / 1000) + 's ease',
                    transform: transformEnd
                });
            });

            setTimeout(function() {
                kenBurnsEnd(el);
            }, duration/5*4*1000);
        } else {
            el.css({visibility: 'visible'});
        }
    },

    kenBurnsEnd = function(el) {
        var transform = inflectProperty(Modernizr.prefixed('transform'));
        var transition = inflectProperty(Modernizr.prefixed('transition'));

        requestAnimationFrame(function() {
            el.css({
                opacity: 0
            });

            var next = el.next();
            if (!next.length) {
                next = el.siblings(':first-child');
            }

            next.css('z-index', 0);

            animateFrame(next);

            el.one(_endEvent('TransitionEnd'), function() {
                next.css('z-index', 1);
                el.removeClass('animated').css({
                    transition: '',
                    transform: '',
                    opacity: '',
                    zIndex: 0,
                    visibility: 'hidden'
                });
            });
        });
    },

    continuousFadeFrame = function(el) {
        var next = el.next();
        if (!next.length) {
            next = el.siblings(':first-child');
        }

        if(typeof next[0].complete !== "undefined" && !next[0].complete) {
            next.load(function() {
                continuousFadeFrame(el);
            });
            return;
        }

        resizeImages(next);


        if (Modernizr.csstransitions){
            var transition = inflectProperty(Modernizr.prefixed('transition'));

            el.css({
                zIndex: 1,
                opacity: 1,
                visibility: 'visible'
            });

            next.css({
                zIndex: 0,
                opacity: 1,
                visibility: 'visible'
            });


            setTimeout(function() {
                requestAnimationFrame(function() {
                    el.css({
                        transition: 'opacity ' + duration + 's linear',
                        opacity: 0
                    });
                });

                el.one(_endEvent('TransitionEnd'), function() {
                    el.css({
                        zIndex: -1,
                        transition: '',
                        visibility: ''
                    });
                    next.css({
                        zIndex: 1
                    });
                    continuousFadeFrame(next);
                });
            }, 10);

        } else {
            el.css({visibility: 'visible', opacity: 1});
        }
    },

    fadeFrame = function(el) {
        var next = el.next();
        if (!next.length) {
            next = el.siblings(':first-child');
        }

        if(typeof next[0].complete !== "undefined" && !next[0].complete) {
            next.load(function() {
                fadeFrame(el);
            });
            return;
        }

        resizeImages(next);


        if (Modernizr.csstransitions){
            var transition = inflectProperty(Modernizr.prefixed('transition'));
            next.css({
                zIndex: 0,
                opacity: 1,
                visibility: 'visible'
            });

            el.css({
                zIndex: 1,
                opacity: 1,
                visibility: 'visible'
            });

            setTimeout(function() {
                el.css({
                    opacity: 0,
                    transition: 'opacity 1s linear ' + duration + 's'
                });

                el.one(_endEvent('TransitionEnd'), function() {
                    el.css({
                        zIndex: -1,
                        transition: '',
                        visibility: ''
                    });
                    next.css({
                        zIndex: 1
                    });
                    fadeFrame(next);
                });
            }, 10);
        } else {
            next.css({
                zIndex: 0,
                opacity: 1,
                visibility: 'visible'
            });

            el.css({
                zIndex: 1,
                opacity: 1,
                visibility: 'visible',
            });

            setTimeout(function() {
                el.animate({opacity: 0}, 1000, function() {
                    el.css({
                        zIndex: -1,
                        visibility: ''
                    });
                    next.css({
                        zIndex: 1
                    });
                    fadeFrame(next);
                });
            }, duration * 1000);
        }
    };


    $(window).load(function() {
        var el = $('.bg-wrapper img:first-child') || false;

        if(!el)
            return;

        if(!el.siblings().length) {
            el.css({
                visibility: 'visible',
                display: 'block',
                opacity: 1
            });
            return;
        }
        animateFrame(el);
    });
}(jQuery);