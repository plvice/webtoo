
var YoutubeModule = core.modules.youtube = {
    el: {
        playButton: document.querySelectorAll('[data-yt]'),
        landscape: document.getElementsByClassName('landscape')
    }
};

YoutubeModule.bindButtons = function () {
    var _module = this;

    _module.el.playButton[0].addEventListener('click', function(e) {
        e.preventDefault();

        if (!core.state.playerAdded) {
            var destination = _module.el.landscape[0];
            var videoId = this.getAttribute('data-yt');

            var attributes = {
                class: 'landscape__video',
                src: 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0',
                width: 500,
                height: 500,
                frameborder: 0,
                allowfullscreen: ''
            };

            _module.insertPlayer(attributes, destination);
            core.state.playerAdded = true;
        }
    });
};

YoutubeModule.insertPlayer = function (attributes, destination) {
    var yt = core.createNode('iframe', attributes);
    destination.appendChild(yt);
};

YoutubeModule.init = function (_module) {
    _module.bindButtons();
}.call(core, YoutubeModule);
