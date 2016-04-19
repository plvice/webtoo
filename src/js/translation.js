
var TranslationModule = core.modules.translation = {
    el: {
        button: document.getElementById('translate'),
        audio: document.getElementById('translation')
    }
};

TranslationModule.bindTranslation = function () {
    var _module = this;

    _module.el.button.addEventListener('click', function(e) {
        e.preventDefault();
        _module.el.audio.play();
    });
};

TranslationModule.init = function (_module) {
    _module.bindTranslation();
}.call(core, TranslationModule);
