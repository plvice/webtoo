var ProjectModule = core.modules.project = {
    firstViewport: core.getWindowWidth(),
    el: {
        projectsParent: document.getElementById('projects'),
        projects: document.querySelectorAll('.projects .column'),
        projectItem: document.getElementsByClassName('project')
    },
    cls: {
        columnAfter: ' aftercontent'
    }
};

ProjectModule.buildTemplate = function (root, module, json) {
    var html = json.content.rendered;
    // attachments:
    // api//wp-json/wp/v2/media?parent=10&media_type=image
    console.log(html);
    console.log(core.templates.project);
};

ProjectModule.loadProject = function (root, module, id) {

    var success = function (data) {
        var json = data.responseText;

        if (data.readyState === 4 && json !== '') {
            json = JSON.parse(json);
            module.buildTemplate(root, module, json);
        }
    };

    var error = function (data) {
        var err = JSON.parse(data.responseText);
        console.log(err.message);
    };

    if (id) {
        var request = new root.ajax();
        request.onSuccess = success;
        request.onError = error;
        request.address = '/api/wp-json/wp/v2/project/' + id;
        request.getData(request.address, request.onSuccess, request.onError);
    }
}

ProjectModule.observeViewport = function (root, module) {
    var viewport;

    var timeoutFunction = function () {
        module.resolveViewport(viewport, root, module);
    };

    window.onresize = function () {
        viewport = root.getWindowWidth();
        clearTimeout(wait);
        var wait = setTimeout(timeoutFunction, 500);
    };
};

ProjectModule.resolveViewport = function (viewport, root, module) {
    if (viewport < 624) {
        module.updateColumns(1, root, module);
    } else if (viewport <= 1024) {
        module.updateColumns(2, root, module);
    } else if (viewport > 1024) {
        module.updateColumns(3, root, module);
    }
};

ProjectModule.updateColumns = function (step, root, module) {
    var elements = module.el.projects;
    var cls, element, index, clearedCls;

    for (var i in elements) {
        if (module.el.projects.hasOwnProperty(i)) {
            index = parseInt(i) + 1;
            element = elements[i];
            root.removeClass(element, module.cls.columnAfter);

            if (index === step || index % step === 0) {
                cls = element.getAttribute('class');
                element.setAttribute('class', cls + module.cls.columnAfter);
            }
        }
    }
};

ProjectModule.bindItemEvents = function (root, module) {
    var items = module.el.projectItem;
    var id = null, idAttr;

    var clickFunction = function (e) {
        e.preventDefault();
        idAttr = this.getAttribute('data-id');

        if (idAttr) {
            module.loadProject(root, module, idAttr);
        } else {
            throw "data-id attribute does not exist";
        }
    };

    for(var i = 0; i < items.length; i++) {
        items[i].addEventListener('click', clickFunction);
    }
}

ProjectModule.init = function (root, module) {
    module.resolveViewport(module.firstViewport, root, module);
    module.observeViewport(root, module);
    module.bindItemEvents(root, module);
}.call(core, core, ProjectModule)
