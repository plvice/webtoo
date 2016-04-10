var ProjectModule = core.modules.project = {
    firstViewport: core.getWindowWidth(),
    el: {
        projectsContainer: document.getElementById('projects'),
        projectColumns: document.querySelectorAll('.projects .column'),
        projectItems: document.getElementsByClassName('project')
    },
    cls: {
        columnAfter: 'aftercontent',
        columnExpanded: 'column--expanded',
        dropdown: 'dropdown',
        dropdownContainer: 'dropdown__container'
    },
    dataApi: '/api/wp-json/wp/v2/project/',
    attachmentsApi: 'api//wp-json/wp/v2/media?parent=10&media_type=image',
    activeDropdown: null
};

ProjectModule.buildTemplate = function (data) {
    var template = core.templates.project;
    var html = template(data);
    console.log(html);

};

ProjectModule.loadItem = function (id) {
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
        request.address = _module.dataApi + id;
        request.getData(request.address, request.onSuccess, request.onError);
    }
}

ProjectModule.selectItem = function (item) {
    var _module = this,
        allowToLoad = true;

    var parent = item.parentNode;
    var parentCls = parent.getAttribute('class');
    var currentCls = _module.cls.columnExpanded;

    if (parentCls.indexOf(currentCls) !== -1) {
        // clicked column is currently active - we do nothing!
        allowToLoad = false;
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

        //set current dropdown height
        _module.setDropdownHeight(parent);
    }

    //return boolean - for checking the state inside the bindItemEvents method
    return allowToLoad;
}

ProjectModule.setDropdownHeight = function (parent) {
    var _module = this;
    var activeDropdown = _module.activeDropdown;

    var dropdown = parent.getElementsByClassName(_module.cls.dropdown)[0];
    var dropdownContainer = dropdown.getElementsByClassName(_module.cls.dropdownContainer)[0];
    var height = core.pixelize(dropdownContainer.offsetHeight);

    //if we have the dropdown already opened - reset its height
    if (activeDropdown !== null) {
        activeDropdown.style.maxHeight = '';
    }

    //set the max-height of dropdown
    dropdown.style.maxHeight = height;

    //share the opened dropdown with other methods
    _module.activeDropdown = dropdown;
}

ProjectModule.bindItemEvents = function () {
    var _module = this;
    var items = _module.el.projectItems;
    var idAttr,
        isToLoad;

    var clickFunction = function (e) {
        e.preventDefault();

        idAttr = this.getAttribute('data-id');
        isToLoad = _module.selectItem(this);

        //check if data-id exists and clicked item is not active
        if (idAttr && isToLoad) {
            _module.loadItem(idAttr);
        }
    };

    for(var i = 0; i < items.length; i++) {
        items[i].addEventListener('click', clickFunction);
    }
}

ProjectModule.init = function (_module) {
    _module.bindItemEvents();
}.call(core, ProjectModule)
