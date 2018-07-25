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
                    swal("Félicitation", msg.success, "success").then(function(){
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
                    swal("Félicitation", msg.success, "success").then(function(){
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

    $(".modify-nav-element").click(function(){
        swal({
            text: 'Donnez le nouveau nom de votre élément de navigation',
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
                    'newname': name,
                    'navelementid': $(this).find("input").val()
                },
                url: "/admin/gestion/navelement/modify",
                error: function (jqXHR, textStatus, errorThrown) {
                    swal("Erreur", "Une erreur est survenue pendant le changement du nom de l'élément de navigation", "error");
                },
                success: function (msg) {
                    swal("Félicitation", msg.success, "success").then(function(){
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

    $(".modify-sub-nav-element").click(function(){
        swal({
            text: 'Donnez le nouveau nom de votre sous-élément de navigation',
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
                    'newname': name,
                    'navsubelementid': $(this).find("input").val()
                },
                url: "/admin/gestion/navsubelement/modify",
                error: function (jqXHR, textStatus, errorThrown) {
                    swal("Erreur", "Une erreur est survenue pendant le changement du nom de l'élément de sous-navigation", "error");
                },
                success: function (msg) {
                    swal("Félicitation", msg.success, "success").then(function(){
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

    $(".delete-nav-element").click(function(){
        swal({
            title: "Etes-vous sûr ?",
            text: "Voulez-vous vraiment supprimer l'élément de navigation ?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if(!willDelete){
                return;
            }
            $.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    'navelementid': $(this).find("input").val()
                },
                url: "/admin/gestion/navelement/delete",
                error: function (jqXHR, textStatus, errorThrown) {
                    swal("Erreur", "Une erreur est survenue pendant la suppression de l'élément de navigation", "error");
                },
                success: function (msg) {
                    swal("Félicitation", msg.success, "success").then(function(){
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

    $(".delete-sub-nav-element").click(function(){
        swal({
            title: "Etes-vous sûr ?",
            text: "Voulez-vous vraiment supprimer l'élément de sous-navigation ?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if(!willDelete){
                return;
            }
            $.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    'navsubelementid': $(this).find("input").val()
                },
                url: "/admin/gestion/navsubelement/delete",
                error: function (jqXHR, textStatus, errorThrown) {
                    swal("Erreur", "Une erreur est survenue pendant la suppression de l'élément de sous-navigation" + JSON.stringify(jqXHR), "error");
                },
                success: function (msg) {
                    swal("Félicitation", msg.success, "success").then(function(){
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

    $(".up-nav-element").click(function(){
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                'navelementid': $(this).find("input").val()
            },
            url: "/admin/gestion/navelement/up",
            error: function (jqXHR, textStatus, errorThrown) {
                swal("Erreur", JSON.stringify(jqXHR), "error");
            },
            success: function (msg) {
                swal("Félicitation", msg.success, "success").then(function(){
                    location.reload();  
                });
            }
        });
    });
    
    $(".down-nav-element").click(function(){
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                'navelementid': $(this).find("input").val()
            },
            url: "/admin/gestion/navelement/down",
            error: function (jqXHR, textStatus, errorThrown) {
                swal("Erreur", JSON.stringify(jqXHR), "error");
            },
            success: function (msg) {
                swal("Félicitation", msg.success, "success").then(function(){
                    location.reload();  
                });
            }
        });
    });
    
    $(".up-sub-nav-element").click(function(){
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                'navsubelementid': $(this).find("input").val()
            },
            url: "/admin/gestion/navsubelement/up",
            error: function (jqXHR, textStatus, errorThrown) {
                swal("Erreur", JSON.stringify(jqXHR), "error");
            },
            success: function (msg) {
                swal("Félicitation", msg.success, "success").then(function(){
                    location.reload();  
                });
            }
        });
    });
    
    $(".down-sub-nav-element").click(function(){
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                'navsubelementid': $(this).find("input").val()
            },
            url: "/admin/gestion/navsubelement/down",
            error: function (jqXHR, textStatus, errorThrown) {
                swal("Erreur", JSON.stringify(jqXHR), "error");
            },
            success: function (msg) {
                swal("Félicitation", msg.success, "success").then(function(){
                    location.reload();  
                });
            }
        });
    });
});