(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function menuInit() {
        if (document.querySelector(".icon-menu")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && e.target.closest(".icon-menu")) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    function DynamicAdapt(type) {
        this.type = type;
    }
    DynamicAdapt.prototype.init = function() {
        const _this = this;
        this.оbjects = [];
        this.daClassname = "_dynamic_adapt_";
        this.nodes = document.querySelectorAll("[data-da]");
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const data = node.dataset.da.trim();
            const dataArray = data.split(",");
            const оbject = {};
            оbject.element = node;
            оbject.parent = node.parentNode;
            оbject.destination = document.querySelector(dataArray[0].trim());
            оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
            оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.оbjects.push(оbject);
        }
        this.arraySort(this.оbjects);
        this.mediaQueries = Array.prototype.map.call(this.оbjects, (function(item) {
            return "(" + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
        }), this);
        this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, (function(item, index, self) {
            return Array.prototype.indexOf.call(self, item) === index;
        }));
        for (let i = 0; i < this.mediaQueries.length; i++) {
            const media = this.mediaQueries[i];
            const mediaSplit = String.prototype.split.call(media, ",");
            const matchMedia = window.matchMedia(mediaSplit[0]);
            const mediaBreakpoint = mediaSplit[1];
            const оbjectsFilter = Array.prototype.filter.call(this.оbjects, (function(item) {
                return item.breakpoint === mediaBreakpoint;
            }));
            matchMedia.addListener((function() {
                _this.mediaHandler(matchMedia, оbjectsFilter);
            }));
            this.mediaHandler(matchMedia, оbjectsFilter);
        }
    };
    DynamicAdapt.prototype.mediaHandler = function(matchMedia, оbjects) {
        if (matchMedia.matches) for (let i = 0; i < оbjects.length; i++) {
            const оbject = оbjects[i];
            оbject.index = this.indexInParent(оbject.parent, оbject.element);
            this.moveTo(оbject.place, оbject.element, оbject.destination);
        } else for (let i = оbjects.length - 1; i >= 0; i--) {
            const оbject = оbjects[i];
            if (оbject.element.classList.contains(this.daClassname)) this.moveBack(оbject.parent, оbject.element, оbject.index);
        }
    };
    DynamicAdapt.prototype.moveTo = function(place, element, destination) {
        element.classList.add(this.daClassname);
        if ("last" === place || place >= destination.children.length) {
            destination.insertAdjacentElement("beforeend", element);
            return;
        }
        if ("first" === place) {
            destination.insertAdjacentElement("afterbegin", element);
            return;
        }
        destination.children[place].insertAdjacentElement("beforebegin", element);
    };
    DynamicAdapt.prototype.moveBack = function(parent, element, index) {
        element.classList.remove(this.daClassname);
        if (void 0 !== parent.children[index]) parent.children[index].insertAdjacentElement("beforebegin", element); else parent.insertAdjacentElement("beforeend", element);
    };
    DynamicAdapt.prototype.indexInParent = function(parent, element) {
        const array = Array.prototype.slice.call(parent.children);
        return Array.prototype.indexOf.call(array, element);
    };
    DynamicAdapt.prototype.arraySort = function(arr) {
        if ("min" === this.type) Array.prototype.sort.call(arr, (function(a, b) {
            if (a.breakpoint === b.breakpoint) {
                if (a.place === b.place) return 0;
                if ("first" === a.place || "last" === b.place) return -1;
                if ("last" === a.place || "first" === b.place) return 1;
                return a.place - b.place;
            }
            return a.breakpoint - b.breakpoint;
        })); else {
            Array.prototype.sort.call(arr, (function(a, b) {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if ("first" === a.place || "last" === b.place) return 1;
                    if ("last" === a.place || "first" === b.place) return -1;
                    return b.place - a.place;
                }
                return b.breakpoint - a.breakpoint;
            }));
            return;
        }
    };
    const da = new DynamicAdapt("max");
    da.init();
    (function($, window, document, undefined) {
        "use strict";
        var pluginName = "starRating";
        var noop = function() {};
        var defaults = {
            totalStars: 5,
            useFullStars: false,
            starShape: "straight",
            emptyColor: "lightgray",
            hoverColor: "orange",
            activeColor: "gold",
            ratedColor: "crimson",
            useGradient: true,
            readOnly: false,
            disableAfterRate: true,
            baseUrl: false,
            starGradient: {
                start: "#FEF7CD",
                end: "#FF9511"
            },
            strokeWidth: 4,
            strokeColor: "black",
            initialRating: 0,
            starSize: 40,
            callback: noop,
            onHover: noop,
            onLeave: noop
        };
        var Plugin = function(element, options) {
            var _rating;
            var newRating;
            var roundFn;
            this.element = element;
            this.$el = $(element);
            this.settings = $.extend({}, defaults, options);
            _rating = this.$el.data("rating") || this.settings.initialRating;
            roundFn = this.settings.forceRoundUp ? Math.ceil : Math.round;
            newRating = (roundFn(2 * _rating) / 2).toFixed(1);
            this._state = {
                rating: newRating
            };
            this._uid = Math.floor(999 * Math.random());
            if (!options.starGradient && !this.settings.useGradient) this.settings.starGradient.start = this.settings.starGradient.end = this.settings.activeColor;
            this._defaults = defaults;
            this._name = pluginName;
            this.init();
        };
        var methods = {
            init: function() {
                this.renderMarkup();
                this.addListeners();
                this.initRating();
            },
            addListeners: function() {
                if (this.settings.readOnly) return;
                this.$stars.on("mouseover", this.hoverRating.bind(this));
                this.$stars.on("mouseout", this.restoreState.bind(this));
                this.$stars.on("click", this.handleRating.bind(this));
            },
            hoverRating: function(e) {
                var index = this.getIndex(e);
                this.paintStars(index, "hovered");
                this.settings.onHover(index + 1, this._state.rating, this.$el);
            },
            handleRating: function(e) {
                var index = this.getIndex(e);
                var rating = index + 1;
                this.applyRating(rating, this.$el);
                this.executeCallback(rating, this.$el);
                if (this.settings.disableAfterRate) this.$stars.off();
            },
            applyRating: function(rating) {
                var index = rating - 1;
                this.paintStars(index, "rated");
                this._state.rating = index + 1;
                this._state.rated = true;
            },
            restoreState: function(e) {
                var index = this.getIndex(e);
                var rating = this._state.rating || -1;
                var colorType = this._state.rated ? "rated" : "active";
                this.paintStars(rating - 1, colorType);
                this.settings.onLeave(index + 1, this._state.rating, this.$el);
            },
            getIndex: function(e) {
                var $target = $(e.currentTarget);
                var width = $target.width();
                var side = $(e.target).attr("data-side");
                var minRating = this.settings.minRating;
                side = !side ? this.getOffsetByPixel(e, $target, width) : side;
                side = this.settings.useFullStars ? "right" : side;
                var index = $target.index() - ("left" === side ? .5 : 0);
                index = index < .5 && e.offsetX < width / 4 ? -1 : index;
                index = minRating && minRating <= this.settings.totalStars && index < minRating ? minRating - 1 : index;
                return index;
            },
            getOffsetByPixel: function(e, $target, width) {
                var leftX = e.pageX - $target.offset().left;
                return leftX <= width / 2 && !this.settings.useFullStars ? "left" : "right";
            },
            initRating: function() {
                this.paintStars(this._state.rating - 1, "active");
            },
            paintStars: function(endIndex, stateClass) {
                var $polygonLeft;
                var $polygonRight;
                var leftClass;
                var rightClass;
                var s = this.settings;
                $.each(this.$stars, function(index, star) {
                    $polygonLeft = $(star).find('[data-side="left"]');
                    $polygonRight = $(star).find('[data-side="right"]');
                    leftClass = rightClass = index <= endIndex ? stateClass : "empty";
                    leftClass = index - endIndex === .5 ? stateClass : leftClass;
                    $polygonLeft.attr("class", "svg-" + leftClass + "-" + this._uid);
                    $polygonRight.attr("class", "svg-" + rightClass + "-" + this._uid);
                    var ratedColorsIndex = endIndex >= 0 ? Math.ceil(endIndex) : 0;
                    var ratedColor;
                    if (s.ratedColors && s.ratedColors.length && s.ratedColors[ratedColorsIndex]) ratedColor = s.ratedColors[ratedColorsIndex]; else ratedColor = this._defaults.ratedColor;
                    if ("rated" === stateClass && endIndex > -1) {
                        if (index <= Math.ceil(endIndex) || index < 1 && endIndex < 0) $polygonLeft.attr("style", "fill:" + ratedColor);
                        if (index <= endIndex) $polygonRight.attr("style", "fill:" + ratedColor);
                    }
                }.bind(this));
            },
            renderMarkup: function() {
                var s = this.settings;
                var baseUrl = s.baseUrl ? location.href.split("#")[0] : "";
                var star = '<div class="jq-star" style="width:' + s.starSize + "px;  height:" + s.starSize + 'px;"><svg version="1.0" class="jq-star-svg" shape-rendering="geometricPrecision" xmlns="http://www.w3.org/2000/svg" ' + this.getSvgDimensions(s.starShape) + " stroke-width:" + s.strokeWidth + 'px;" xml:space="preserve"><style type="text/css">.svg-empty-' + this._uid + "{fill:url(" + baseUrl + "#" + this._uid + "_SVGID_1_);}.svg-hovered-" + this._uid + "{fill:url(" + baseUrl + "#" + this._uid + "_SVGID_2_);}.svg-active-" + this._uid + "{fill:url(" + baseUrl + "#" + this._uid + "_SVGID_3_);}.svg-rated-" + this._uid + "{fill:" + s.ratedColor + ";}</style>" + this.getLinearGradient(this._uid + "_SVGID_1_", s.emptyColor, s.emptyColor, s.starShape) + this.getLinearGradient(this._uid + "_SVGID_2_", s.hoverColor, s.hoverColor, s.starShape) + this.getLinearGradient(this._uid + "_SVGID_3_", s.starGradient.start, s.starGradient.end, s.starShape) + this.getVectorPath(this._uid, {
                    starShape: s.starShape,
                    strokeWidth: s.strokeWidth,
                    strokeColor: s.strokeColor
                }) + "</svg></div>";
                var starsMarkup = "";
                for (var i = 0; i < s.totalStars; i++) starsMarkup += star;
                this.$el.append(starsMarkup);
                this.$stars = this.$el.find(".jq-star");
            },
            getVectorPath: function(id, attrs) {
                return "rounded" === attrs.starShape ? this.getRoundedVectorPath(id, attrs) : this.getSpikeVectorPath(id, attrs);
            },
            getSpikeVectorPath: function(id, attrs) {
                return '<polygon data-side="center" class="svg-empty-' + id + '" points="281.1,129.8 364,55.7 255.5,46.8 214,-59 172.5,46.8 64,55.4 146.8,129.7 121.1,241 212.9,181.1 213.9,181 306.5,241 " style="fill: transparent; stroke: ' + attrs.strokeColor + ';" />' + '<polygon data-side="left" class="svg-empty-' + id + '" points="281.1,129.8 364,55.7 255.5,46.8 214,-59 172.5,46.8 64,55.4 146.8,129.7 121.1,241 213.9,181.1 213.9,181 306.5,241 " style="stroke-opacity: 0;" />' + '<polygon data-side="right" class="svg-empty-' + id + '" points="364,55.7 255.5,46.8 214,-59 213.9,181 306.5,241 281.1,129.8 " style="stroke-opacity: 0;" />';
            },
            getRoundedVectorPath: function(id, attrs) {
                var fullPoints = "M520.9,336.5c-3.8-11.8-14.2-20.5-26.5-22.2l-140.9-20.5l-63-127.7 c-5.5-11.2-16.8-18.2-29.3-18.2c-12.5,0-23.8,7-29.3,18.2l-63,127.7L28,314.2C15.7,316,5.4,324.7,1.6,336.5S1,361.3,9.9,370 l102,99.4l-24,140.3c-2.1,12.3,2.9,24.6,13,32c5.7,4.2,12.4,6.2,19.2,6.2c5.2,0,10.5-1.2,15.2-3.8l126-66.3l126,66.2 c4.8,2.6,10,3.8,15.2,3.8c6.8,0,13.5-2.1,19.2-6.2c10.1-7.3,15.1-19.7,13-32l-24-140.3l102-99.4 C521.6,361.3,524.8,348.3,520.9,336.5z";
                return '<path data-side="center" class="svg-empty-' + id + '" d="' + fullPoints + '" style="stroke: ' + attrs.strokeColor + '; fill: transparent; " /><path data-side="right" class="svg-empty-' + id + '" d="' + fullPoints + '" style="stroke-opacity: 0;" /><path data-side="left" class="svg-empty-' + id + '" d="M121,648c-7.3,0-14.1-2.2-19.8-6.4c-10.4-7.6-15.6-20.3-13.4-33l24-139.9l-101.6-99 c-9.1-8.9-12.4-22.4-8.6-34.5c3.9-12.1,14.6-21.1,27.2-23l140.4-20.4L232,164.6c5.7-11.6,17.3-18.8,30.2-16.8c0.6,0,1,0.4,1,1 v430.1c0,0.4-0.2,0.7-0.5,0.9l-126,66.3C132,646.6,126.6,648,121,648z" style="stroke: ' + attrs.strokeColor + '; stroke-opacity: 0;" />';
            },
            getSvgDimensions: function(starShape) {
                return "rounded" === starShape ? 'width="550px" height="500.2px" viewBox="0 146.8 550 500.2" style="enable-background:new 0 0 550 500.2;' : 'x="0px" y="0px" width="305px" height="305px" viewBox="60 -62 309 309" style="enable-background:new 64 -59 305 305;';
            },
            getLinearGradient: function(id, startColor, endColor, starShape) {
                var height = "rounded" === starShape ? 500 : 250;
                return '<linearGradient id="' + id + '" gradientUnits="userSpaceOnUse" x1="0" y1="-50" x2="0" y2="' + height + '"><stop  offset="0" style="stop-color:' + startColor + '"/><stop  offset="1" style="stop-color:' + endColor + '"/> </linearGradient>';
            },
            executeCallback: function(rating, $el) {
                var callback = this.settings.callback;
                callback(rating, $el);
            }
        };
        var publicMethods = {
            unload: function() {
                var _name = "plugin_" + pluginName;
                var $el = $(this);
                var $starSet = $el.data(_name).$stars;
                $starSet.off();
                $el.removeData(_name).remove();
            },
            setRating: function(rating, round) {
                var _name = "plugin_" + pluginName;
                var $el = $(this);
                var $plugin = $el.data(_name);
                if (rating > $plugin.settings.totalStars || rating < 0) return;
                if (round) rating = Math.round(rating);
                $plugin.applyRating(rating);
            },
            getRating: function() {
                var _name = "plugin_" + pluginName;
                var $el = $(this);
                var $starSet = $el.data(_name);
                return $starSet._state.rating;
            },
            resize: function(newSize) {
                var _name = "plugin_" + pluginName;
                var $el = $(this);
                var $starSet = $el.data(_name);
                var $stars = $starSet.$stars;
                if (newSize <= 1 || newSize > 200) {
                    console.error("star size out of bounds");
                    return;
                }
                $stars = Array.prototype.slice.call($stars);
                $stars.forEach((function(star) {
                    $(star).css({
                        width: newSize + "px",
                        height: newSize + "px"
                    });
                }));
            },
            setReadOnly: function(flag) {
                var _name = "plugin_" + pluginName;
                var $el = $(this);
                var $plugin = $el.data(_name);
                if (true === flag) $plugin.$stars.off("mouseover mouseout click"); else {
                    $plugin.settings.readOnly = false;
                    $plugin.addListeners();
                }
            }
        };
        $.extend(Plugin.prototype, methods);
        $.fn[pluginName] = function(options) {
            if (!$.isPlainObject(options)) if (publicMethods.hasOwnProperty(options)) return publicMethods[options].apply(this, Array.prototype.slice.call(arguments, 1)); else $.error("Method " + options + " does not exist on " + pluginName + ".js");
            return this.each((function() {
                if (!$.data(this, "plugin_" + pluginName)) $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }));
        };
    })(jQuery, window, document);
    $(".clients__rating").starRating({
        starSize: 22,
        initialRating: 4,
        emptyColor: "white",
        strokeColor: "#F3CD03",
        strokeWidth: 50,
        useFullStars: true,
        hoverColor: "#F3CD03",
        activeColor: "#F3CD03",
        callback: function(currentRating, $el) {}
    });
    let nununu = document.querySelector(".col-nav");
    let nanana = document.querySelector(".btn-search");
    nanana.addEventListener("click", (function() {
        nununu.classList.toggle("col-nav--active");
    }));
    window["FLS"] = true;
    isWebp();
    menuInit();
})();