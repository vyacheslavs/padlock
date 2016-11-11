var options = options || {};

options.settings = typeof(localStorage.settings)=='undefined' ? {} : JSON.parse(localStorage.settings);


function validateURL(textval) {
    var urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(textval);
}

function try_connect_to_padlock_server() {

    var server = $("#pad_srv").val();
    var port = $("#pad_srv_port").val();

    if (port.length > 0) {
        server = server + ":" + port;
    }

    url = "http://"+server+"/api?action=ehlo";

    if (!validateURL(url)) {
        $("#pad_srv").parent().addClass("has-error");
        $("#pad_srv_port").parent().addClass("has-error");
        return;
    }

    $.get( url, function(data) {
        console.log("done");
    }).fail(function() {
        $("#pad_srv").addClass("has-error");
        $("#pad_srv_port").addClass("has-error");
    });
}

$(function(){
    $("[data-hide]").on("click", function() {
        $(this).closest("." + $(this).attr("data-hide")).hide();
    });

    $("#tab_2").on("click", function() {
        $("#alert_server_not_configured").show();
    });

    $("#try_padlock_server").on("click", function() {
        try_connect_to_padlock_server();
    });
});
