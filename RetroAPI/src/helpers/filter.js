const { logDebug, logInfo, logError } = require('./../helpers/logger');
const retroError = require('./../services/routes/errors/retroError');

/**
 * Construye el filtro para la búsqueda en la colección de 'emulators', teniendo en cuenta el idioma de la descripción
 * @param {Array} query El array con las opciones indicadas por el usuario
 * @returns El idioma especificado por el usuario (inglés si no se ha especificado ninguno); el filtro para la búsqueda
 */
const filterEmulators = (query) => {
    const { name, license, description, author, web, like, all, lang, ...rest } = query;
    const langFilter = lang ? lang : 'en';

    let emuFilter = new Object;
    let isLike = false;

    // Si el usuario añade 'like=1', significa que se buscarán los campos señalados que contengan la cadena indicada
    // Si no añade 'like=1', se buscarán las coincidencias exactaas
    // Con 'like', si busca 'Emulador' -> 'Emulador 1', 'Emulador 2', etc.
    // Sin 'like', si busca 'Emulador' -> solo si en el campo se almacena 'Emulador'
    if (like) isLike = like == '1' ? true : false;
    if (name) emuFilter.name = isLike ? { $regex: name, $options: 'i' } : name;
    if (license) emuFilter.license = isLike ? { $regex: license, $options: 'i' } : license;

    if (description) {
        Object.assign(emuFilter, isLike ? { 'description.content': { $regex: description, $options: 'i' } } : { 'description.content': description });
        Object.assign(emuFilter, { 'description.lang': langFilter });
    }

    if (author) emuFilter.author = isLike ? { $regex: author, $options: 'i' } : author;
    if (web) emuFilter.web = isLike ? { $regex: web, $options: 'i' } : web;

    // Si el usuario incluye 'all=1' (y solo 'all=1'), se mostrará toda la colección. Si añade algún parámetro más, error
    if (all) {
        if (all == '1' && Object.keys(emuFilter).length == 0) return {langFilter ,emuFilter : {} };
        else throw new retroError("Syntax error", 400);
    }

    // Si no hay ningún parámetro, o hay parámetros no válidos, error
    if (Object.keys(emuFilter).length == 0 || Object.keys(rest).length > 0) throw new retroError("Syntax error", 400);

    logDebug(JSON.stringify(emuFilter));

    return { langFilter, emuFilter };
}


/**
 * Construye el filtro para la búsqueda en la colección de 'games', teniendo en cuenta el idioma de la descripción
 * @param {Array} query El array con las opciones indicadas por el usuario
 * @returns El idioma especificado por el usuario (inglés si no se ha especificado ninguno); el filtro para la búsqueda
 */
 const filterGames = (query) => {
    const { name, studio, description, year, genre, image, like, all, lang, ...rest } = query;
    const langFilter = lang ? lang : 'en';

    let gameFilter = new Object;
    let isLike = false;

    // Si el usuario añade 'like=1', significa que se buscarán los campos señalados que contengan la cadena indicada
    // Si no añade 'like=1', se buscarán las coincidencias exactaas
    // Con 'like', si busca 'Emulador' -> 'Emulador 1', 'Emulador 2', etc.
    // Sin 'like', si busca 'Emulador' -> solo si en el campo se almacena 'Emulador'
    if (like) isLike = like == '1' ? true : false;
    if (name) gameFilter.name = isLike ? { $regex: name, $options: 'i' } : name;
    if (studio) gameFilter.studio = isLike ? { $regex: studio, $options: 'i' } : studio;

    if (description) {
        Object.assign(gameFilter, isLike ? { 'description.content': { $regex: description, $options: 'i' } } : { 'description.content': description });
        Object.assign(gameFilter, { 'description.lang': langFilter });
    }

    if (year) gameFilter.year = isLike ? { $regex: year, $options: 'i' } : year;
    if (genre) gameFilter.genre = isLike ? { $regex: genre, $options: 'i' } : genre;
    if (image) gameFilter.image = isLike ? { $regex: image, $options: 'i' } : image;

    // Si el usuario incluye 'all=1' (y solo 'all=1'), se mostrará toda la colección. Si añade algún parámetro más, error
    if (all) {
        if (all == '1' && Object.keys(gameFilter).length == 0) return {langFilter ,gameFilter : {} };
        else throw new retroError("Syntax error", 400);
    }

    // Si no hay ningún parámetro, o hay parámetros no válidos, error
    if (Object.keys(gameFilter).length == 0 || Object.keys(rest).length > 0) throw new retroError("Syntax error", 400);

    logDebug(JSON.stringify(gameFilter));

    return { langFilter, gameFilter };
}

module.exports = {
    filterEmulators,
    filterGames,
}