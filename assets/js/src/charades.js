Charades = (function() {
    var settings = {};

    return {
        init: function() {
            settings.packs = $('.row-packs');
            settings.charades = $('.row-charades');
            settings.navigation = $('.row-navigation');
            settings.navCorrect = $('.nav-correct');
            settings.navIncorrect = $('.nav-incorrect');
            settings.countDown = $('.row-countdown');
            settings.time = 120;
            settings.timeLeft = $('.time-left');
            settings.summary = $('.row-summary');
            settings.answered = [];

            this.setupUIComponents();
            this.bindUIActions();
        },
        setupUIComponents: function() {
            $.getJSON( "packs/manifest.json", function(data) {
                Charades.displayPacks(data);
            });
        },
        bindUIActions: function() {
            $('body').on('click', '.pack', function(e) {
                e.preventDefault();
                Charades.showPack( $(this).attr('data-pack') );
            });
            settings.navCorrect.click( function() {
                Charades.answerCorrect( $('.charade.active') );
            });
            settings.navIncorrect.click( function() {
                Charades.answerIncorrect( $('.charade.active') );
            });
        },
        displayPacks: function(data) {
            $.each( data, function(key, val) {
                settings.packs.append('<a class="pack" data-pack="' + key + '" href="#">' + val + '</a>');
            });
        },
        showPack: function(pack) {
            settings.packs.hide();
            settings.charades.show();
            settings.navigation.show();
            this.countDown();

            $.getJSON( "packs/data/" + pack + ".json", function(data) {
                $.each( data, function(key, val) {
                    settings.charades.append('<div class="charade">' + val + '</div>');
                });
                settings.charades
                    .find('.charade')
                    .first()
                    .addClass('active');
            });
        },
        countDown: function() {
            settings.countDown.show();
            var $time = settings.countDown.find('.time');
            var countDown = 3;

            $time.text(countDown);
            var interval = setInterval(function() {
                countDown -= 1;
                $time.text(countDown);
                if( countDown === 0 ) {
                    clearInterval(interval);
                    settings.countDown.hide();
                    Charades.startTimer(settings.time);
                }
            }, 1000);
        },
        startTimer: function(time) {
            settings.timeLeft.text(time);
            var timer = setInterval(function() {
                time -= 1;
                settings.timeLeft.text(time);
                if( time === 0 ) {
                    clearInterval(timer);
                    Charades.showSummary();
                }
            }, 1000);
        },
        answerCorrect: function( $charade ) {
            var $orig = $charade.text();
            $charade.text('Correct');
            settings.charades.addClass('correct');
            settings.answered.push(['correct', $orig]);

            setTimeout(function() {
                $charade.text($orig);
                settings.charades.removeClass('correct');
                Charades.nextCharade();
            }, 1000);
        },
        answerIncorrect: function( $charade ) {
            var $orig = $charade.text();
            $charade.text('Pass');
            settings.charades.addClass('incorrect');
            settings.answered.push(['incorrect', $orig]);

            setTimeout(function() {
                $charade.text($orig);
                settings.charades.removeClass('incorrect');
                Charades.nextCharade();
            }, 1000);
        },
        nextCharade: function() {
            if( $('.charade.active').next().length ) {
                $('.charade.active').removeClass('active').next().addClass('active');
            } else {
                $('.charade.active').removeClass('active');
                $('.charade').first().addClass('active');
            }
        },
        showSummary: function() {
            settings.summary.show();
            $.each( settings.answered, function(key, val) {
                settings.summary.append('<div class="summary ' + val[0] + '">' + val[1] + '</div>');
            });
        },
        shuffleArray: function(a) {
            var j, x, i;
            for (i = a.length; i; i--) {
                j = Math.floor(Math.random() * i);
                x = a[i - 1];
                a[i - 1] = a[j];
                a[j] = x;
            }
        }
    }
})();

$(document).ready(function() {
    Charades.init();
});