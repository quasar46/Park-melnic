$(document).ready(function () {
  $(".burger").on("click", function () {
    $(this).toggleClass("active");
  });

  // показать только первые несколько элементом, по клику показать все
  const show = function () {
    $(".gallery-events__wrapper.items-more > *").hide();
    $(".gallery-events__wrapper.items-more > *:lt(8)").show();
    $(".show-more").on("click", function () {
      $(this).siblings(".gallery-events__wrapper.items-more").children().show();
    });
  };
  show();

  const show2 = function () {
    if (window.innerWidth < 768) {
      $(".gallery__wrapper.items-more > *").hide();
      $(".gallery__wrapper.items-more > *:lt(4)").show();
      $("#gallery-btn").on("click", function () {
        $(this).siblings(".gallery__wrapper.items-more").children().show();
      });
    }
  };
  show2();

  const show3 = function () {
    $(".news__wrapper.items-more > *").hide();
    $(".news__wrapper.items-more > *:lt(4)").show();
    $("#news-btn").on("click", function () {
      $(this).siblings(".news__wrapper.items-more").children().show();
    });
  };
  show3();

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
    });
  }

  // инициализация nice-select
  $("select").niceSelect();

  const swiper = new Swiper(".swiper", {
    // Optional parameters
    loop: true,
    spaceBetween: 20,
    slidesPerView: "auto",
    loopedSlides: 3,

    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      // when window width is >= 380px
      380: {
        spaceBetween: 10,
      },

      // when window width is >= 1280px
      1280: {
        spaceBetween: 20,
      },

      // when window width is >= 1920px
      1920: {
        spaceBetween: 20,
      },
    },
  });

  // if (window.innerWidth < 380) {
  //     swiper.on('slideChange', function() {
  //         $('.swiper-slide-next').css('opacity', '0.5');
  //         $('.swiper-slide-active').css('opacity', '1');
  //     })
  // }

  const swiper2 = new Swiper(".swiper-banner", {
    // Optional parameters
    loop: true,

    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints: {
      // when window width is >= 380px
      380: {},

      // when window width is >= 1280px
      1280: {},

      // when window width is >= 1920px
      1920: {},
    },
  });

  const swiper3 = new Swiper(".swiper-location-4", {
    // Optional parameters
    loop: false,
    slidesPerView: 4,
    spaceBetween: 10,

    breakpoints: {
      // when window width is >= 380px
      320: {slidesPerView: 2, loop: true},

      // when window width is >= 769
      769: {slidesPerView: 4, loop: false},
    },
  });

  const swiper6 = new Swiper(".swiper-location-3", {
    // Optional parameters
    loop: false,
    slidesPerView: 3,
    spaceBetween: 10,

    breakpoints: {
      // when window width is >= 380px
      320: {slidesPerView: 2, loop: true},

      // when window width is >= 769
      769: {slidesPerView: 3, loop: false},
    },
  });

  const swiper7 = new Swiper(".swiper-location-2", {
    // Optional parameters
    loop: false,
    slidesPerView: 2,
    spaceBetween: 10,

    breakpoints: {
      // when window width is >= 380px
      320: {slidesPerView: 2, loop: true},

      // when window width is >= 769
      769: {slidesPerView: 2, loop: false},
    },
  });

  const swiper4 = new Swiper(".swiper-program", {
    // Optional parameters
    loop: true,
    slidesPerView: "auto",
    // spaceBetween: 10,

    breakpoints: {
      // when window width is >= 380px
      380: {},

      // when window width is >= 1280px
      1280: {},

      // when window width is >= 1920px
      1920: {},
    },
  });

  const swiper5 = new Swiper(".swiper-reviews", {
    // Optional parameters
    loop: true,
    slidesPerView: "auto",
    spaceBetween: 20,

    breakpoints: {
      // when window width is >= 380px
      380: {},

      // when window width is >= 1280px
      1280: {},

      // when window width is >= 1920px
      1920: {},
    },
  });

  var galleryTop = new Swiper(".gallery-top", {
    spaceBetween: 10,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    loop: true,
    loopedSlides: 4
  });
  var galleryThumbs = new Swiper(".gallery-thumbs", {
    spaceBetween: 10,
    centeredSlides: true,
    slidesPerView: 'auto',
    touchRatio: 0.2,
    slideToClickedSlide: true,
    loop: true,
    loopedSlides: 4,
  });
  galleryTop.controller.control = galleryThumbs;
  galleryThumbs.controller.control = galleryTop;

  const myCarousel = new Carousel(document.querySelector(".carousel"), {

  });
});
