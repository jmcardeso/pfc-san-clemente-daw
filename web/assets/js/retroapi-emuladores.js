let emuladores;

const retroAjaxListaEmuladores = () => {
    $.ajax({
        url: 'https://retroapi-daw.herokuapp.com/api/v1/emulators?all=1&lang=es',
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            emuladores = json.emulators;
            let lista = llenaListaSugerencias();

            $('#txtEmulador').autocomplete({
                label: 'label',
                value: 'value',
                source: lista,
                onSelectItem: onSelectItem,
                treshold: 2,
                highlightClass: 'text-danger'
            });
        },
        error: function (jqXHR, status, error) {
            let salida = "";
            if (jqXHR.responseText != undefined) salida = jqXHR.status + ' - ' + jqXHR.responseJSON.msg;
            else salida = 'Se ha producido un error.';
            muestraError(salida);
        }
    });
}

const muestraError = (error) => {
    let salida = `<div class="nk-info-box text-danger">
                    <div class="nk-info-box-icon">
                        <i class="ion-close-round"></i>
                    </div>
                    <div class="nk-info-box-close nk-info-box-close-btn">
                        <i class="ion-close-round"></i>
                    </div>
                    <h3>Error</h3>
                    <em>${error}</em>
                </div>`;
    $('#mostrar').html(salida);
    $('#mostrar').parent().removeClass('col-lg-8').addClass('col-lg-12');
    $('#ficha').attr('hidden', false);
    $('#sb-anuncio').attr('hidden', true);}

const muestraEmulador = (nombreEmulador) => {
    try {
        let salida = `<div class="nk-gap-2"></div>
                        <div class="row vertical-gap text-white">
                            <div class="nk-box-2 bg-dark-2">`

        let emulador = emuladores.find(element => element.name == nombreEmulador);
        if (emulador == undefined) {
            salida = `<div class="nk-info-box text-info">
                    <div class="nk-info-box-icon">
                        <i class="ion-information"></i>
                    </div>
                    <div class="nk-info-box-close nk-info-box-close-btn">
                        <i class="ion-close-round"></i>
                    </div>
                    <h3>No encontrado</h3>
                    <em>No se ha encontrado ningún emulador con ese nombre.</em>
                </div>`;
            $('#mostrar').parent().removeClass('col-lg-8').addClass('col-lg-12');
            $('#sb-anuncio').attr('hidden', true);
        } else {
            salida += `<h3 class="text-main-1">${emulador.name}</h3>`;

            if (emulador.description.length > 0) salida += `<p class="text-white">${emulador.description[0].content}</p>`;
            salida += `<p class="text-secondary">Autor: <span class="text-white">${typeof emulador.author != 'undefined' ? emulador.author : ""}</span></p>`;
            salida += `<p class="text-secondary">Licencia: <span class="text-white">${typeof emulador.license != 'undefined' ? emulador.license : ""}</span></p>`;
            salida += `<p class="text-secondary">Web: <a class="text-white" href="${typeof emulador.web != 'undefined' ? emulador.web : "#"}">${typeof emulador.web != 'undefined' ? emulador.web : ""}</a></p>`;
            salida += `
                <p class="text-secondary"><small>Fuente: Wikipedia</small></p>
            </div>`;
            
            $('#mostrar').parent().removeClass('col-lg-12').addClass('col-lg-8');
            $('#sb-anuncio').attr('hidden', false);
        }

        $('#mostrar').html(salida);
        $('#ficha').attr('hidden', false);
    } catch (error) {
        muestraError("Se ha producido un error.");
    }
}

const llenaListaSugerencias = () => {
    let datos = new Array();
    let contador = 0;

    for (let emu of emuladores) {
        datos.push(JSON.parse('{"label" : "' + emu.name + '",  "value" : ' + ++contador + '}'));
    }

    return datos;
}

const onSelectItem = (seleccion) => {
    muestraEmulador(seleccion.label);
}

// =================== MAIN ===================

$('#btnBuscar').click(() => {
    muestraEmulador($('#txtEmulador').val());
});

retroAjaxListaEmuladores();