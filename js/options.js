var options = options || {};

options.settings = typeof(localStorage.settings)=='undefined' ? {} : JSON.parse(localStorage.settings);

function validateURL(textval) {
    var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(textval);
}

function is_padlock_server_setup() {
    if (typeof(options.settings.cdn.server) == "undefined")
        return false;
    if (typeof(options.settings.cdn.port) == "undefined")
        return false;
    return true;
}

function enable_account_settings() {
    if (!is_padlock_server_setup())
        return;

    $("#acc_settings_tab").show();
}

function notify_invalid_url() {
    $("#pad_srv").parent().removeClass("has-success");
    $("#pad_srv").parent().addClass("has-error");
    $("#pad_srv_port").parent().removeClass("has-success");
    $("#pad_srv_port").parent().addClass("has-error");
    $(".srv_creds_success").hide();
    $(".srv_creds_error").show();
}

function notify_good_url() {
    $("#pad_srv").parent().removeClass("has-error");
    $("#pad_srv").parent().addClass("has-success");
    $("#pad_srv_port").parent().removeClass("has-error");
    $("#pad_srv_port").parent().addClass("has-success");
    $(".srv_creds_error").hide();
    $(".srv_creds_success").show();}

function store_urls(srv, port, url2) {

    options.settings['cdn'] = {};
    options.settings['cdn']['server'] = srv;
    options.settings['cdn']['port'] = port;
    options.settings['server_url'] = url2;

    localStorage['settings'] = JSON.stringify(options.settings);

    notify_good_url();
    enable_account_settings();
}

function try_connect_to_padlock_server() {

    var server = $("#pad_srv").val();
    var port = $("#pad_srv_port").val();

    if (port.length > 0) {
        server = server + ":" + port;
    }

    var url_base = "http://"+server;
    url = url_base+"/api/v1/action/ehlo";

    if (!validateURL(url)) {
        notify_invalid_url();
        return;
    }

    $.get( url, function(data) {
        try {
            json = JSON.parse(data);

            if ( typeof(json.padlock_server) == "undefined" ) {
                notify_invalid_url();
                return;
            }

            if ( typeof(json.padlock_server.host) == "undefined" ) {
                notify_invalid_url();
                return;
            }
            if ( typeof(json.padlock_server.port) == "undefined" ) {
                notify_invalid_url();
                return;
            }

            var url2_base = "http://"+json.padlock_server.host+":"+json.padlock_server.port;
            var url2 = url2_base+"/api/v1/action/helo";
            if ( !validateURL(url2) ) {
                notify_invalid_url();
                return;
            }

            $.get( url2, function(data) {
                try {
                    json = JSON.parse(data)
                    if ( typeof(json.status) == "undefined" ) {
                        notify_invalid_url();
                        return;
                    }

                    if ( json.status != "online" ) {
                        // ...
                    }

                    store_urls($("#pad_srv").val(), $("#pad_srv_port").val(), url2_base);
                    
                } catch (err) {
                    console.log(err);
                    notify_invalid_url();
                }
            }).fail(function() {
                notify_invalid_url();
            });

        } catch (err) {
            console.log(err);
            notify_invalid_url();
        }
    }).fail(function() {
        notify_invalid_url();
    });
}

function load_settings() {
    if (typeof(options.settings.cdn) != "undefined") {
        if (typeof(options.settings.cdn.server) != "undefined") {
            $("#pad_srv").val(options.settings.cdn.server);
            notify_good_url();
        }
        if (typeof(options.settings.cdn.port) != "undefined") {
            $("#pad_srv_port").val(options.settings.cdn.port);
            notify_good_url();
        }
    }
    enable_account_settings();
}

$(function(){
    $("[data-hide]").on("click", function() {
        $(this).closest("." + $(this).attr("data-hide")).hide();
    });

    $("#try_padlock_server").on("click", function() {
        try_connect_to_padlock_server();
    });

    $(".pad_srv_class").on("keydown", function(e) {
        if (e.which == 13) {
            try_connect_to_padlock_server();
        }
    });

    load_settings();
});
