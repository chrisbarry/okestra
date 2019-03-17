$(function () {

    // using jQuery
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    var csrftoken = getCookie('csrftoken');

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    var seriesData;

    var loadSeries = function () {
        var source = document.getElementById("series-template").innerHTML;
        var template = Handlebars.compile(source);
        $("#value-container").html("");
        $.ajax("/api/data-series/", {
            cache:false,
            success: function (response) {
                seriesData = response;
                window.seriesData = seriesData;
                response.forEach(function (value) {
                    var html = template(value);
                    $("#value-container").append(html);
                });
                if (seriesData.length > 0) {
                    loadPoints(seriesData[0].id, seriesData[0].name);
                    $("#value-container").find("a").first().addClass("active");
                }
            }
        });
    };
    loadSeries();


    $("#addseriesform").submit(function (event) {
        event.preventDefault();
        $.ajax("/api/data-series/", {
            method: "POST",
            dataType: "json",
            data: JSON.stringify({name: $("#addSeriesInput").val()}),
            contentType: "application/json",
            success: function (response) {
                $('#addSeriesModal').modal('hide');
                loadSeries();
                $("#value-container").find("a").removeClass("active");
            }
        })
    });

    $(document.body).on('click', ".nav-link", function () {
        window.loadPoints($(this).data("id"), $(this).data("name"));
        $("#value-container").find("a").removeClass("active");
        $(this).addClass("active");
    });

    $('#addSeriesModal').on('shown.bs.modal', function () {
        $('#addSeriesInput').focus();
    });

    $(document.body).on('click', ".series-row-menu-handle", function (e) {
        $(".series-row-menu").hide();
        $(this).parent().find(".series-row-menu").show();
        //e.preventDefault();
        e.stopPropagation();
    });

    $(document.body).on('mouseover', ".nav-item", function () {
        $(this).find(".series-row-menu-handle").show();
    });

    $(document.body).on('mouseout', ".nav-item", function () {
        $(this).find(".series-row-menu-handle").hide();
    });

    $(document.body).on('click', ".archive-series", function () {
        $.ajax("/api/data-series/" + $(this).parent().parent().data("id") + "/", {
            method: "PATCH",
            dataType: "json",
            data: JSON.stringify({archived: true}),
            contentType: "application/json",
            success: function (response) {
                loadSeries();
            }
        })
    });

    $(document.body).on("click", function () {
        $(".series-row-menu").hide();
    });


    //form validation
    (function () {
        'use strict';
        window.addEventListener('load', function () {
            // Fetch all the forms we want to apply custom Bootstrap validation styles to
            var forms = document.getElementsByClassName('needs-validation');
            // Loop over them and prevent submission
            var validation = Array.prototype.filter.call(forms, function (form) {
                form.addEventListener('submit', function (event) {
                    if (form.checkValidity() === false) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    form.classList.add('was-validated');
                }, false);
            });
        }, false);
    })();

});