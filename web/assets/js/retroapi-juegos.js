let juegos;

const retroAjaxListaJuegos = () => {
    $.ajax({
        url: 'https://retroapi-daw.herokuapp.com/api/v1/games?all=1&lang=es',
        type: 'GET',
        dataType: 'json',
        success: function (json) {
            juegos = json.games;
            let lista = llenaListaSugerencias();

            $('#txtJuego').autocomplete({
                label: 'label',
                value: 'value',
                source: lista,
                onSelectItem: onSelectItem,
                treshold: 2,
                highlightClass: 'text-danger'
            });

            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);

            if (urlParams.has('name')) {
                muestraJuego(urlParams.get('name'));
            }
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
    $('#sb-anuncio').attr('hidden', true);
}

const muestraJuego = (nombreJuego) => {
    try {
        let salida = `<div class="nk-gap-2"></div>
                        <div class="row vertical-gap text-white">
                            <div class="nk-box-2 bg-dark-2">`

        let juego = juegos.find(element => element.name == nombreJuego);
        if (juego == undefined) {
            salida = `<div class="nk-info-box text-info">
                    <div class="nk-info-box-icon">
                        <i class="ion-information"></i>
                    </div>
                    <div class="nk-info-box-close nk-info-box-close-btn">
                        <i class="ion-close-round"></i>
                    </div>
                    <h3>No encontrado</h3>
                    <em>No se ha encontrado ningún juego con ese nombre.</em>
                </div>`;
            $('#mostrar').parent().removeClass('col-lg-8').addClass('col-lg-12');
            $('#sb-anuncio').attr('hidden', true);
        } else {
            salida += `<h3 class="text-main-1">${juego.name}</h3>`;

            if (juego.image.length > 0) {
                salida += '<div class="nk-post-img">';
                salida += `<img src="${juego.image[0]}" alt="${juego.name}">`
                salida += `</div>
                            <div class="nk-gap-2"></div>`;
            }

            if (juego.description.length > 0) salida += `<p class="text-white">${juego.description[0].content}</p>`;
            salida += `<p class="text-secondary">Estudio: <span class="text-white">${typeof juego.studio != 'undefined' ? juego.studio : ""}</span></p>`;
            salida += `<p class="text-secondary">Género: <span class="text-white">${typeof juego.genre != 'undefined' ? juego.genre : ""}</span></p>`;
            salida += `<p class="text-secondary">Año de lanzamiento: <span class="text-white">${typeof juego.year != 'undefined' ? juego.year : ""}</span></p>`;

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

    for (let gm of juegos) {
        datos.push(JSON.parse('{"label" : "' + gm.name + '",  "value" : ' + ++contador + '}'));
    }

    return datos;
}

const onSelectItem = (seleccion) => {
    muestraJuego(seleccion.label);
}

// =================== MAIN ===================

$('#btnBuscar').click(() => {
    muestraJuego($('#txtJuego').val());
});

retroAjaxListaJuegos();