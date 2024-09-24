var frontCommon = frontCommon || {};
frontCommon.Html = (function () {
    var instance = null;
    function init() {
        instance = {
        reset: function () {
            frontCommonResize();
            header();
            quickMenuUI();
            dropdown();
            },
        };
    return instance;
    }
    if (instance) {
        return instance;
    } else {
        return init();
    }
})();

function frontCommonResize() {
    window.addEventListener("resize", () => {

    });
}

function frontCommonScroll() {
    window.addEventListener("scroll", () => {

    });
}

function header() {
    let lastScrollTop = 0;
    const delta = 15;
    let ticking = false;

    window.addEventListener('scroll', function() {
        if(!ticking) {
            window.requestAnimationFrame(function(){
                handleScroll();
                ticking = false;
            })
            ticking = true;
        }
    })

    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (Math.abs(lastScrollTop - scrollTop) <= delta) return;

        if (scrollTop > lastScrollTop) {
            document.getElementById('header').classList.add('active');
        } else if (scrollTop < lastScrollTop) {
            document.getElementById('header').classList.remove('active');
        }

        lastScrollTop = scrollTop;
    }
}

function quickMenuUI() {
    var el = $('.quick-nav');
    var quickMenu = $('.nav-list');

    if (el.length <= 0) {
        return;
    }

    var ignoreScroll = false;

    var firstSection = $('[data-link-cont]').first();
    var firstDataLink = firstSection.attr('data-link-cont');
    if (firstDataLink) {
        quickMenu.find('.item a[data-link="' + firstDataLink + '"]').addClass('active');
        el.find('.nav-list .nav-item').removeClass('active');
        el.find('.nav-list .nav-item a[data-link="' + firstDataLink + '"]').closest('.nav-item').addClass('active');
        activateClosestTerm(el.find('.nav-list .nav-item a[data-link="' + firstDataLink + '"]').closest('.nav-item'));
    }

    $(window).off('scroll.scrollQuick').on('scroll.scrollQuick', function() {
        var sct = $(this).scrollTop();

        if (ignoreScroll) {
            return;
        }

        el.find('.nav-list .nav-item').each(function(idx, obj) {
            var dataLink = $(obj).find('a').attr('data-link');
            var targetSection = $('[data-link-cont="' + dataLink + '"]');
            
            if (targetSection.length > 0 && sct >= targetSection.offset().top - 400) {
                el.find('.nav-list .nav-item').removeClass('active');
                $(obj).addClass('active');
                activateClosestTerm($(obj));
            }
        });

        var boxName = el.find('.nav-list').find('.nav-item.active').find('a').attr('data-link');
        
        quickMenu.find('.item a').removeClass('active');
        quickMenu.find('.item a[data-link="' + boxName + '"]').addClass('active');
    }).trigger('scroll.scrollQuick');

    quickMenu.find('a').on('click', function(e) {
        e.preventDefault();

        ignoreScroll = true;

        var dataType = $(this).attr('data-link');
        var targetSection = $('[data-link-cont="' + dataType + '"]');

        if (targetSection.length > 0) {
            var posMove = targetSection.offset().top - 200;

            quickMenu.find('.item a').removeClass('active');
            quickMenu.find('.item a[data-link="' + dataType + '"]').addClass('active');

            el.find('.nav-list .nav-item').removeClass('active');
            $(this).closest('.nav-item').addClass('active');
            activateClosestTerm($(this).closest('.nav-item'));

            $('body, html').stop().animate({
                scrollTop: posMove
            }, function() {
                ignoreScroll = false;
            });
        } else {
            // console.error('해당 섹션을 찾을 수 없습니다: ' + dataType);
        }
    });

    function activateClosestTerm(currentItem) {
        if (currentItem.hasClass('desc')) {
            var closestTerm = currentItem.prevAll('.nav-item.term').first();
            if (closestTerm.length > 0) {
                closestTerm.addClass('active');
            }
        }
    }
}

function dropdown() {
    $('.dropdown').click(function () {
        $(this).next().slideToggle();
        $(this).parent().toggleClass('open');
    });
}