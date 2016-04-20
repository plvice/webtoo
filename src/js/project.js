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
    dataApi: 'api/wp-json/resume/v1/project/',
    activeDropdown: null,
    activeItem: null
};

ProjectModule.buildTemplate = function (data) {
    var template = core.templates.project;
    var html = template(data);
    return html;
};

ProjectModule.insertDropdownContent = function (html) {
    var _module = this;
    var parent = _module.activeItem.parentNode;
    var dropdown = parent.getElementsByClassName(_module.cls.dropdown);

    //add dropdown: only if not exists for this project
    if (!dropdown.length) {
        var node = core.createNode('div', {
            class: _module.cls.dropdown
        });
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

            var html = _module.buildTemplate(json);
            _module.insertDropdownContent(html);

            //we use timeout just for better visual effect
            var wait = function () {
                _module.showDropdown(_module.activeItem);
                core.loader.hide();
            }
            setTimeout(wait, 500);
        }
    };

    var error = function (data) {
        var err = JSON.parse(data.responseText);
        console.log(err.message);
    };

    if (id) {
        core.loader.show();

        var request = new core.ajax();
        request.onSuccess = success;
        request.onError = error;
        request.address = _module.dataApi + id;
        request.getData(request.address, request.onSuccess, request.onError);
    }
}

ProjectModule.showDropdown = function (item) {
    var _module = this;

    var parent = item.parentNode;
    var parentCls = parent.getAttribute('class');
    var currentCls = _module.cls.columnExpanded;

    if (parentCls.indexOf(currentCls) !== -1) {
        // clicked column is currently active - we do nothing!
        return false;
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

        var x = _module.getOffset(_module.activeDropdown).top;
        window.scrollTo(0, x);
    }
}

ProjectModule.getOffset = function (el) {
    var rect = el.getBoundingClientRect();
    var x, y; //x and y
    var scrollTop = document.documentElement.scrollTop?
                    document.documentElement.scrollTop:document.body.scrollTop;
    var scrollLeft = document.documentElement.scrollLeft?
                     document.documentElement.scrollLeft:document.body.scrollLeft;
    y = rect.top+scrollTop;
    x = rect.left+scrollLeft;

    return {
        top: y,
        left: x
    }
}

ProjectModule.setDropdownHeight = function (parent) {
    var _module = this;
    var activeDropdown = _module.activeDropdown;

    var dropdown = parent.getElementsByClassName(_module.cls.dropdown)[0];
    var dropdownContainer = dropdown.getElementsByClassName(_module.cls.dropdownContainer)[0];
    var height = dropdownContainer.offsetHeight.toString().pixelize();

    //if we have the dropdown already opened - reset its height
    if (activeDropdown !== null) {
        activeDropdown.style.maxHeight = '';
        activeDropdown.style.height = '';
    }

    //set the max-height of dropdown
    dropdown.style.maxHeight = height;
    dropdown.style.height = height;

    //share the opened dropdown with other methods
    _module.activeDropdown = dropdown;
}

ProjectModule.bindItemEvents = function () {
    var _module = this;
    var items = _module.el.projectItems;
    var id,
        isNowOpened,
        hasBeenLoaded;

    for (var i = 0; i < items.length; i++) {
        items[i].addEventListener('click', clickFunction);
    }

    function clickFunction (e) {
        e.preventDefault();

        id = this.getAttribute('data-id');
        // isToLoad = _module.showDropdown(this);

        isNowOpened = this.parentNode.classList.contains(_module.cls.columnExpanded);

        hasBeenLoaded = this.parentNode.lastElementChild.classList.contains(_module.cls.dropdown);

        //check if data-id exists and clicked item is not active or has been loaded before
        if (id && !isNowOpened) {
            _module.activeItem = this;

            if (!hasBeenLoaded) {
                _module.loadItem(id);
            } else {
                _module.showDropdown(this);
            }
        }
    }
}

ProjectModule.init = function (_module) {
    this.loader.init();
    _module.bindItemEvents();
}.call(core, ProjectModule)
