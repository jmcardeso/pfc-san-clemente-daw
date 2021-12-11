let dispositivos;

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
    $('#mostrar').parent().removeClass('col-lg-8').addClass('col-lg-12');
    $('#ficha').attr('hidden', false);
    $('#sb-juegos').attr('hidden', true);
    $('#sb-emuladores').attr('hidden', true);
}

const muestraEmulador = (nombreDispositivo) => {
    try {
        let salida = `<div class="nk-gap-2"></div>
                        <div class="row vertical-gap text-white">
                            <div class="nk-box-2 bg-dark-2">`

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
                    <em>No se ha encontrado ningún dispositivo con ese nombre.</em>
                </div>`;
            $('#mostrar').parent().removeClass('col-lg-8').addClass('col-lg-12');
            $('#sb-juegos').attr('hidden', true);
            $('#sb-emuladores').attr('hidden', true);
        } else {
            salida += `<h3 class="text-main-1">${dispositivo.name}</h3>`;

            if (dispositivo.image.length > 0) {
                salida += '<div class="nk-post-img">';
                salida += `<img src="${dispositivo.image[0]}" alt="${dispositivo.name}">`
                salida += `</div>
                            <div class="nk-gap-2"></div>`;
            }

            if (dispositivo.description.length > 0) salida += `<p class="text-white">${dispositivo.description[0].content}</p>`;
            salida += `<p class="text-secondary">Fabricante: <span class="text-white">${typeof dispositivo.manufacturer != 'undefined' ? dispositivo.manufacturer : ""}</span></p>`;
            salida += `<p class="text-secondary">Tipo: <span class="text-white">${typeof dispositivo.type != 'undefined' ? dispositivo.type : ""}</span></p>`;
            salida += `<p class="text-secondary">Año de lanzamiento: <span class="text-white">${typeof dispositivo.year != 'undefined' ? dispositivo.year : ""}</span></p>`;
            salida += `<p class="text-secondary">CPU: <span class="text-white">${typeof dispositivo.cpu != 'undefined' ? dispositivo.cpu : ""}</span></p>`;
            salida += `<p class="text-secondary">Memoria: <span class="text-white">${typeof dispositivo.memory != 'undefined' ? dispositivo.memory : ""}</span></p>`;

            if (dispositivo.gamepad != undefined) {
                salida += '<div class="col-sm-6 nk-post-img" style="padding-left: 0;">';
                salida += '<p class="text-secondary">Mando:</p>';
                salida += `<img src="${dispositivo.gamepad}" alt="${dispositivo.name}">`
                salida += `</div>
                            <div class="nk-gap-2"></div>`;
            }

            if (dispositivo.games.length > 0) {
                let salidaJuegos = "";

                let contador = 0;
                for (let juego of dispositivo.games) {
                    if (contador > 3) break;

                    salidaJuegos += `<div class="nk-widget-post">`;

                    if (juego.image.length > 0) {
                        salidaJuegos += `<div class="nk-post-image">
                               <img src="${juego.image[0]}" alt="${juego.name}">
                            </div>`;
                    }
                    salidaJuegos += `<h3 class="nk-post-title">${juego.name}</h3>`;
                    if (juego.year > 0) {
                        salidaJuegos += `<p>${juego.year}</p>`;
                    }
                    if (juego.genre.length > 0) {
                        salidaJuegos += `<div class="nk-post-categories">
                                            <span class="bg-main-1">${juego.genre}</span>
                                         </div>`
                    }
                    salidaJuegos += `                    </div>`;
                    contador++;
                }
                $('#juegos').html(salidaJuegos);
                $('#sb-juegos').attr('hidden', false);
            }

            if (dispositivo.emulators.length > 0) {
                let salidaEmuladores = "";

                let contador = 0;
                for (let emulador of dispositivo.emulators) { 
                    if (contador > 3) break;

                    salidaEmuladores += `<h4 class="nk-post-title">${emulador.name}</h4>`;
                    if (emulador.web != undefined) {
                        salidaEmuladores += `<p><a href="${emulador.web}">${emulador.web}</a></p>`;
                    }
                    contador++;
                }
                $('#emuladores').html(salidaEmuladores);
                $('#sb-emuladores').attr('hidden', false);
            }

            salida += `
                <p class="text-secondary"><small>Fuente: Wikipedia</small></p>
            </div>`;
            $('#mostrar').parent().removeClass('col-lg-12').addClass('col-lg-8');
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