let dispositivos;

const crearPeticionDispositivo = () => {
    if ($('#txtNombre').val() != "") {
        let url = 'disp?name=' + $('#txtNombre').val();
        retroAjax(url);
    } else alert("No hay nombre");
}

const retroAjaxListaDispositivos = () => {
    $.ajax({
        url: 'https://retroapi-daw.herokuapp.com/api/v1/devices?all=1&lang=es',
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            dispositivos = json.devices;
            let lista = llenaListaSugerencias();

            $('#txtNombre').autocomplete({
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
}

const muestraEmulador = (nombreDispositivo) => {
    try {
        let salida = '<div class="nk-gap-2"></div><div class="row vertical-gap text-white"><div class="col-lg-12"><div class="nk-box-2 bg-dark-2"><h4>Resultado</h4>';
        let dispositivo = dispositivos.find(element => element.name == nombreDispositivo);
        if (dispositivo == undefined) {
            salida = `<div class="nk-info-box text-info">
                    <div class="nk-info-box-icon">
                        <i class="ion-information"></i>
                    </div>
                    <div class="nk-info-box-close nk-info-box-close-btn">
                        <i class="ion-close-round"></i>
                    </div>
                    <h3>No encontrado</h3>
                    <em>No se ha encontrado ningúnn dispositivo con ese nombre.</em>
                </div>`;
        } else salida += JSON.stringify(dispositivo) + '</div></div>';

        $('#mostrar').html(salida);
    } catch (error) {
        muestraError("Se ha producido un error.");
    }
}

const llenaListaSugerencias = () => {
    let datos = new Array();
    let contador = 0;

    for (let device of dispositivos) {
        datos.push(JSON.parse('{"label" : "' + device.name + '",  "value" : ' + ++contador + '}'));
    }

    return datos;
}

const onSelectItem = (seleccion) => {
    muestraEmulador(seleccion.label);
}

// =================== MAIN ===================

$('#btnBuscar').click(() => {
    muestraEmulador($('#txtNombre').val());
});

retroAjaxListaDispositivos();