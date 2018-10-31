!(function(window) {
    var html = document.documentElement,
        dpr = window.devicePixelRatio || 1,
        resize = 'orientationchange' in window ? 'orientationchange' : 'resize',
        setHtmlFontSize = function() {
            var htmlWidth = html.getBoundingClientRect().width || 360;
            (1 == dpr || htmlWidth > 720) && (htmlWidth = 720),
                (html.style.fontSize = htmlWidth / 5 + 'px');// 根据此限制不同屏幕宽度下的字体大小
        };
    html.setAttribute('data-dpr', dpr),
        document.addEventListener &&
            (window.addEventListener(resize, setHtmlFontSize, !1),
            'complete' === document.readyState ||
                document.addEventListener(
                    'DOMContentLoaded',
                    function() {
                        setTimeout(setHtmlFontSize);
                console.log('6666')
                        
                    },
                    !1
                ));

})(window);