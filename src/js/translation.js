
var TranslationModule = core.modules.translation = {
    el: {
        button: document.getElementById('translate'),
        audio: document.getElementById('translation')
    }
};

TranslationModule.bindTranslation = function (root, module) {
    module.el.button.addEventListener('click', function(e) {
        e.preventDefault();
        module.el.audio.play();
    });
};

TranslationModule.init = function (root, module) {
    module.bindTranslation(root, module);
}.call(core, core, TranslationModule);
