function App() {
    this.createNode = function(nodeName, attributeValues) {
        var that = this;
        var resultNode = document.createElement(nodeName);

        if (attributeValues) {
            var attributeNames = Object.keys(attributeValues);
            var propertyVal;

            for (var i = 0; i < attributeNames.length; i++) {
                propertyVal = that.getPropertyValue(attributeValues, i);
                resultNode.setAttribute(attributeNames[i], propertyVal);
            }
        }

        return resultNode;
    }

    this.getWindowWidth = function () {
        return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    }

    this.getPropertyValue = function(obj, n) {
        return obj[Object.keys(obj)[n]];
    }

    /*
        Deprecated 10.04.16 - do not use this
    */
    this.removeClass = function (element, cls) {
        var newCls = element.getAttribute('class').replace(cls,'');
        element.setAttribute('class', newCls);
    }

    this.ajax = function () {
        /*
            Create new instance to get new ajax request;
            var request = new root.ajax();
            request.callback = callbackFunction;
            request.getData('./resumeapi/1.json', request.callback);
        */

        this.onSuccess = null;

        this.onError = null;

        this.getData = function (url, callback, errorCallback) {
            // http://code.tutsplus.com/articles/how-to-make-ajax-requests-with-raw-javascript--net-4855
            // load('test.txt', function(xhr) {
            //     document.getElementById('container').innerHTML = xhr.responseText;
            // });

            var xhr, isError = false;

            if(typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
            else {
                var versions = ["MSXML2.XmlHttp.5.0",
                                "MSXML2.XmlHttp.4.0",
                                "MSXML2.XmlHttp.3.0",
                                "MSXML2.XmlHttp.2.0",
                                "Microsoft.XmlHttp"]

                 for(var i = 0, len = versions.length; i < len; i++) {
                    try {
                        xhr = new ActiveXObject(versions[i]);
                        break;
                    }
                    catch(e){}
                 } // end for
            }

            xhr.onreadystatechange = ensureReadiness;

            function ensureReadiness() {
                if (!isError) {
                    if (xhr.status === 404 || xhr.status === 500 || xhr.status === 403) {
                        if (errorCallback) {
                            errorCallback(xhr);
                        }
                        isError = true;
                        return false;
                    }

                    if(xhr.readyState < 4) {
                        return;
                    }

                    if(xhr.status !== 200) {
                        return;
                    }

                    // all is well
                    if(xhr.readyState === 4) {
                        callback(xhr);
                    }
                }
            }

            xhr.open('GET', url, true);
            xhr.send(null);
        }
    }

    this.state = {
        playerAdded: false
    }

    this.modules = {

    }
}
