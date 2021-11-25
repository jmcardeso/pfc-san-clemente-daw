const filter = (query) => {
    const {lang = "en", from = 0, limit = 25, name, license, description, author} = query;

    let filterObject = new Object;

    if (name) filterObject.name = name;
    if (license) filterObject.license = license;
    if (description) filterObject.description = {lang : lang, content : description };
    if (author) filterObject.author = author;

    return filterObject;
}

module.exports = {
    filter,
}