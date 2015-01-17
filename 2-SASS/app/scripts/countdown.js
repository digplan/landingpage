var clock;
+function ($) {
    'use strict';

    // Grab the current date
    var currentDate = new Date();

    var targetDate = miniGoOptions.countdown.targetDate;
    var startDate = miniGoOptions.countdown.startDate;

    // Calculate the difference in seconds between the future and current date
    var diff = targetDate.getTime() / 1000 - currentDate.getTime() / 1000;

    if(diff < 0) {
        diff = 0;
    }
    var days = diff / 60 / 60 / 24;

    if(Math.floor(days) > 99) {
        $('body').addClass('over-99-days');
    }

    var charts = false,
    lastHours,
    lastMinutes;

    clock = $('.clock');
    if(clock.hasClass('clock-alt')) {
        charts = true;

        clock.append('<div class="chart chart-days" data-percent="100"></div>'+
                    '<div class="chart chart-hours" data-percent="100"></div>'+
                    '<div class="chart chart-minutes" data-percent="100"></div>'+
                    '<div class="chart chart-seconds" data-percent="100"></div>');

        var chartHours = $('.chart-hours'),
        chartMinutes = $('.chart-minutes'),
        chartSeconds = $('.chart-seconds');

        $('.chart').easyPieChart({
            scaleColor: false,
            trackColor: false,
            barColor: '#ffffff',
            lineWidth: 6,
            lineCap: 'butt',
            size: 125,
            animate: 800
        });

    } else {
        clock.append('<div class="clock-progress"></div>');
    }


    var getPercentage = function() {
	   var percentage = 100 - (diff / ((targetDate.getTime() / 1000 - startDate.getTime() / 1000) / 100));
	   return percentage;
    };

    var updateProgress = function() {
        requestAnimationFrame(function() {
            if(charts) {
                $('.chart-days').data('easyPieChart').update(getPercentage());
            } else {
                $('.clock-progress').css('padding-right', 100 - getPercentage() + '%');
            }
        });
    };

    $('body').on('miniGo.ready', function() {
        setTimeout(updateProgress, 1000);
        setInterval(updateProgress, 30000);
    });

    // Instantiate a coutdown FlipClock
    FlipClock.Timer.prototype._setInterval = function(callback) {
    	var t = this;

        var flipclockTimer = function() {
            t._interval(callback);
        };

		t.timer = setInterval(function() {
            cancelAnimationFrame(flipclockTimer);
			requestAnimationFrame(flipclockTimer);
		}, this.interval);
    };

    clock = clock.FlipClock(diff, {
        clockFace: 'DailyCounter',
        countdown: true,
        callbacks: {
            start: function() {
                window.miniGo.clockReady = true;

                var labels = clock.data('labels');

                if(typeof labels !== 'undefined' && labels.length) {
                    labels = labels.split(',');
                    var labelElements = $('.flip-clock-label');

                    if(labels.length && labelElements.length) {
                        for (var i=0;i<labels.length;i++) {
                            $(labelElements[i]).text(labels[i].trim());
                        }
                    }
                }

                clock.addClass('flip-clock-started');

                 $('.clock ul').on(_endEvent('AnimationEnd'), function(e) {
                     e.stopPropagation();
                     e.stopImmediatePropagation();
                     e.preventDefault();
                 });
            },
            interval: function() {
                if (!charts || !window.miniGo.ready) {
                    return;
                }

                var toUpdate = clock.time.getHours(true);

                if(toUpdate !== lastHours) {
                    lastHours = toUpdate;
                    chartHours.data('easyPieChart').update(Math.round(lastHours/(23/100)));
                }

                toUpdate = clock.time.getMinutes(true);
                if(toUpdate !== lastMinutes) {
                    lastMinutes = toUpdate;
                    chartMinutes.data('easyPieChart').update(Math.round(lastMinutes/(59/100)));
                }

                chartSeconds.data('easyPieChart').update(Math.round(clock.time.getSeconds(true)/(59/100)));
            }
        }
    });
}(jQuery);