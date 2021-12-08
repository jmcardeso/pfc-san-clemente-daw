const crearPeticionDispositivo = () => {
    if ($('#txtNombre').val() != "") {
        let url = 'devices?name=' + $('#txtNombre').val();
        retroAjax(url);
    } else alert("No hay nombre");  
}

const retroAjax = (filtro) => {
    $.ajax({
        url: 'https://retroapi-daw.herokuapp.com/api/v1/' + filtro,
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            muestraEmulador(json);
        },
        error: function (jqXHR, status, error) {
            muestraError( jqXHR.status + ' - ' + jqXHR.responseText);
        }
    });
}

const muestraError = (error) => {
    
}

const muestraEmulador = (json) => {
    let salida = '<div class="nk-gap-2"></div><div class="row vertical-gap text-white"><div class="col-lg-12"><div class="nk-box-2 bg-dark-2"><h4>Resultado</h4>';
    for (let device of json.devices) {
        salida += JSON.stringify(device) + '</div></div>';
    }
    $('#mostrar').html(salida);
}

document.getElementById("buscar-dispositivo").addEventListener("click", crearPeticionDispositivo);
