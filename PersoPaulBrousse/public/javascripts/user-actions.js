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
});