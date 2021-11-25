const filter = (query) => {
    const {lang = "en", from = 0, limit = 25, name, license, description, author} = query;

    let filterString = "{";

    if (name != undefined) filterString += `"name":"${name}"`;

    filterString += "}";
    
    return JSON.parse(filterString);
}

module.exports = {
    filter,
}