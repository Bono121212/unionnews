var frontCommon = frontCommon || {};
frontCommon.Html = (function () {
    var instance = null;
    function init() {
        instance = {
        reset: function () {
            frontCommonResize();
            header();
            quickMenuUI();
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
    let lastScrollTop = 0; //마지막 스크롤 top값
    const delta = 15; //작은 스크롤 이동을 무시하기 위한 기준값 (더 민감하게(작은 값) 또는 둔감하게(큰 값) 조절)
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
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop; //현재 스크롤 위치 가져오기

        if (Math.abs(lastScrollTop - scrollTop) <= delta) return; //현 스크롤위치를 절대값으로. delta보다 작을면 return으로 함수 종료.

        if (scrollTop > lastScrollTop) {
            document.getElementById('header').classList.add('active');
        } else if (scrollTop < lastScrollTop) {
            document.getElementById('header').classList.remove('active');
        }

        lastScrollTop = scrollTop; //현재 스크롤위치를 마지막 스크롤값에 저장
    }
}

function quickMenuUI() {
    var el = $('.quick-nav');
    var quickMenu = $('.nav-list');

    if (el.length <= 0) {
        return;
    }

    var ignoreScroll = false;

    // 페이지 로드 시 가장 첫 번째 섹션에 active 클래스 부여
    var firstSection = $('[data-link-cont]').first();  // 첫 번째 data-link-cont 속성 요소 찾기
    var firstDataLink = firstSection.attr('data-link-cont');
    if (firstDataLink) {
        // 해당하는 네비게이션 아이템에 active 클래스 부여
        quickMenu.find('.item a[data-link="' + firstDataLink + '"]').addClass('active');
        el.find('.nav-list .nav-item').removeClass('active');
        el.find('.nav-list .nav-item a[data-link="' + firstDataLink + '"]').closest('.nav-item').addClass('active');
        activateClosestTerm(el.find('.nav-list .nav-item a[data-link="' + firstDataLink + '"]').closest('.nav-item'));
    }

    // 스크롤 이벤트
    $(window).off('scroll.scrollQuick').on('scroll.scrollQuick', function() {
        var sct = $(this).scrollTop();

        if (ignoreScroll) {
            return;
        }

        // 스크롤 위치에 따라 각 섹션 활성화
        el.find('.nav-list .nav-item').each(function(idx, obj) {
            var dataLink = $(obj).find('a').attr('data-link');
            var targetSection = $('[data-link-cont="' + dataLink + '"]');
            
            if (targetSection.length > 0 && sct >= targetSection.offset().top - 400) {
                el.find('.nav-list .nav-item').removeClass('active');
                $(obj).addClass('active');
                activateClosestTerm($(obj));
            }
        });

        // 활성화된 nav-item의 data-link 가져오기
        var boxName = el.find('.nav-list').find('.nav-item.active').find('a').attr('data-link');
        
        // 빠른 메뉴 항목 활성화
        quickMenu.find('.item a').removeClass('active');
        quickMenu.find('.item a[data-link="' + boxName + '"]').addClass('active');
    }).trigger('scroll.scrollQuick');

    // 빠른 메뉴 클릭 시 스크롤 이동
    quickMenu.find('a').on('click', function(e) {
        e.preventDefault();

        ignoreScroll = true;

        // 클릭된 링크의 data-link 속성 가져오기
        var dataType = $(this).attr('data-link');
        var targetSection = $('[data-link-cont="' + dataType + '"]');

        // 해당 섹션이 존재하는지 확인
        if (targetSection.length > 0) {
            var posMove = targetSection.offset().top - 200;

            // 빠른 메뉴 활성화
            quickMenu.find('.item a').removeClass('active');
            quickMenu.find('.item a[data-link="' + dataType + '"]').addClass('active');

            // 해당 nav-item에 active 클래스 부여
            el.find('.nav-list .nav-item').removeClass('active');
            $(this).closest('.nav-item').addClass('active');
            activateClosestTerm($(this).closest('.nav-item'));

            // 애니메이션을 통해 스크롤 이동
            $('body, html').stop().animate({
                scrollTop: posMove
            }, function() {
                ignoreScroll = false;
            });
        } else {
            console.error('해당 섹션을 찾을 수 없습니다: ' + dataType);
        }
    });

    // 가장 가까운 상단의 .nav-item.term에 active 클래스 부여
    function activateClosestTerm(currentItem) {
        if (currentItem.hasClass('desc')) {
            // 현재 desc 아이템에서 가장 가까운 상위 term 아이템 찾기
            var closestTerm = currentItem.prevAll('.nav-item.term').first();
            if (closestTerm.length > 0) {
                closestTerm.addClass('active');
            }
        }
    }
}



/* 아코디언 */
function Accordion() {
    const accordionDisplays = document.querySelectorAll(".accordion-display");

    accordionDisplays.forEach(function(accordionDisplay) {
        const accordionItems = accordionDisplay.querySelectorAll(".accordion-item");

        accordionItems.forEach(function(accordionItem) {
            const button = accordionItem.querySelector(".btn");

            // aria-label 값 토글
            function toggleAccordion() {
                const ariaLabel = this.getAttribute("aria-label");
                this.setAttribute("aria-label", ariaLabel === "열림" ? "닫힘" : "열림");
            }

            if (button) {
                button.addEventListener("click", toggleAccordion.bind(button));
            }

            const accordionHeads = accordionItem.querySelectorAll(".accordion-head");
            accordionHeads.forEach(accordionHead => {
                accordionHead.addEventListener("click", function() {
                    const panel = this.nextElementSibling;
                    if (panel) {
                        if (accordionItem.classList.contains("active")) {
                            accordionItem.classList.remove("active");
                            panel.style.height = 0;
                            setTimeout(() => {
                                panel.style.overflow = "hidden"; // overflow hidden
                            }, 100);
                        } else {
                            accordionItem.classList.add("active");
                            panel.style.height = panel.scrollHeight + "px";
                            setTimeout(() => {
                                panel.style.overflow = "visible"; // overflow visible
                            }, 100);
                        }
                    }
                });
            });
        });

        // 초기 상태 설정 : collapse 클래스가 .accordion-display에 있으면 열림 상태의 아코디언이 됩니다.
        if (accordionDisplay.classList.contains("collapse")) {
            openAllAccordions(accordionItems);
        } else {
            closeAllAccordions(accordionItems);
        }
        function openAllAccordions(items) {
            items.forEach(item => {
                item.classList.add("active");
                const panel = item.querySelector(".accordion-head + *");
                if (panel) {
                    panel.style.height = panel.scrollHeight + "px";
                    panel.style.overflow = "visible"; // overflow visible
                }
            });
        }
        function closeAllAccordions(items) {
            items.forEach(item => {
                item.classList.remove("active");
                const panel = item.querySelector(".accordion-head + *");
                if (panel) {
                    panel.style.height = 0;
                    panel.style.overflow = "hidden"; // overflow hidden
                }
            });
        }
    });

    // resize시 height 조정
    window.addEventListener("resize", function() {
        accordionDisplays.forEach(function(accordionDisplay) {
            const accordionItems = accordionDisplay.querySelectorAll(".accordion-item");
            accordionItems.forEach(function(accordionItem) {
                const panel = accordionItem.querySelector(".accordion-head + *");
                if (accordionItem.classList.contains("active")) {
                    panel.style.height = 'auto';
                    const scrollHeight = panel.scrollHeight;
                    panel.style.height = scrollHeight + "px";
                }
            });
        });
    });
}