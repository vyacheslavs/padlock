var options = options || {};

options.settings = typeof(localStorage.settings)=='undefined' ? {} : JSON.parse(localStorage.settings);

$(function(){
    $("[data-hide]").on("click", function() {
        $(this).closest("." + $(this).attr("data-hide")).hide();
    });

    $("#tab_2").on("click", function() {
        $("#alert_server_not_configured").show();
    });

});
