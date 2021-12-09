const crearPeticionDispositivo = () => {
    if ($('#txtNombre').val() != "") {
        let url = 'devices?name=' + $('#txtNombre').val();
        retroAjax(url);
    } else alert("No hay nombre");
}

const retroAjaxListaDispositivos = () => {
    $.ajax({
        url: 'https://retroapi-daw.herokuapp.com/api/v1/devices?all=1&lang=es',
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            let lista = llenaListaSugerencias(json.devices);

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
            muestraError(jqXHR.status + ' - ' + jqXHR.responseText);
        }
    });
}

const retroAjax = (nombreDispositivo) => {
    $.ajax({
        url: 'https://retroapi-daw.herokuapp.com/api/v1/devices?name=' + nombreDispositivo,
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            muestraEmulador(json.devices, nombreDispositivo);
        },
        error: function (jqXHR, status, error) {
            muestraError(jqXHR.status + ' - ' + jqXHR.responseText);
        }
    });
}

const muestraError = (error) => {

}

const muestraEmulador = (dispositivos, nombreDispositivo) => {

    let salida = '<div class="nk-gap-2"></div><div class="row vertical-gap text-white"><div class="col-lg-12"><div class="nk-box-2 bg-dark-2"><h4>Resultado</h4>';
    let dispositivo = dispositivos.find(element => element.name = nombreDispositivo);

    salida += JSON.stringify(dispositivo) + '</div></div>';

    $('#mostrar').html(salida);
}

const llenaListaSugerencias = (devices) => {
    let datos = new Array();
    let contador = 0;

    for (let device of devices) {
        datos.push(JSON.parse('{"label" : "' + device.name + '",  "value" : ' + ++contador + '}'));
    }

    return datos;
}

const onSelectItem = (seleccion) => {
    retroAjax(seleccion.label);
}

retroAjaxListaDispositivos();