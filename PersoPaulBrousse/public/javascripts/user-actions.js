$(document).ready(function(){
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
                    $("#pdf").attr('src', "/images/" + msg.success);
                    $("#dialog").dialog();
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

    $("#adhere-button").click(function(){
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                'firstname': $("#firstname").val(),
                'lastname': $("#lastname").val(),
                'service': $("#service").val(),
                'email': $("#email").val(),
                'phone': $("#phone").val(),
            },
            url: "/adhere",
            error: function (jqXHR, textStatus, errorThrown) {
                swal("Erreur", jqXHR.responseJSON.error, "error");
            },
            success: function (msg) {
                swal("Félicitation", msg.success, "success").then(function(){
                    location.reload();  
                });
            }
        });
    });

    $('.trigger-pdf').click(function(){
        var pdf = $(this).find("input").val();
        $("#pdf").attr('src', "/images/" + pdf);
        $("#dialog").dialog();
    }); 
});