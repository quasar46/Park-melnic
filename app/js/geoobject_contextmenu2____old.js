ymaps.ready(function () {
  // Создание экземпляра карты и его привязка к созданному контейнеру.
  var myMap = new ymaps.Map("map2", {
        center: [51.727672, 36.19156],
        zoom: 18,
        behaviors: ["default", "scrollZoom"],
        controls: [],},
        {searchControlProvider: "yandex#search",}
    ),
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
        '<div class="popover-content">$[properties.balloonContent]</div>'
    ),
    myCollection = new ymaps.GeoObjectCollection();
    // Создание метки с пользовательским макетом балуна.
    myPlacemark = (window.myPlacemark = new ymaps.Placemark(
      myMap.getCenter(),
      {
        balloonHeader: "Название локации",
        balloonContent:
          "<div class='map-popup__pictures'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'></div><div class='map-popup__text'>Краткое описание. А также непосредственные участники технического прогресса, инициированные исключительно синтетически, указаны как претенденты на роль ключевых факторов.</div><a href='#' class='button-default map-popup__btn'><span>Подробнее</span><img src='images/dest/vector/arrow-btn.svg'></button>",
      },
      {
        // Необходимо указать данный тип макета.
        iconLayout: "default#image",
        // Своё изображение иконки метки.
        iconImageHref: "images/dest/vector/map-items/bool1.svg",
        // Размеры метки.
        iconImageSize: [100, 100],
        // Смещение левого верхнего угла иконки относительно
        // её "ножки" (точки привязки).
        iconImageOffset: [-50, -100],

        balloonShadow: false,
        balloonLayout: MyBalloonLayout,
        balloonContentLayout: MyBalloonContentLayout,
        balloonPanelMaxMapArea: 0,
        // Не скрываем иконку при открытом балуне.
        // hideIconOnBalloonOpen: false,
        // И дополнительно смещаем балун, для открытия над иконкой.
        // balloonOffset: [3, -40]
        id: 001,
      }
    ));
    myCollection.add(myPlacemark);

    myPlacemark2 = (window.myPlacemark = new ymaps.Placemark(
      [51.728354, 36.190782],
      {
        balloonHeader: "Название локации",
        balloonContent:
          "<div class='map-popup__pictures'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'></div><div class='map-popup__text'>Краткое описание. А также непосредственные участники технического прогресса, инициированные исключительно синтетически, указаны как претенденты на роль ключевых факторов.</div><a href='#' class='button-default map-popup__btn'><span>Подробнее</span><img src='images/dest/vector/arrow-btn.svg'></button>",
      },
      {
        // Необходимо указать данный тип макета.
        iconLayout: "default#image",
        // Своё изображение иконки метки.
        iconImageHref: "images/dest/vector/map-items/bool2.svg",
        // Размеры метки.
        iconImageSize: [100, 100],
        // Смещение левого верхнего угла иконки относительно
        // её "ножки" (точки привязки).
        iconImageOffset: [-50, -100],

        balloonShadow: false,
        balloonLayout: MyBalloonLayout,
        balloonContentLayout: MyBalloonContentLayout,
        balloonPanelMaxMapArea: 0,

        // Не скрываем иконку при открытом балуне.
        // hideIconOnBalloonOpen: false,
        // И дополнительно смещаем балун, для открытия над иконкой.
        // balloonOffset: [3, -40]
        id: 002,
      }
    ));
    myCollection.add(myPlacemark);

    myPlacemark3 = (window.myPlacemark = new ymaps.Placemark(
      [51.728141, 36.192723],
      {
        balloonHeader: "Название локации",
        balloonContent:
          "<div class='map-popup__pictures'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'></div><div class='map-popup__text'>Краткое описание. А также непосредственные участники технического прогресса, инициированные исключительно синтетически, указаны как претенденты на роль ключевых факторов.</div><a href='#' class='button-default map-popup__btn'><span>Подробнее</span><img src='images/dest/vector/arrow-btn.svg'></button>",
      },
      {
        // Необходимо указать данный тип макета.
        iconLayout: "default#image",
        // Своё изображение иконки метки.
        iconImageHref: "images/dest/vector/map-items/bool3.svg",
        // Размеры метки.
        iconImageSize: [100, 100],
        // Смещение левого верхнего угла иконки относительно
        // её "ножки" (точки привязки).
        iconImageOffset: [-50, -100],

        balloonShadow: false,
        balloonLayout: MyBalloonLayout,
        balloonContentLayout: MyBalloonContentLayout,
        balloonPanelMaxMapArea: 0,
        // Не скрываем иконку при открытом балуне.
        // hideIconOnBalloonOpen: false,
        // И дополнительно смещаем балун, для открытия над иконкой.
        // balloonOffset: [3, -40]
        id: 003,
      }
    ));
    myCollection.add(myPlacemark);

    myPlacemark4 = (window.myPlacemark = new ymaps.Placemark(
      [51.72742, 36.190659],
      {
        balloonHeader: "Название локации",
        balloonContent:
          "<div class='map-popup__pictures'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'></div><div class='map-popup__text'>Краткое описание. А также непосредственные участники технического прогресса, инициированные исключительно синтетически, указаны как претенденты на роль ключевых факторов.</div><a href='#' class='button-default map-popup__btn'><span>Подробнее</span><img src='images/dest/vector/arrow-btn.svg'></button>",
      },
      {
        // Необходимо указать данный тип макета.
        iconLayout: "default#image",
        // Своё изображение иконки метки.
        iconImageHref: "images/dest/vector/map-items/bool4.svg",
        // Размеры метки.
        iconImageSize: [100, 100],
        // Смещение левого верхнего угла иконки относительно
        // её "ножки" (точки привязки).
        iconImageOffset: [-50, -100],

        balloonShadow: false,
        balloonLayout: MyBalloonLayout,
        balloonContentLayout: MyBalloonContentLayout,
        balloonPanelMaxMapArea: 0,
        // Не скрываем иконку при открытом балуне.
        // hideIconOnBalloonOpen: false,
        // И дополнительно смещаем балун, для открытия над иконкой.
        // balloonOffset: [3, -40]
        id: 004,
      }
    ));
    myCollection.add(myPlacemark);

    myPlacemark5 = (window.myPlacemark = new ymaps.Placemark(
      [51.727404, 36.192083],
      {
        balloonHeader: "Название локации",
        balloonContent:
          "<div class='map-popup__pictures'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'></div><div class='map-popup__text'>Краткое описание. А также непосредственные участники технического прогресса, инициированные исключительно синтетически, указаны как претенденты на роль ключевых факторов.</div><a href='#' class='button-default map-popup__btn'><span>Подробнее</span><img src='images/dest/vector/arrow-btn.svg'></button>",
      },
      {
        // Необходимо указать данный тип макета.
        iconLayout: "default#image",
        // Своё изображение иконки метки.
        iconImageHref: "images/dest/vector/map-items/bool5.svg",
        // Размеры метки.
        iconImageSize: [100, 100],
        // Смещение левого верхнего угла иконки относительно
        // её "ножки" (точки привязки).
        iconImageOffset: [-50, -100],

        balloonShadow: false,
        balloonLayout: MyBalloonLayout,
        balloonContentLayout: MyBalloonContentLayout,
        balloonPanelMaxMapArea: 0,
        // Не скрываем иконку при открытом балуне.
        // hideIconOnBalloonOpen: false,
        // И дополнительно смещаем балун, для открытия над иконкой.
        // balloonOffset: [3, -40]
        id: 005,
      }
    ));
    myCollection.add(myPlacemark);

    myPlacemark6 = (window.myPlacemark = new ymaps.Placemark(
      [51.728964, 36.191046],
      {
        balloonHeader: "Название локации",
        balloonContent:
          "<div class='map-popup__pictures'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'></div><div class='map-popup__text'>Краткое описание. А также непосредственные участники технического прогресса, инициированные исключительно синтетически, указаны как претенденты на роль ключевых факторов.</div><a href='#' class='button-default map-popup__btn'><span>Подробнее</span><img src='images/dest/vector/arrow-btn.svg'></button>",
      },
      {
        // Необходимо указать данный тип макета.
        iconLayout: "default#image",
        // Своё изображение иконки метки.
        iconImageHref: "images/dest/vector/map-items/bool6.svg",
        // Размеры метки.
        iconImageSize: [100, 100],
        // Смещение левого верхнего угла иконки относительно
        // её "ножки" (точки привязки).
        iconImageOffset: [-50, -100],

        balloonShadow: false,
        balloonLayout: MyBalloonLayout,
        balloonContentLayout: MyBalloonContentLayout,
        balloonPanelMaxMapArea: 0,
        // Не скрываем иконку при открытом балуне.
        // hideIconOnBalloonOpen: false,
        // И дополнительно смещаем балун, для открытия над иконкой.
        // balloonOffset: [3, -40]
        id: 006,
      }
    ));
    myCollection.add(myPlacemark);

    myPlacemark7 = (window.myPlacemark = new ymaps.Placemark(
      [51.726545, 36.188497],
      {
        balloonHeader: "Название локации",
        balloonContent:
          "<div class='map-popup__pictures'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'><img src='images/dest/image77.jpg'></div><div class='map-popup__text'>Краткое описание. А также непосредственные участники технического прогресса, инициированные исключительно синтетически, указаны как претенденты на роль ключевых факторов.</div><a href='#' class='button-default map-popup__btn'><span>Подробнее</span><img src='images/dest/vector/arrow-btn.svg'></button>",
      },
      {
        // Необходимо указать данный тип макета.
        iconLayout: "default#image",
        // Своё изображение иконки метки.
        iconImageHref: "images/dest/vector/map-items/bool7.svg",
        // Размеры метки.
        iconImageSize: [100, 100],
        // Смещение левого верхнего угла иконки относительно
        // её "ножки" (точки привязки).
        iconImageOffset: [-50, -100],

        balloonShadow: false,
        balloonLayout: MyBalloonLayout,
        balloonContentLayout: MyBalloonContentLayout,
        balloonPanelMaxMapArea: 0,
        // Не скрываем иконку при открытом балуне.
        // hideIconOnBalloonOpen: false,
        // И дополнительно смещаем балун, для открытия над иконкой.
        // balloonOffset: [3, -40]
        id: 007,
      }
    ));
    myCollection.add(myPlacemark);

  myMap.panTo([51.727672, 36.19156]),
    myMap.geoObjects.add(myPlacemark),
    myMap.geoObjects.add(myPlacemark2),
    myMap.geoObjects.add(myPlacemark3),
    myMap.geoObjects.add(myPlacemark4),
    myMap.geoObjects.add(myPlacemark5),
    myMap.geoObjects.add(myPlacemark6),
    myMap.geoObjects.add(myPlacemark7);

  // центрирование карты по клику на обьект
  $(".goto").on("click", function () {
    $("html, body").animate(
      {
        scrollTop: $("#map2").offset().top - 50,
      },
      400
    );

    myMap.panTo(
      [parseFloat($(this).data("gps_n")), parseFloat($(this).data("gps_s"))],
      {
        flying: 1,
      }
    );

    return false;
  });

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
