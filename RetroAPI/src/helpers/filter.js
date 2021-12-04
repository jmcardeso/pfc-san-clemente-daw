const { logDebug, logInfo, logError } = require('./../helpers/logger');
const retroError = require('./../services/routes/errors/retroError');

const filterEmulators = (query) => {
    const { name, license, description, author, web, like, all, lang, ...rest } = query;
    const langFilter = lang ? lang : 'en';

    let emuFilter = new Object;
    let isLike = false;

    if (like) isLike = like == '1' ? true : false;
    if (name) emuFilter.name = isLike ? { $regex: name, $options: 'i' } : name;
    if (license) emuFilter.license = isLike ? { $regex: license, $options: 'i' } : license;

    if (description) {
        Object.assign(emuFilter, isLike ? { 'description.content': { $regex: description, $options: 'i' } } : { 'description.content': description });
        Object.assign(emuFilter, { 'description.lang': langFilter });
    }

    if (author) emuFilter.author = isLike ? { $regex: author, $options: 'i' } : author;
    if (web) emuFilter.web = isLike ? { $regex: web, $options: 'i' } : web;

    if (all) {
        if (all == '1' && Object.keys(emuFilter).length == 0) return {langFilter ,emuFilter : {} };
        else throw new retroError("Syntax error", 400);
    }

    if (Object.keys(emuFilter).length == 0 || Object.keys(rest).length > 0) throw new retroError("Syntax error", 400);

    logDebug(JSON.stringify(emuFilter));

    return { langFilter, emuFilter };
}

module.exports = {
    filterEmulators,
}