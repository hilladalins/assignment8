window.DateUtilities = {};

DateUtilities.arrangeDate = function(date){
    var year = date.slice(0,4);
    var month = date.slice(5,7);
    var day = date.slice(8,10);
    return `${day}/${month}/${year}`
}

DateUtilities.convertToBasicFormat = function(date){
    var year = date.slice(6,10);
    var month = date.slice(3,5);
    var day = date.slice(0,2);
    return `${year}-${month}-${day}`
}

DateUtilities.setReminder = function(number,units,text){
    var miliSeconds = null;
    if (units === "minutes"){
        miliSeconds = number*60*1000;
    } else {
        miliSeconds = number*60*60*1000;
    }
    setTimeout(function(){
        alert(text);
    }, miliSeconds);
}