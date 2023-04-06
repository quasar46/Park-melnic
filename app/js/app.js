$(document).ready(function () {
  const minViewPort = (min = 380) => {
    if (window.innerWidth <= min) {
      const viewport = document.querySelector('[name="viewport"]');
      if (viewport)
        viewport.setAttribute("content", `width=${min}, user-scalable=no`);
    }
  };

  minViewPort();

  $(".burger").on("click", function () {
    $(this).toggleClass("active");
    $(".menu").toggleClass("active");
    $("body").toggleClass("hidden");
  });

  $(".menu__wrapper > a").on("click", function () {
    $(this).next().toggleClass("active");
  });

  // показать еще, блок с категориями на главной
  if (window.innerWidth < 768) {
    $(".all-events__categorys>:not(:eq(0))").hide();
  }
  $("#category-btn").on("click", function () {
    $(this).toggleClass("active");
    if ($(this).hasClass("active")) {
      $(this).text("Свернуть");
      $(".all-events__categorys>.all-events__category").show();
    } else $(this).text("Показать все категории"), $(".all-events__categorys>:not(:eq(0))").hide();
  });

  if ($("#btnReview").length > 0) {
    $("#btnReview").on("click", function () {
      $(this).siblings(".review-block").addClass("active");
      $(this).html(
        "Отправить" + '<img src="images/dest/vector/arrow-btn.svg">'
      );
    });
  }

  // инициализация nice-select
  $("select").niceSelect();

  (function () {
    let swiperGrid = null;
    $(window)
      .on("resize", function () {
        if ($(window).width() > 768 && swiperGrid) {
          swiperGrid.destroy();
          swiperGrid = null;
        } else if ($(window).width() <= 768 && !swiperGrid) {
          swiperGrid = new Swiper(".mySwiper2", {
            slidesPerView: "auto",
            spaceBetween: 10,
            breakpoints: {
              381: {
                spaceBetween: 10,
              },
            },
          });
        }
      })
      .trigger("resize");
  })();

  // сдайдер на главной
  const swiper = new Swiper(".swiper", {
    loop: true,
    spaceBetween: 20,
    slidesPerView: "auto",
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      768: {
        spaceBetween: 10,
      },
      1280: {
        spaceBetween: 20,
      },
      1920: {
        spaceBetween: 20,
      },
    },
  });

  const swiper2 = new Swiper(".swiper-banner", {
    slidesPerView: 1,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  const swiper3 = new Swiper(".swiper-location-4", {
    loop: false,
    slidesPerView: "auto",
    spaceBetween: 10,
  });

  const swiper6 = new Swiper(".swiper-location-3", {
    loop: true,
    slidesPerView: 2,
    spaceBetween: 10,

    breakpoints: {
      381: { slidesPerView: 3, loop: true },
      769: { slidesPerView: 3, loop: false },
    },
  });

  const swiper7 = new Swiper(".swiper-location-2", {
    loop: false,
    slidesPerView: 2,
    spaceBetween: 10,

    breakpoints: {
      320: { slidesPerView: 2, loop: true },
      769: { slidesPerView: 2, loop: false },
    },
  });

  const swiper5 = new Swiper(".swiper-reviews", {
    loop: true,
    slidesPerView: "auto",
    spaceBetween: 10,
    navigation: {
      nextEl: "#btn-next2",
      prevEl: "#btn-prev2",
    },
    breakpoints: {
      381: { spaceBetween: 20, },
    },
  });

  const swiper9 = new Swiper(".swiper-program", {
    loop: false,
    slidesPerView: "auto",
    navigation: {
      nextEl: "#btn-next",
      prevEl: "#btn-prev",
    },
  });

  var galleryTop = new Swiper(".gallery-top", {
    slidesPerView: 1,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next2",
      prevEl: ".swiper-button-prev2",
    },
  });
  var galleryThumbs = new Swiper(".gallery-thumbs", {
    spaceBetween: 10,
    centeredSlides: true,
    slidesPerView: 5,
    touchRatio: 0.2,
    slideToClickedSlide: true,
    loop: true,
    breakpoints: {
      769: { slidesPerView: 8, loop: true },
      1281: { slidesPerView: 12, loop: true, spaceBetween: 30 },
    },
  });
  galleryTop.controller.control = galleryThumbs;
  galleryThumbs.controller.control = galleryTop;

  const swiper8 = new Swiper(".swiper-gallery", {
    loop: true,
    spaceBetween: 20,
    slidesPerView: 2,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      381: {
        spaceBetween: 20,
        slidesPerView: 4,
      },

      769: {
        spaceBetween: 20,
        slidesPerView: 5,
      },

      1281: {
        spaceBetween: 20,
        slidesPerView: 7,
      },
    },
  });

  $("#order-btn").on("click", function () {
    console.log("1111");
    $("#order").show();
  });

  $("#order .modal__close").on("click", function () {
    $(this).closest("#order").hide();
  });

  $(".header-menu__feedback").on("click", function () {
    $("#feedback").show();
  });

  $("#feedback .modal__close").on("click", function () {
    $(this).closest("#feedback").hide();
  });

  // меню в шапке
  function responseMenu() {
    let wrap_width = $('ul.main-nav').outerWidth()
    let menu_width = 0

    $('ul.main-nav>li.item').each(function () {
      menu_width += $(this).outerWidth() + parseInt(getComputedStyle($(this)[0]).marginRight)
    })

    menu_width -= $('ul.main-nav>li.dd_menu').outerWidth()

    if (wrap_width < menu_width + 150) {
      $('ul.main-nav li.dd_menu').show()

      let items = $('ul.main-nav>li.item')
      $('ul.main-nav__submenu').append(items.eq(items.length - 1))

      responseMenu()
    }

    return false
  }

  $(window)
    .on("resize", function () {
      if (window.innerWidth < 1920) {
        responseMenu();
      }
    }).trigger("resize");


    $(window).on('resize', function() {
      if ($(".swiper-offset").length > 0) {
        let $wrapperIndex = $(".swiper-offset")
        let offset1 = $wrapperIndex.offset()
        $wrapperIndex.css('margin-right', '-' + (offset1.left + 300) + 'px')
      }

      if (window.innerWidth < 1279 && $(".swiper-offset2").length > 0) {
        let $wrapperOffset= $(".swiper-offset2")
        let offset2 = $wrapperOffset.offset()
        $wrapperOffset.css('margin-right', '-' + (offset2.left + 300) + 'px')
      }
  }).trigger('resize')


});
