/* global $j */

function show_error(field, campo, msg) {
    modal_window({
        message: '<div class="alert alert-danger">' + msg + '</div>',
        title: 'Error en ' + campo,
        close: function() {
            $j('#' + field).parents('.form-group').addClass('has-error');
            $j('#' + field).focus();
        }
    });

    return false;
}

function show_warning(field, campo, msg) {
    modal_window({
        message: '<div class="alert alert-warning">' + msg + '</div>',
        title: 'Atención en ' + campo,
        close: function() {
            $j('#' + field).parents('.form-group').addClass('has-error');
            $j('#' + field).focus();
        }
    });

    return false;
}

function addWarningBtn(field, title = "click me...", icon = "glyphicon glyphicon-ok") {
    //lagcy function
    prepend_btn(field, title, icon);
}

function prepend_btn(field, title = "click me...", icon = "glyphicon glyphicon-ok") {

    $obj = $j('#' + field).closest('div');

    var $container = $j('<div/>', {
        class: "input-group"
    });

    var $append = $j('<span/>', {
        class: 'input-group-append'
    });

    var $btn = $j('<button/>', {
        class: 'btn btn-default btn-fix',
        "data-field": field,
        type: "button",
        title: title
    });

    var $btn_image = $j('<span/>', {
        class: icon
    });

    $btn.append($btn_image);
    $append.append($btn);
    $container.append($obj.html()).append($append);
    $obj.html($container);

}

function ToggleFix(field, a = 'default') {

    //$field = $j('#' + field).next().children('.btn-fix');
    $field = $j('.btn-fix [datafield="' + field + '"]')

    if (!$field.hasClass('btn-' + a)) {

        $field.removeClass('btn-warning btn-danger btn-default');
        $field.children().removeClass('glyphicon-warning-sign glyphicon-remove glyphicon-ok');

        if (a === 'default') {
            $field.children().toggleClass('glyphicon-ok');
            $j('#' + field).parents('.form-group').removeClass('has-error');
        }
        if (a === 'warning') {
            $field.children().toggleClass('glyphicon-warning-sign');
        }
        if (a === 'danger') {
            $field.children().toggleClass('glyphicon-remove');
        }
        $field.toggleClass('btn-' + a);
    }
}

function is_add_new() {
    var add_new_mode = (!$j('input[name=SelectedID]').val());
    return add_new_mode;
}

function getNumbers(inputString) {
    var regex = /\d+\.\d+|\.\d+|\d+/g,
        results = [],
        n;

    while (n = regex.exec(inputString)) {
        results.push(parseFloat(n[0]));
    }
    return results;
}

function showCard(field, dest, url) {
    //field = field to get the ID from
    //dest = ID where to put the html result
    //url = url&cmd for ajax
    var Data = $j('#' + field + '-container').select2("data");
    var id = parseInt(Data.id) || 0;
    if (id < 1) {
        id = parseInt($j('#' + field).val());
    }
    ajaxCard(id, url, dest);
}

function ajaxCard(id, url, dest) {
    if (id > 0) {
        $j.ajax({
                method: 'post', //post, get
                dataType: 'html', //json,text,html
                url: 'hooks/' + url + '.php',
                cache: 'false',
                data: { id: id, cmd: url }
            })
            .done(function(msg) {
                //function at response
                $j("#" + dest).html(msg).show();
            });
    }
}

function showCardsTV(field, dest, url) {
    //field = field to get the ID from
    //dest = ID where to put the html result
    //url = url&cmd for ajax
    var id = parseInt($j('#' + dest).attr('myId')) || 0; //este id es el id del registro
    if (id > 0) {
        $j.ajax({
                method: 'post', //post, get
                dataType: 'html', //json,text,html
                url: 'hooks/contacts_companies_AJAX.php',
                cache: 'false',
                data: { id: id, cmd: 'record' }
            })
            .done(function(msg) {
                //function at response
                var data = $j.parseJSON(msg);
                ajaxCard(data[`${field}`], url, dest);
            });
    }
}


function showItem(id, dest, url) {
    //field = field to get the ID from
    //dest = ID where to put the html result
    //url = url&cmd for ajax
    if (id > 0) {
        $j.ajax({
                method: 'post', //post, get
                dataType: 'html', //json,text,html
                url: 'hooks/' + url + '_card_AJAX.php',
                cache: 'false',
                data: { id: id, cmd: 'record' }
            })
            .done(function(msg) {
                //function at response
                //            var data = $j.parseJSON(msg);
                //            ajaxCard( data[`${field}`], url, dest );
                $j(dest).html(msg);
                showTumbs();
            });
    }
}

function showParent(Data) {
    var parent_id = parseInt(Data.attributes.myid.value);
    var pt = Data.attributes.pt.value;
    var title = Data.attributes.title.value;
    modal_window({
        url: pt + '_view.php?Embedded=1&SelectedID=' + encodeURIComponent(parent_id),
        close: function() {
            var field_id = $j('#' + pt + '_view_parent').prevAll('input:hidden').eq(0).attr('id');
            $j('#' + field_id + '-container').select2('focus').select2('focus');
        },
        size: 'full',
        title: title
    });
}

//remove empty values from table
function removeEmpty() {
    $j('dt').filter(function() {
        var t = ($j(this).next().is('dd'));
        if (t) {
            var a = $j(this).next().text();
            a = a.replace(/(\r\n|\n|\t|\r)/gm, "");
            if (a === '' || a === ' ' || a === '\xa0') { //&nbsp;
                $j(this).next().remove();
                return true;
            }
            return false;
        }
    }).remove();
}

function getUrlVars(url) {
    //https://stackoverflow.com/questions/17483057/convert-url-to-json
    var hash;
    var myJson = {};
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        myJson[hash[0]] = hash[1];
    }
    return myJson;
}

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}