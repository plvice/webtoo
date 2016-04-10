
var YoutubeModule = core.modules.youtube = {
    el: {
        playButton: document.querySelectorAll('[data-yt]'),
        landscape: document.getElementsByClassName('landscape')
    }
};

YoutubeModule.bindButtons = function (root, module) {
    module.el.playButton[0].addEventListener('click', function(e) {
        e.preventDefault();

        if (!root.state.playerAdded) {
            var destination = module.el.landscape[0];
            var videoId = this.getAttribute('data-yt');

            var attributes = {
                class: 'landscape__video',
                src: 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0',
                width: 500,
                height: 500,
                frameborder: 0,
                allowfullscreen: ''
            };

            module.insertPlayer(root, attributes, destination);
            root.state.playerAdded = true;
        }
    });
};

YoutubeModule.insertPlayer = function (root, attributes, destination) {
    var yt = root.createNode('iframe', attributes);
    destination.appendChild(yt);
};

YoutubeModule.init = function (root, module) {
    module.bindButtons(root, module);
}.call(core, core, YoutubeModule);
