const { logDebug, logInfo, logError } = require('./../helpers/logger');

const filterEmulators = (query) => {
    const { lang = "en", name, license, description, author, web, like } = query;

    let filterObject = new Object;
    let isLike;

    if (like) isLike = like == '1' ? true : false;
    if (name) filterObject.name = isLike ? { $regex: name, $options: 'i' } : name;
    if (license) filterObject.license = isLike ? { $regex: license, $options: 'i' } : license;
    if (description) {
        let desc = isLike ? { 'description.content': { $regex: description, $options: 'i' } } : { 'description.content': description };
        Object.assign(filterObject, desc);
    }
    if (author) filterObject.author = isLike ? { $regex: author, $options: 'i' } : author;
    if (web) filterObject.web = isLike ? { $regex: web, $options: 'i' } : web;

    logDebug(JSON.stringify(filterObject));

    return filterObject;
}

module.exports = {
    filterEmulators,
}