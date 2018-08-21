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
        if(type.localeCompare("CONTENT") == 0 || type.localeCompare("LIST") == 0){
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
    
    $(".delete-article").click(function(){
        swal({
            title: "Etes-vous sûr ?",
            text: "Voulez-vous vraiment supprimer l'article ?",
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
                    'listelementid': $(this).find("input").val()
                },
                url: "/admin/gestion/articles/delete",
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
    
    $("#trigger-modal-articles").click(function(){
        $("#validate-modal").attr('class', 'add-article waves-effect waves-green btn-flat');
        $("#validate-modal").find("input.idarticle").val("");
        $("#title-modal").text("Ajouter un article");
        $(".element").hide();
        $(".add-element").show();
        
        $("#title").val("");
        $("#label-title").removeClass("active");
        $("#description").val("");
        $("#label-description").removeClass("active");
        $("#illustration").val("");
        $("#label-illustration").removeClass("active");
        $("#type").val("CONTENT");
        $('select').formSelect();
        $("#content").val("");
        $("#label-content").removeClass("active");
        
        M.Modal.getInstance($("#modal-articles")).open();
    });
    
    $(".modify-article").click(function(){
        var article = JSON.parse($(this).find("input").val());
        console.log(article);
        $("#validate-modal").attr('class', 'valid-modify-article waves-effect waves-green btn-flat');
        $("#validate-modal").find("input.idarticle").val(article.id);
        $("#title-modal").text("Modifier un article");
        $(".element").hide();
        $(".modify-element").show();
        
        $("#title").val(article.title);
        $("#label-title").addClass("active");
        $("#description").val(article.description);
        $("#label-description").addClass("active");
        $("#illustration").val(article.illustration);
        $("#label-illustration").addClass("active");
        $("#type").val(article.type);
        $('select').formSelect();
        
        M.Modal.getInstance($("#modal-articles")).open();
    });
    
    $(".content-article").click(function(){
        $("#validate-modal").attr('class', 'valid-modify-article-content waves-effect waves-green btn-flat');
        $("#validate-modal").find("input.idarticle").val($(this).find("input").val());
        $("#title-modal").text("Modifier le contenu d'un article");
        $(".element").hide();
        $(".modify-content-element").show();
        
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: "/admin/article/" + $(this).find("input").val() + "/content",
            error: function (jqXHR, textStatus, errorThrown) {
                swal("Erreur", jqXHR.responseJSON.error, "error");
            },
            success: function (msg) {
                $("#content").val(msg.success.content);
                $("#label-content").addClass("active");
                M.Modal.getInstance($("#modal-articles")).open();
            }
        });
    });
    
    $(document).on("click", ".add-article", function(){
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                'title': $("#title").val(),
                'description': $("#description").val(),
                'illustration': $("#illustration").val(),
                'content': $("#content").val(),
                'type': $("#type").val(),
                'subnavid': $(this).find("input.idpage").val()
            },
            url: "/admin/gestion/articles/add",
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
    
    $(document).on("click", ".valid-modify-article", function(){
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                'id': $("#validate-modal").find("input.idarticle").val(),
                'title': $("#title").val(),
                'description': $("#description").val(),
                'illustration': $("#illustration").val(),
                'type': $("#type").val(),
            },
            url: "/admin/gestion/articles/modify",
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
    
    $(document).on("click", ".valid-modify-article-content", function(){
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                'id': $("#validate-modal").find("input.idarticle").val(),
                'content': $("#content").val(),
            },
            url: "/admin/gestion/articles/content/modify",
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
    
    $("#slideshow-modif").click(function(){
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: "/admin/slideshow",
            error: function (jqXHR, textStatus, errorThrown) {
                swal("Erreur", jqXHR.responseJSON.error, "error");
            },
            success: function (msg) {
                $("#content").val(msg.success);
                $("#label-content").addClass("active");
                M.textareaAutoResize(document.querySelector('#content'))
                M.Modal.getInstance($("#modal-slideshow")).open();
            }
        });
    });
    
    $("#validate-modal-slideshow").click(function(){
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                'content': $("#content").val(),
            },
            url: "/admin/slideshow",
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
    
    $("#trigger-modal-header").click(function(){
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: "/admin/gestion/list/" + $(this).find("input").val() + "/header",
            error: function (jqXHR, textStatus, errorThrown) {
                swal("Erreur", jqXHR.responseJSON.error, "error");
            },
            success: function (msg) {
                $("#header-content").val(msg.success);
                $("#label-header-content").addClass("active");
                M.textareaAutoResize(document.querySelector('#header-content'))
                M.Modal.getInstance($("#modal-header")).open();
            }
        });
    });
    
    $("#validate-header-modal").click(function(){
        $.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                'content': $("#header-content").val(),
            },
            url: "/admin/gestion/list/" + $(this).find("input").val() + "/header",
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
    
    $(".delete-adhesion").click(function(){
        swal({
            title: "Etes-vous sûr ?",
            text: "Voulez-vous vraiment supprimer la demande d'adhésion ?",
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
                    'id': $(this).find("input").val()
                },
                url: "/admin/gestion/adhesion/delete",
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
});