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
                    swal("Erreur", jqXHR.responseJSON.error, "error");
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
            } else {
                var idparent = $(this).find("input").val();
                swal({
                    text: 'Donnez le type de contenu de votre nouveau sous-élément de navigation (CONTENT, LINK, LIST)',
                    content: "input",
                    button: {
                        text: "Valider"
                    }
                }).then(function(type){
                    if(type != "CONTENT" && type != "LINK" && type != "LIST"){
                        swal("Erreur", "Le type doit être CONTENT, LINK ou LIST", "error");
                    } else {
                        $.ajax({
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                'name': name,
                                'type': type,
                                'idparent': idparent
                            },
                            url: "/admin/gestion/navsubelement/add",
                            error: function (jqXHR, textStatus, errorThrown) {
                                swal("Erreur", jqXHR.responseJSON.error, "error");
                            },
                            success: function (msg) {
                                swal("Félicitation", msg.success, "success").then(function(){
                                    location.reload();  
                                });
                            }
                        });
                    }
                }).catch(err => {
                    if (err) {
                        swal("Erreur", "Une erreur est arrivée !", "error");
                    } else {
                        swal.close();
                    }
                });
            }
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
                    swal("Erreur", jqXHR.responseJSON.error, "error");
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
                    swal("Erreur", jqXHR.responseJSON.error, "error");
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
                    swal("Erreur", jqXHR.responseJSON.error, "error");
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
                    swal("Erreur", jqXHR.responseJSON.error, "error");
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
                swal("Erreur", jqXHR.responseJSON.error, "error");
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
                swal("Erreur", jqXHR.responseJSON.error, "error");
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
                swal("Erreur", jqXHR.responseJSON.error, "error");
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
                swal("Erreur", jqXHR.responseJSON.error, "error");
            },
            success: function (msg) {
                swal("Félicitation", msg.success, "success").then(function(){
                    location.reload();  
                });
            }
        });
    });

    $(".content-sub-nav-element").click(function(){
        const id = $(this).find("input.navelementid").val();
        const type = $(this).find("input.navelementtype").val();
        if(type.localeCompare("CONTENT") == 0){
            location.href = "/admin/gestion/" + id;
        }
        else if(type.localeCompare("LINK") == 0){
            swal({
                text: 'Donnez le nouveau lien du document à télécharger pour ce sous-élément',
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
                        'navsubelementid': id,
                        'newlink': name
                    },
                    url: "/admin/gestion/navsubelement/updatelink",
                    error: function (jqXHR, textStatus, errorThrown) {
                        swal("Erreur", jqXHR.responseJSON.error, "error");
                    },
                    success: function (msg) {
                        swal("Félicitation", msg.success, "success");
                    }
                });
            }).catch(err => {
                if (err) {
                    swal("Erreur", "Une erreur est arrivée !", "error");
                } else {
                    swal.close();
                }
            });
        }
    });

    $(".add-content").click(function(){
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                'navsubelementid': $(this).find("input").val(),
            },
            url: "/admin/gestion/navsubelement/addcontent",
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

    $(".delete-content").click(function(){
        console.log($(this).find("input").val());
        swal({
            title: "Etes-vous sûr ?",
            text: "Voulez-vous vraiment supprimer ce contenu ?",
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
                    'contentid': $(this).find("input").val(),
                },
                url: "/admin/gestion/navsubelement/deletecontent",
                error: function (jqXHR, textStatus, errorThrown) {
                    swal("Erreur", jqXHR.responseJSON.error, "error");
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

    $(".change-content").click(function(){
        var instance = M.Modal.getInstance($("#content-modal"));
        instance.open();
        $("#content-area").val($(this).find("input.content-content").val());
        $("#id-content").val($(this).find("input.content-id").val());
        M.textareaAutoResize($('#content-area'));
        $("#label-content").addClass("active");
    });

    $(".save-content").click(function(){
        const newtext = $("#content-area").val();
        const idcontent = $(this).find("input").val();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                'id': idcontent,
                'content': newtext
            },
            url: "/admin/gestion/pagecontent/modify",
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

    $(".delete-link").click(function(){
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                'filename': $(this).find("input").val(),
            },
            url: "/admin/gestion/documents/delete",
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
});