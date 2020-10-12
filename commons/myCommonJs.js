/* global $j */
var overlayTemplateLoad = '<div class="overlay"><i class="fas fa-4x fa-sync-alt fa-spin"></i></div>';
var overlayTemplateBaned = '<div class="overlay"><i class="fas fa-4x fa-ban"></i></div>';


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

function addWarningBtn(field, title = "click me...", icon = "glyphicon glyphicon-ok") { //lagcy function

    prepend_btn(field, title, text, icon);
}

function prepend_btn(field = false, title = "click me...", text = "", icon_class = "glyphicon glyphicon-ok") {
    if (field) {

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
            title: title,
            text: text
        });

        var $btn_image = $j('<span/>', {
            class: icon_class
        });

        $btn.append($btn_image);
        $append.append($btn);
        $container.append($obj.html()).append($append);
        $obj.html($container);
    }
}

function add_action_button(b = {}, icon = "fa fa-plus") {
    var def = {
        class: "btn btn-default",
        id: "",
        name: "name buton",
        value: "",
        type: "submit",
        onclick: "",
        title: "Title Button...",
        text: "button"
    };
    var $icon = $j('<i/>', { class: icon })

    var set = $j.extend({}, def, b);
    var $b = $j('<button/>', set).append($icon);

    $container = $j('<div/>', {
        class: "btn-group",
        style: "width: 100%;"
    }).append($b);
    $spacer = $j('<p/>');
    $divAction = $j('div[id$="_dv_action_buttons"] div.sticky-top').append($spacer);
    $divAction.append($container);
}

function ToggleFix(field, a = 'default') {

    $field = $j('.btn-fix [data-field="' + field + '"]')

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

/**
 * Display an array of fields inline fileds.
 * ex: inline_fields(['field1', 'field2'],'fields 1&2');
 * 
 * @param {array} fields - Array Fields to inline view.
 * @param {string} label - Label, if note set get the first label of fields.
 * @param {array} width_cols - Array with width cols, use css bootstrap number for this option, default is the same width.
 * @param {integer} label_col - label width default 3.
 * 
 * 
 */
function inline_fields(fields = [], label = false, width_cols = [], label_col = 3) { //place two or more fields of a form online
    if (fields.length > 1) {
        var $container = $j('<div/>', { class: "form-group row " })
        var $index_pos = [];
        var $label = [];
        var i = 0;
        fields.forEach(f => {
            if (fields.length !== width_cols.length) {
                width_cols.push("auto");
            }
            $cols = $j('<div/>', {
                class: "col-sm-" + (width_cols[i] === "auto" ? "auto" : width_cols[i])
            });
            var $input = $j('#' + f).closest('.form-group');
            $input_label = $input.find("label");
            $index_pos.push($j('div').index($input.prev()));
            $label.push($j('<label/>', {
                class: "col-sm-" + label_col + " col-form-label"
            }));
            //se extienden las classes de todos los label al label0, appgini utiliza _view_parent label para llamar al parent
            //$label[0] = $j.extend($label[i], $input_label);
            $label[0].data($input_label.data());
            $cols.append($input.children('div[class^="col-"]').removeClass().addClass("vspacer-sm"))
            $container.append($cols);
            $input.remove();
            i++;
        });
        $label[0].text(label ? label : $label[0].text());
        $container.prepend($label[0]);
        $j("div:eq(" + $index_pos[0] + ")").after($container);
    } else {
        console.warn('You need an array of more than one element');
    }
}

function selected_id() { //return ID from selected record
    return $j('input[name=SelectedID]').val();
}

function is_add_new() { //return true if the user are in add new form 
    var add_new_mode = (!selected_id());
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

function removeEmpty() { //remove empty values from TV
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

function normalizeView() {
    $j('#top_buttons').prepend($j('#addNew'));

    $j('.form-group').addClass('row'); //ad this clas to view the form inline in DV
    $j('.control-label').addClass("col-form-label"); //ad this clas to view the form inline in DV

    var $div = $j('<div />', {
        class: "card-header"
    });

    $div.append($j('.page-header > h4'));
    $div.append($j('#top_buttons'));
    $j('.table_view').addClass('card card-default').prepend($div);
    $j('.table').addClass('table-sm').removeClass('table-striped table-bordered ');
    // hide selector in table
    $j('.record_selector').parent('td').hide();
    $j('#select_all_records').parent('th').hide();

    $j('.pagination-section').addClass('justify-content-center');

    //remueve texto de los botones y los hace btn-group
    removeText('#top_buttons .btn-group .btn');
    removeText('.pagination-section .btn');
    removeText('.btn');
    removeText('#addNew');
    $j('.btn-group-vertical').removeClass().addClass('btn-group')

    $j('div').removeClass('tv-tools ');
    $j('.selected_records').remove();

    $j('hr').remove();

    //cambiar la clase de los botones de ver o de agregar en los select2
    $j('.view_parent').removeClass('btn-default hspacer-md btn-secondary').addClass('btn-tool');
    $j('.add_new_parent').removeClass('btn-success hspacer-md').addClass('btn-tool');
    //cambia la clase del boton para seleccionar la fecha
    $j('[id^="fd-but"]').removeClass('btn-default btn-block btn-secondary').addClass('btn-tool');

    setTimeout(() => {
        $expand_btn = $j('<button/>', { type: "button", class: "btn btn-tool", "data-card-widget": "maximize" }).append('<i class="fas fa-expand"></i>');
        $tools_bar = $j('<div/>', { class: "card-tools" }) //.append($admin_btn);
        $tools_bar.append($expand_btn);
        $j('.card-header.panel-heading').append($tools_bar);
        $admin_btn = $j('#admin-tools-menu-button').clone();
        //$admin_btn.children('button').clone(); //.addClass('btn-tool').removeClass('btn-danger btn-xs');
        $j('.page-header h1').append($admin_btn)
            //mover el header page al card header 
        $j('.card-header.panel-heading > h3').replaceWith($j('.page-header'));
    }, 700);

}

function removeText(selector) { //from buttons
    $j(selector).each(function() {
        //console.log(this);
        $o = $j(this);
        var i = $o.children('i');
        var t = $o.text();
        $o.html(i);
        if (!$o.attr('title')) {
            $o.attr('title', t);
        }
    });
}

function labelize_table() { //labelize tables when get small screens
    $j('div.table-responsive thead > tr > th').each(function(index, element) {
        text = $j(this).text();
        text = (text.length < 2 ? "" : text + ":&nbsp")
        if (text) {
            $j('div.table-responsive td:nth-of-type(' + (index + 1) + ')').prepend("<label class='d-lg-none'>" + text + "</label>")
        }
    });
}

function resolve_conflict() {
    //resuelve el conflicto entre bootstrap y prototypejs
    //http://www.softec.lu/site/DevelopersCorner/BootstrapPrototypeConflict
    //demo page
    //http://jsfiddle.net/dgervalle/hhBc6/

    jQuery.noConflict();
    if (Prototype.BrowserFeatures.ElementExtensions) {
        var disablePrototypeJS = function(method, pluginsToDisable) {
                var handler = function(event) {
                    event.target[method] = undefined;
                    setTimeout(function() {
                        delete event.target[method];
                    }, 0);
                };
                pluginsToDisable.each(function(plugin) {
                    jQuery(window).on(method + '.bs.' + plugin, handler);
                });
            },
            pluginsToDisable = ['collapse', 'dropdown', 'modal', 'tooltip', 'popover', 'tab'];
        disablePrototypeJS('show', pluginsToDisable);
        disablePrototypeJS('hide', pluginsToDisable);
    }
}

function addTabs(id = "new", tabs = []) {
    tabs.unshift({
        name: "home",
        title: id,
        icon: "fas fa-home",
        fields: []
    });

    var $tab_item = [];
    var $tab_pane = [];
    if (tabs) {
        tabs.forEach(e => {
            $tab_link = $j('<a/>', {
                class: "nav-link" + (e.name === 'home' ? ' active' : ''),
                "data-toggle": "tab",
                href: "#" + id + "-" + e.name,
                text: e.title
            }).prepend($j('<i/>', { class: "nav-tab-i " + e.icon }));

            $tab_item.push($j('<li/>', { class: "nav-item" }).append($tab_link));
            $tab_pane.push($j('<div/>', {
                id: id + "-" + e.name,
                class: "tab-pane fade" + (e.name === 'home' ? ' show active' : '')
            }).append(
                function() {
                    var content = $j('<div/>', { class: "content-" + e.name });
                    if (e.name === 'home') {
                        $j('fieldset .form-group').addClass('field-home');
                    } else if (e.fields) {
                        e.fields.forEach(field => {
                            $j('#' + field).closest('.form-group').removeClass('field-home').appendTo(content)
                        })
                    }
                    return content;
                }
            ));
        });
    }

    $tab = $j('<ul/>', {
        class: "nav nav-tabs nav-justified",
        role: "tablist"
    }).append($tab_item);

    $tab_content = $j("<div/>", {
        class: "tab-content"
    }).append($tab_pane);

    var $container = $j('<div/>', {
        id: id + "-container-tab",
        class: "col-12"
    }).append($tab, $tab_content);

    $fieldset = $j('fieldset');
    $fieldset.append($container);
    $j('.field-home').appendTo(".content-home");

};


/**
 * Construct a selectable drop down list with registered users.
 * @param {string} f - Field name to replace wit drop-down list.
 * @param {string} t - table name destiny.
 */
function users_dropdown(f, t) {
    var $selectField = $j('#' + f + '').hide();
    var $span = $j('<span/>', { id: 's2_users_' + f });
    $selectField.closest('div').append($span);
    var val = $selectField.val();

    $span.select2({
        width: '100%',
        formatNoMatches: function(term) { return 'No matches found!'; },
        minimumResultsForSearch: 5,
        loadMorePadding: 200,
        escapeMarkup: function(m) { return m; },
        ajax: {
            url: 'admin/getUsers.php',
            dataType: 'json',
            cache: true,
            data: function(term, page) { return { s: term, p: page, t: t }; },
            results: function(resp, page) { return resp; }
        }
    }).on('change', function(e) {
        $j('[name="' + f + '"]').val(e.added.id);
    });
    if (val) {
        $span.select2('data', { text: val, id: val });
    }
}