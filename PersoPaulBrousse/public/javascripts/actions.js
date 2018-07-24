$(document).ready(function(){
    $(".add-nav-element").click(function(){
        swal({
            text: 'Donnez un nom à votre nouveau élément de navigation',
            content: "input",
            button: {
                text: "Valider",
            }
        }).then(name => {
            if(!name){
                return;
            }
            $.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    'name': name
                },
                url: "/admin/gestion/navelement/add",
                error: function (jqXHR, textStatus, errorThrown) {
                    swal("Erreur", "Une erreur est survenue pendant la création de l'élément de navigation", "error");
                },
                success: function (msg) {
                    swal("Félicitation", "Votre élément de navigation a bien été ajouté !", "success").then(function(){
                      location.reload();  
                    });
                }
            });
        }).catch(err => {
            if (err) {
                swal("Erreur", "Une erreur est arrivée !", "error");
            } else {
                swal.close();
            }
        });
    });
    
    $(".add-sub-nav-element").click(function(){
        swal({
            text: 'Donnez un nom à votre nouveau sous-élément de navigation',
            content: "input",
            button: {
                text: "Valider",
            }
        }).then(name => {
            if(!name){
                return;
            }
            $.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    'name': name,
                    'idparent': $(this).find("input").val()
                },
                url: "/admin/gestion/navsubelement/add",
                error: function (jqXHR, textStatus, errorThrown) {
                    swal("Erreur", "Une erreur est survenue pendant la création du sous-élément de navigation", "error");
                },
                success: function (msg) {
                    swal("Félicitation", "Votre sous-élément de navigation a bien été ajouté !", "success").then(function(){
                      location.reload();  
                    });
                }
            });
        }).catch(err => {
            if (err) {
                swal("Erreur", "Une erreur est arrivée !", "error");
            } else {
                swal.close();
            }
        });
    });
});