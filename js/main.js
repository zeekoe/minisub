require.config({
    paths: {
        'knockout': 'plugins/knockout-2.2.1',
        'mapping': 'plugins/knockout.mapping-latest',
        'postbox': 'plugins/knockout-postbox.min',
        'jquery': 'plugins/jquery-1.7.2.min',
        'jqueryui': 'plugins/jquery-ui-1.8.20.min',
        'jquery.cookie': 'plugins/jquery.cookie',
        'jquery.fancybox': 'plugins/fancybox/jquery.fancybox.pack',
        'jquery.scrollTo': 'plugins/jquery.scrollTo.min',
        'sammy': 'plugins/sammy-latest.min',
        'domReady': 'plugins/domReady',
        'jplayer': 'jplayer/jquery.jplayer.min',
        'splitter': 'plugins/splitter',
        'model': 'model',
        'global': 'global',
        'utils': 'utils',
        'player': 'player'
    },
    shim: {
        'jquery.cookie': {
            deps: ['jquery']
        },
        'jquery.fancybox':{
            deps: ['jquery']
        },
        'jquery.scrollTo':{
            deps: ['jquery']
        },
        "jqueryui": {
            exports: "$",
            deps: ['jquery']
        },
        'sammy': {
            deps: ['jquery'],
            exports: 'Sammy'
        },
        'jplayer': {
            deps: ['jquery'],
            exports: 'jPlayer'
        },
        'splitter': {
            deps: ['jquery']
        },
    },
    baseUrl: "js"
}); 
require(['jquery', 'knockout', 'sammy', 'global', 'utils', 'mainViewModel', 'subsonicViewModel', 'archiveViewModel', 'player', 'jqueryui', 'jquery.fancybox', 'splitter', 'domReady!'], function ($, ko, Sammy, global, utils, mainViewModel, subsonicViewModel, archiveViewModel, player) {
    var self = this;

    function resizeSplitter(el) {
        $(el).trigger("resize");
    }
    $('#SubsonicAlbums').splitter({
        type: "v",
        sizeLeft: 150,
        cookie: "splitter1",
        resizeToWidth: true
    });
    $('#SubsonicAlbumsRight').splitter({
        type: "v",
        cookie: "splitter2",
        resizeToWidth: true
    });
    $('#SubsonicArtists').resize(function() {
        resizeSplitter('#SubsonicAlbumsRight');
    });
    $('#ArchiveAlbums').splitter({
        type: "v",
        cookie: "splitter3",
        resizeToWidth: true
    });
    $('#ArchiveAlbumsRight').splitter({
        type: "v",
        cookie: "splitter4",
        resizeToWidth: true
    });
    $('#ArchiveArtists').resize(function() {
        resizeSplitter('#ArchiveAlbumsRight');
    });

    $('.noselect').disableSelection();

    $.ajaxSetup({
        'beforeSend': function () {
            $("#loading").show();
        },
        'complete': function () {
            $("#loading").hide();
        }
    });

    $("a#coverartimage").fancybox({
        beforeShow : function() {
            //this.title = $('#songdetails_artist').html();
        },
        afterLoad : function() {
            //this.inner.prepend( '<h1>1. My custom title</h1>' );
            //this.content = '<h1>2. My custom title</h1>';
        },
        hideOnContentClick: true,
        type: 'image',
        openEffect: 'none',
        closeEffect: 'none',
    });

    $('#audiocontainer .scrubber').mouseover(function (e) {
        $('.audiojs .scrubber').stop().animate({ height: '8px' });
    });
    $('#audiocontainer .scrubber').mouseout(function (e) {
        $('.audiojs .scrubber').stop().animate({ height: '4px' });
    });

    // JQuery UI Sortable - Drag and drop sorting
    var fixHelper = function (e, ui) {
        ui.children().each(function () {
            $(this).width($(this).width());
        });
        return ui;
    };
    $("#tabQueue ul.songlist").sortable({
        helper: fixHelper
    }).disableSelection();

    // Custom Binding for (stopBinding: true)
    ko.bindingHandlers.stopBinding = {
        init: function () {
            return { controlsDescendantBindings: true };
        }
    };
    //KO 2.1, now allows you to add containerless support for custom bindings
    //ko.virtualElements.allowedBindings.stopBinding = true;

    // Custom Binding for Enter Key (Use on input, returnKey: function)
    ko.bindingHandlers.returnKey = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            ko.utils.registerEventHandler(element, 'keydown', function (evt) {
                if (evt.keyCode === 13) {
                    evt.preventDefault();
                    evt.target.blur();
                    valueAccessor().call(viewModel);
                }
            });
        }
    };

    ko.bindingHandlers.templateWithContext = {
        init: function() {
            return ko.bindingHandlers.template.init.apply(this, arguments);
        },
        update: function(element, valueAccessor) {
            var options = ko.utils.unwrapObservable(valueAccessor());

            if (options.context) {
                options.context.data = options.data;
                options.data = options.context;  
                delete options.context;
            }

            ko.bindingHandlers.template.update.apply(this, arguments);
        } 
    };           

    ko.applyBindings(new mainViewModel());
    ko.applyBindings(subsonicViewModel, $('#tabLibrary')[0]);
    ko.applyBindings(new archiveViewModel(), $('#tabArchive')[0]);

    // Variable Init
    if (global.settings.SaveTrackPosition()) {
        player.loadTrackPosition();
    }
    if (global.settings.Theme() == 'Dark') {
        utils.switchTheme(global.settings.Theme());
    }
   
});