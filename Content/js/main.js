$(document).ready(function () {
    //Used js for Header Sticky Menu  
    //http://www.jqueryscript.net/menu/Sticky-Navigation-Bar-with-jQuery-Bootstrap.html
    $(window).bind('scroll', function() {
        var navHeight = $("div.header").height();
        var navWidth = $("div.header").width();
        ($(window).scrollTop() > navHeight) ? $('.main-menu').addClass('goToTop').width(navWidth) : $('.main-menu').removeClass('goToTop');
    });

    //Used js for Responsive Website Checker
    $('#exit').click(function (e) {
        $('.responsive').hide();
        $('.master-wrapper-page').css('margin-top', '0');
    });

    //Used js for Left Sliderbar Collapse(Responsive Devices)
    $('.block .title').click(function() {
        var e = window, a = 'inner';
        if (!('innerWidth' in window)) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        var result = { width: e[a + 'Width'], height: e[a + 'Height'] };
        if (result.width < 992) {
            $(this).siblings('.listbox').slideToggle('slow');
            $(this).toggleClass("arrow-up-down");
        }
    });

    //Used js for flayout cart
    $("#flyout-cart").on('mouseenter', function (event) {
        $('#flyout-cart-wrapper').addClass('active');
    });

    $("#flyout-cart").on('mouseleave', function (event){
        $('#flyout-cart-wrapper').removeClass('active');
    });

    //Used js for Product Box and Product Thumbs Slider

    $('#home-category-slider,#sub-category-slider,#manufacturer-slider').owlCarousel({
        loop: true,
        dots: false,
        nav: true,
        margin: 30,
        navText: ["prev", "next"],
        autoPlay: false,
        lazyLoad: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 2
            },
            768: {
                items: 3
            }
        }
    });

    $('#product-slider').owlCarousel({
        loop: true,
        dots: false,
        nav: true,
        navText: ["prev", "next"],
        autoPlay: true,
        lazyLoad: true,
        responsive: {
            0: {
                items: 3
            },
            768: {
                items: 5
            },
            992: {
                items: 3
            }
        }
    });

    $('#crosssell-products-slider,#home-bestseller-slider,#home-features-slider,#related-products-slider,#also-purchased-products-slider').owlCarousel({
        loop: true,
        dots: false,
        nav: true,
        margin: 30,
        navText: ["prev", "next"],
        autoPlay: false,
        lazyLoad: true,
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 2
            },
            768: {
                items: 3
            },
            992: {
                items: 4
            }
        }
    });

    $('#home-news-slider').owlCarousel({
        loop: true,
        dots: false,
        nav: true,
        margin: 30,
        navText: ["prev", "next"],
        autoPlay: false,
        lazyLoad: true,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            }
        }
    });

    /* Used js for BackTop Page Scrolling*/
    (function ($) {
        $.fn.backTop = function (options) {
            var backBtn = this;
            var settings = $.extend({
                'position': 400,
                'speed': 500,
            }, options);

            //Settings
            var position = settings['position'];
            var speed = settings['speed'];
            
            backBtn.css({
                'right': 40,
                'bottom': 40,
                'position': 'fixed',
            });

            $(document).scroll(function () {
                var pos = $(window).scrollTop();

                if (pos >= position) {
                    backBtn.fadeIn(speed);
                } else {
                    backBtn.fadeOut(speed);
                }
            });

            backBtn.click(function () {
                $("html, body").animate({
                    scrollTop: 0
                },
                {
                    duration: 1200
                });
            });
        }
    }(jQuery));

    // This is unnecessary due to scroll-padding-top property in CSS now
    // if ($('[id="'+window.location.hash.replace(/#/g, '')+'"]').length) { 
    //     $('html, body').animate({
    //         scrollTop: $('[id="'+window.location.hash.replace(/#/g, '')+'"]').offset().top - 88
    //     }, 1000);
    // }

    $('#backTop').backTop({
        'position': 200,
        'speed': 500,
    });

    if ($('.admin-header-links .impersonate').length) {
        $("html").addClass('impersonating');
    }

    $('.checkout-page.spc #checkout_attribute_input_9 .option-list, html.impersonating.html-checkout-page [id="checkout_attribute_input_9"] .option-list').each(function() {
        var items = $(this).children('li').get();
        items.sort(function(a,b){
        var keyA = $(a).text();
        var keyB = $(b).text();

        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
        });
        var ul = $(this);

        $.each(items, function(i, li){
            ul.append(li);
        });
    })

    $('.google-reviews-badge .star-rating').each(function() {
        var rating = Math.abs($(this).data('rating'));
        var decimal = Math.abs(100 - ((rating - Math.floor(rating)).toFixed(2) * 100));
        var clip = '0 '+decimal+'% 0 0';
        for (var i = 0; i <= 5; i++) {
            if (i < rating) {
                $(this).find('.star:nth-child('+i+') .star-filled').css('clip-path', 'inset(0 0 0 0)');
            } else {
                $(this).find('.star:nth-child('+i+') .star-filled').css('clip-path', 'inset('+clip+')');
            }
        }
    });

    $('dl.attributes-row').each(function() { if ($(this).find('dt label').text().indexOf('Appraisal Number') > 0) { $(this).find('input[type="checkbox"]').remove(); }});

});

