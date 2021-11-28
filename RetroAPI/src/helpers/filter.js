const filterEmulators = (query) => {
    const { lang = "en", from = 0, limit = 25, name, license, description, author, web, like } = query;

    let filterObject = new Object;
    let isLike;

    if (like) isLike = like == '1' ? true : false;
    if (name) filterObject.name = isLike ? { $regex: name, $options: 'i' } : name;
    if (license) filterObject.license = isLike ? { $regex: license, $options: 'i' } : license;
    if (description) filterObject.description = { lang: lang, content: isLike ? { $regex: description, $options: 'i' } : description };
    if (author) filterObject.author = isLike ? { $regex: author, $options: 'i' } : author;
    if (web) filterObject.web = isLike ? { $regex: web, $options: 'i' } : web;

    return filterObject;
}

module.exports = {
    filterEmulators,
}