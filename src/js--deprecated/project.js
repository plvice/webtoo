ProjectModule.updateColumns = function (step) {
    var _module = this;
    var elements = _module.el.projectColumns;
    var cls,
        element,
        index,
        clearedCls;

    for (var i in elements) {
        if (_module.el.projectColumns.hasOwnProperty(i)) {
            index = parseInt(i) + 1;
            element = elements[i];
            element.classList.remove(_module.cls.columnAfter);

            if (index === step || index % step === 0) {
                element.classList.add(_module.cls.columnAfter);
            }
        }
    }
};

ProjectModule.observeViewport = function () {
    var _module = this;
    var viewport;

    var timeoutFunction = function () {
        _module.resolveViewport(viewport);
    };

    window.onresize = function () {
        viewport = core.getWindowWidth();
        clearTimeout(wait);
        var wait = setTimeout(timeoutFunction, 500);
    };
};

ProjectModule.resolveViewport = function (viewport) {
    var _module = this;

    if (viewport < 624) {
        _module.updateColumns(1);
    } else if (viewport <= 1024) {
        _module.updateColumns(2);
    } else if (viewport > 1024) {
        _module.updateColumns(3);
    }
};
