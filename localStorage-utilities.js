window.LocalStorageUtility = {};

LocalStorageUtility.storeItem = function (name,list) {
    var parsedItem = JSON.stringify(list);
    localStorage.setItem(name, parsedItem);
}

LocalStorageUtility.getList = function (name) {
    if (typeof localStorage[name] === "undefined"){
        return [];
    } else {
        return (JSON.parse(localStorage.getItem(name)));
    }
}