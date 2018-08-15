$(document).ready(function(){
    $("#subscribe-button").click(function(){
        var mail = $("#email").val();
        if(mail == "" || mail == null){
            swal("Erreur", "Veuillez saisir un email", "error");
        } else {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    'mail': mail
                },
                url: "/newsletter/subscribe",
                error: function (jqXHR, textStatus, errorThrown) {
                    swal("Erreur", jqXHR.responseJSON.error, "error");
                },
                success: function (msg) {
                    swal("Félicitation", msg.success, "success").then(function(){
                        $("#email").val("");
                        $("#label-mail").removeClass("active");
                        M.Modal.getInstance($("#modal-newsletter")).close();
                    });
                }
            });
        }
    });

    $(".access-content").on('mousedown', function () {
        var id = $(this).find("input.id").val();
        var type = $(this).find("input.type").val();

        if(type.localeCompare("LINK") == 0){
            $.ajax({
                type: 'GET',
                dataType: 'json',
                url: "/article/" + id,
                context: this,
                error: function (jqXHR, textStatus, errorThrown) {
                    swal("Erreur", jqXHR.responseJSON.error, "error");
                },
                success: function (msg) {
                    $(this).attr("href", "/public/images/" + msg.success);
                    $(this).attr("download", msg.success);
                }
            });
        } else {
            $(this).attr("href", id);
        }
    });

    $(".page").click(function(){
        $(".collection").addClass("no-display");
        var page = $(this).text();
        if(page == 1){
            $(".left-c").parent().addClass("disabled");
        } else {
            $(".left-c").parent().removeClass("disabled");
        }
        if($(this).hasClass("lastC")){
            $(".right-c").parent().addClass("disabled");
        } else {
            $(".right-c").parent().removeClass("disabled");
        }
        $(".page-" + page).removeClass("no-display");
        $(".pagination li").removeClass("active");
        $(this).parent().addClass("active");
    });

    $(".left-c").click(function(){
        var activePage = $(".pagination").find(".active").text();
        if(activePage != 1){
            var newPage = parseInt(activePage) - 1;
            $("#li-p-" + newPage).click();
        }
    });
    
    $(".right-c").click(function(){
        var activePage = $(".pagination").find(".active").find("a");
        if(!activePage.hasClass("lastC")){
            var newPage = parseInt(activePage.text()) + 1;
            $("#li-p-" + newPage).click();
        }
    });
});