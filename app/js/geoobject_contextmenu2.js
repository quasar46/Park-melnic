ymaps.ready(init);
var myMap;

function init() {
  myMap = new ymaps.Map(
    "map2",
    {
      center: [51.727672, 36.19156],
      zoom: 18,
      behaviors: ["default", "scrollZoom"],
      controls: [],
    },
    { searchControlProvider: "yandex#search" }
  );
      // Создание макета балуна на основе Twitter Bootstrap.
      MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
        '<div class="popover top">' +
          '<a class="close" href="#"><img src="images/dest/vector/map-items/close.svg"></a>' +
          '<div class="arrow"></div>' +
          '<div class="popover-inner">' +
          "$[[options.contentLayout observeSize minWidth=235 maxWidth=235 maxHeight=350]]" +
          "</div>" +
          "</div>",
        {
          /**
           * Строит экземпляр макета на основе шаблона и добавляет его в родительский HTML-элемент.
           * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#build
           * @function
           * @name build
           */
          build: function () {
            this.constructor.superclass.build.call(this);

            this._$element = $(".popover", this.getParentElement());

            this.applyElementOffset();

            this._$element
              .find(".close")
              .on("click", $.proxy(this.onCloseClick, this));
          },

          /**
           * Удаляет содержимое макета из DOM.
           * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#clear
           * @function
           * @name clear
           */
          clear: function () {
            this._$element.find(".close").off("click");

            this.constructor.superclass.clear.call(this);
          },

          /**
           * Метод будет вызван системой шаблонов АПИ при изменении размеров вложенного макета.
           * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
           * @function
           * @name onSublayoutSizeChange
           */
          onSublayoutSizeChange: function () {
            MyBalloonLayout.superclass.onSublayoutSizeChange.apply(
              this,
              arguments
            );

            if (!this._isElement(this._$element)) {
              return;
            }

            this.applyElementOffset();

            this.events.fire("shapechange");
          },

          /**
           * Сдвигаем балун, чтобы "хвостик" указывал на точку привязки.
           * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
           * @function
           * @name applyElementOffset
           */
          applyElementOffset: function () {
            this._$element.css({
              left: -(this._$element[0].offsetWidth / 2),
              top: -(
                this._$element[0].offsetHeight +
                this._$element.find(".arrow")[0].offsetHeight
              ),
            });
          },

          /**
           * Закрывает балун при клике на крестик, кидая событие "userclose" на макете.
           * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
           * @function
           * @name onCloseClick
           */
          onCloseClick: function (e) {
            e.preventDefault();

            this.events.fire("userclose");
          },

          /**
           * Используется для автопозиционирования (balloonAutoPan).
           * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ILayout.xml#getClientBounds
           * @function
           * @name getClientBounds
           * @returns {Number[][]} Координаты левого верхнего и правого нижнего углов шаблона относительно точки привязки.
           */
          getShape: function () {
            if (!this._isElement(this._$element)) {
              return MyBalloonLayout.superclass.getShape.call(this);
            }

            var position = this._$element.position();

            return new ymaps.shape.Rectangle(
              new ymaps.geometry.pixel.Rectangle([
                [position.left, position.top],
                [
                  position.left + this._$element[0].offsetWidth,
                  position.top +
                    this._$element[0].offsetHeight +
                    this._$element.find(".arrow")[0].offsetHeight,
                ],
              ])
            );
          },

          /**
           * Проверяем наличие элемента (в ИЕ и Опере его еще может не быть).
           * @function
           * @private
           * @name _isElement
           * @param {jQuery} [element] Элемент.
           * @returns {Boolean} Флаг наличия.
           */
          _isElement: function (element) {
            return element && element[0] && element.find(".arrow")[0];
          },
        }
      ),
          // Создание вложенного макета содержимого балуна.
      MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
      '<h3 class="popover-title">$[properties.balloonHeader]</h3>' +
        '<div class="popover-content">$[properties.balloonContent]</div>'),

  myMap.behaviors.disable("scrollZoom");
  myMap.controls.add("zoomControl");
  myCollection = new ymaps.GeoObjectCollection();

  var myPlacemark = new ymaps.Placemark(
    [51.727672, 36.19156],
    {
      balloonHeader: "Название локации",
      balloonContent:
      "<div class='map-popup__pictures'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'></div><div class='map-popup__text'>Краткое описание. А также непосредственные участники технического прогресса, инициированные исключительно синтетически, указаны как претенденты на роль ключевых факторов.</div><a href='#' class='button-default map-popup__btn'><span>Подробнее</span><img src='images/dest/vector/arrow-btn.svg'></button>",
    },
    {
      iconLayout: "default#image",
      iconImageHref: "images/dest/vector/map-items/bool1.svg",
      iconImageSize: [100, 100],
      iconImageOffset: [-12, -30],
      type: "brand_store",
      city: "Москва",
      metro: "Войковская",
      id: "001",
      balloonLayout: MyBalloonLayout,
      balloonContentLayout: MyBalloonContentLayout,
    }
  );

  myCollection.add(myPlacemark);

  var myPlacemark = new ymaps.Placemark(
    [51.728354, 36.190782],
    {
      balloonHeader: "Название локации",
      balloonContent:
      "<div class='map-popup__pictures'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'></div><div class='map-popup__text'>Краткое описание. А также непосредственные участники технического прогресса, инициированные исключительно синтетически, указаны как претенденты на роль ключевых факторов.</div><a href='#' class='button-default map-popup__btn'><span>Подробнее</span><img src='images/dest/vector/arrow-btn.svg'></button>",    },
    {
      iconLayout: "default#image",
      iconImageHref: "images/dest/vector/map-items/bool2.svg",
      iconImageSize: [100, 100],
      iconImageOffset: [-12, -30],
      type: "brand_store",
      city: "Москва",
      metro: "",
      id: "002",
      balloonLayout: MyBalloonLayout,
      balloonContentLayout: MyBalloonContentLayout,
    }
  );

  myCollection.add(myPlacemark);

  var myPlacemark = new ymaps.Placemark(
    [51.728141, 36.192723],
    {
      balloonHeader: "Название локации",
      balloonContent:
      "<div class='map-popup__pictures'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'></div><div class='map-popup__text'>Краткое описание. А также непосредственные участники технического прогресса, инициированные исключительно синтетически, указаны как претенденты на роль ключевых факторов.</div><a href='#' class='button-default map-popup__btn'><span>Подробнее</span><img src='images/dest/vector/arrow-btn.svg'></button>",    },
    {
      iconLayout: "default#image",
      iconImageHref: "images/dest/vector/map-items/bool3.svg",
      iconImageSize: [100, 100],
      iconImageOffset: [-12, -30],
      type: "brand_store",
      city: "Москва",
      metro: "Беговая",
      id: "003",
      balloonLayout: MyBalloonLayout,
      balloonContentLayout: MyBalloonContentLayout,
    }
  );

  myCollection.add(myPlacemark);

  var myPlacemark = new ymaps.Placemark(
    [51.72742, 36.190659],
    {
      balloonHeader: "Название локации",
      balloonContent:
      "<div class='map-popup__pictures'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'></div><div class='map-popup__text'>Краткое описание. А также непосредственные участники технического прогресса, инициированные исключительно синтетически, указаны как претенденты на роль ключевых факторов.</div><a href='#' class='button-default map-popup__btn'><span>Подробнее</span><img src='images/dest/vector/arrow-btn.svg'></button>",    },
    {
      iconLayout: "default#image",
      iconImageHref: "images/dest/vector/map-items/bool4.svg",
      iconImageSize: [100, 100],
      iconImageOffset: [-12, -30],
      type: "brand_store",
      city: "Балашиха",
      metro: "",
      id: "004",
      balloonLayout: MyBalloonLayout,
      balloonContentLayout: MyBalloonContentLayout,
    }
  );

  myCollection.add(myPlacemark);

  var myPlacemark = new ymaps.Placemark(
    [51.72742, 36.190659],
    {
      balloonHeader: "Название локации",
      balloonContent:
      "<div class='map-popup__pictures'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'></div><div class='map-popup__text'>Краткое описание. А также непосредственные участники технического прогресса, инициированные исключительно синтетически, указаны как претенденты на роль ключевых факторов.</div><a href='#' class='button-default map-popup__btn'><span>Подробнее</span><img src='images/dest/vector/arrow-btn.svg'></button>",   },
    {
      iconLayout: "default#image",
      iconImageHref: "images/dest/vector/map-items/bool5.svg",
      iconImageSize: [100, 100],
      iconImageOffset: [-12, -30],
      type: "brand_store",
      city: "Москва",
      metro: "Стахановская",
      id: "005",
      balloonLayout: MyBalloonLayout,
      balloonContentLayout: MyBalloonContentLayout,
    }
  );

  myCollection.add(myPlacemark);

  var myPlacemark = new ymaps.Placemark(
    [51.728964, 36.191046],
    {
      balloonHeader: "Название локации",
      balloonContent:
      "<div class='map-popup__pictures'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'></div><div class='map-popup__text'>Краткое описание. А также непосредственные участники технического прогресса, инициированные исключительно синтетически, указаны как претенденты на роль ключевых факторов.</div><a href='#' class='button-default map-popup__btn'><span>Подробнее</span><img src='images/dest/vector/arrow-btn.svg'></button>",    },
    {
      iconLayout: "default#image",
      iconImageHref: "images/dest/vector/map-items/bool6.svg",
      iconImageSize: [100, 100],
      iconImageOffset: [-12, -30],
      type: "brand_store",
      city: "Москва",
      metro: "Митино",
      id: "006",
      balloonLayout: MyBalloonLayout,
      balloonContentLayout: MyBalloonContentLayout,
    }
  );

  myCollection.add(myPlacemark);

  var myPlacemark = new ymaps.Placemark(
    [51.726545, 36.188497],
    {
      balloonHeader: "Название локации",
      balloonContent:
      "<div class='map-popup__pictures'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'></div><div class='map-popup__text'>Краткое описание. А также непосредственные участники технического прогресса, инициированные исключительно синтетически, указаны как претенденты на роль ключевых факторов.</div><a href='#' class='button-default map-popup__btn'><span>Подробнее</span><img src='images/dest/vector/arrow-btn.svg'></button>",    },
    {
      iconLayout: "default#image",
      iconImageHref: "images/dest/vector/map-items/bool7.svg",
      iconImageSize: [100, 100],
      iconImageOffset: [-12, -30],
      type: "brand_store",
      city: "Щелково",
      metro: "",
      id: "007",
      balloonLayout: MyBalloonLayout,
      balloonContentLayout: MyBalloonContentLayout,
    }
  );

  myCollection.add(myPlacemark);

  myCollection.add(myPlacemark);

  myMap.geoObjects.add(myCollection);

  if (location.search.indexOf("?shop=") !== -1) {
    var id = location.search.replace("?shop=", "");
    myCollection.each(function (item) {
      if (item.options.get("id") == id) {
        var a = item.geometry.getCoordinates();

        myMap
          .setCenter(a, 16, {
            checkZoomRange: true,
            duration: 500,
          })
          .then(function () {
            item.options.set("visible", true);
            item.balloon.open();
          });
      }
    });
  }

  //фильтр по типам магазинов
  // $(".shops__checkbox-input").change(function () {
  //   var type = $(this).attr("id");
  //   var state = $(this).prop("checked");

  //   myCollection.each(function (item) {
  //     if (item.options.get("type") == type) {
  //       item.options.set("visible", state);
  //     }
  //   });
  // });

  //центрация карты к объекту
  $(".map-travel__items").on("click", ".map-travel__item", function () {
    // if ($(".hide_map").hasClass("active_show")) {
    //   $(".hide_map").removeClass("active_show");
    //   $(".shops__map-container").show();
    //   $(".hide_map").text("Скрыть карту");
    // }

    var id = $(this).attr("shop_id");

    myCollection.each(function (item) {
      if (item.options.get("id") == id) {
        var a = item.geometry.getCoordinates();

        myMap
          .setCenter(a, 1, {
            checkZoomRange: true,
            duration: 500,
          })
          .then(function () {
            myMap.setCenter(a, 16, {
              checkZoomRange: true,
              duration: 500,
            });
          })
          .then(function () {
            myMap.setCenter(a, 16);
            item.options.set("visible", true);
            item.balloon.open();
          });
      }
    });
  });
}

// $(".hide_map").on("click", function () {
//   $(this).toggleClass("active_show");
//   $(".shops__map-container").toggle();
//   if ($(this).hasClass("active_show")) {
//     $(this).text("Показать карту");
//   } else {
//     $(this).text("Скрыть карту");
//   }
//   return false;
// });

// $(".hide_shops").on("click", function () {
//   $(this).toggleClass("active_show");
//   $(".shops__graup").toggle();
//   if ($(this).hasClass("active_show")) {
//     $(this).text("Показать список");
//   } else {
//     $(this).text("Скрыть список");
//   }
//   return false;
// });

// $(".shops__show-all").on("click", function () {
//   $(this)
//     .parents(".shops__graup")
//     .find(".shop-item--hidden")
//     .removeClass("shop-item--hidden");
//   $(this).parents(".shops__actions").remove();
// }
// );
