var ProjectModule = core.modules.project = {
    firstViewport: core.getWindowWidth(),
    el: {
        projectsContainer: document.getElementById('projects'),
        projectColumns: document.querySelectorAll('.projects .column'),
        projectItems: document.getElementsByClassName('project')
    },
    cls: {
        columnAfter: 'aftercontent',
        columnExpanded: 'column--expanded'
    }
};

ProjectModule.buildTemplate = function (json) {
    var _module = this;
    var html = json.content.rendered;
    // attachments:
    // api//wp-json/wp/v2/media?parent=10&media_type=image
    console.log(html);
    console.log(core.templates.project);
};

ProjectModule.loadProject = function (id) {
    var _module = this;

    var success = function (data) {
        var json = data.responseText;

        if (data.readyState === 4 && json !== '') {
            json = JSON.parse(json);
            _module.buildTemplate(json);
        }
    };

    var error = function (data) {
        var err = JSON.parse(data.responseText);
        console.log(err.message);
    };

    if (id) {
        var request = new core.ajax();
        request.onSuccess = success;
        request.onError = error;
        request.address = '/api/wp-json/wp/v2/project/' + id;
        request.getData(request.address, request.onSuccess, request.onError);
    }
}

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

ProjectModule.updateColumns = function (step) {
    var _module = this;
    var elements = _module.el.projectColumns;
    var cls, element, index, clearedCls;

    for (var i in elements) {
        if (_module.el.projectColumns.hasOwnProperty(i)) {
            index = parseInt(i) + 1;
            element = elements[i];
            element.classList.remove(_module.cls.columnAfter);
            // core.removeClass(element, _module.cls.columnAfter);

            if (index === step || index % step === 0) {
                element.classList.add(_module.cls.columnAfter);
                // cls = element.getAttribute('class');
                // element.setAttribute('class', cls + _module.cls.columnAfter);
            }
        }
    }
};

ProjectModule.selectColumn = function (item) {
    var _module = this,
        current = false;

    var parent = item.parentNode;
    var parentCls = parent.getAttribute('class');
    var currentCls = _module.cls.columnExpanded;

    if (parentCls.indexOf(currentCls) != -1) {
        // clicked column is currently active - we do nothing!
        current = true;
    } else {
        var columns = _module.el.projectColumns;
        var column;

        //remove current class from columns
        for(var i = 0; i < columns.length; i++) {
            column = columns[i];
            if (column.classList.contains(currentCls)) {
                column.classList.remove(currentCls);
            }
        }

        //select current element by adding a class
        parent.classList.add(currentCls);
    }

    //return boolean - for checking the state inside the bindItemEvents method
    return current;
}

ProjectModule.bindItemEvents = function () {
    var _module = this;
    var items = _module.el.projectItems;
    var id = null, idAttr;

    var clickFunction = function (e) {
        e.preventDefault();
        idAttr = this.getAttribute('data-id');

        if (idAttr) {
            _module.selectColumn(this);
            _module.loadProject(idAttr);
        } else {
            throw "data-id attribute does not exist";
        }
    };

    for(var i = 0; i < items.length; i++) {
        items[i].addEventListener('click', clickFunction);
    }
}

ProjectModule.init = function (_module) {
    _module.resolveViewport(_module.firstViewport, _module);
    _module.observeViewport();
    _module.bindItemEvents();
}.call(core, ProjectModule)
