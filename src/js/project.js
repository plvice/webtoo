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
    activeDropdown: null,
    activeItem: null
};

// można się zastanowić na usunięciem tego
ProjectModule.buildTemplate = function (data) {
    var template = core.templates.project;
    var html = template(data);
    return html;
};

ProjectModule.insertItemContent = function (html) {
    var _module = this;
    var parent = _module.activeItem.parentNode;
    var dropdown = parent.getElementsByClassName(_module.cls.dropdown);

    //add dropdown: only if not exists for this project
    if (!dropdown.length) {
        //można wykorzystać metodę z core.js
        var node = document.createElement('div');
        node.setAttribute('class', 'dropdown');
        node.innerHTML = html;
        parent.appendChild(node);
    }
}

ProjectModule.loadItem = function (id) {
    var _module = this;

    var success = function (data) {
        var json = data.responseText;

        if (data.readyState === 4 && json !== '') {
            json = JSON.parse(json);

            //można tu bezpośrednio wywołać szablon - będzie jedna metoda mniej
            var html = _module.buildTemplate(json);
            _module.insertItemContent(html);
            _module.selectItem(_module.activeItem);
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

//tu chyba bardziej pasuje nazwa showItem
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
        // _module.loadItem();
    }

    //return boolean - for checking the state inside the bindItemEvents method
    return allowToLoad;
}

ProjectModule.setDropdownHeight = function (parent) {
    var _module = this;
    var activeDropdown = _module.activeDropdown;
    console.log(parent);
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
    var id,
        isActive;

    var clickFunction = function (e) {
        e.preventDefault();

        id = this.getAttribute('data-id');
        // isToLoad = _module.selectItem(this);

        isActive = this.parentNode.classList.contains(_module.cls.columnExpanded);
        console.log('is active: ' + isActive);

        //check if data-id exists and clicked item is not active
        if (id && !isActive) {
            _module.activeItem = this;
            _module.loadItem(id);
        }
    };

    for(var i = 0; i < items.length; i++) {
        items[i].addEventListener('click', clickFunction);
    }
}

ProjectModule.init = function (_module) {
    _module.bindItemEvents();
}.call(core, ProjectModule)
