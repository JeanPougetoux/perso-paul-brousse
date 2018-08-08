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
});