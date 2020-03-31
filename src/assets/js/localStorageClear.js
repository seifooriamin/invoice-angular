window.onbeforeunload = function(e) {
    let date = Date.now();

    localStorage.setItem("lastactivity", date);
};
window.onload = function() {

    let date1 = localStorage.getItem('lastactivity');
    let date2 = Date.now();
    if (date1 !== undefined) {
        let difference = date2 - date1;
        let diff = ((difference) / 1000).toFixed(0);
        if (diff > 300) {
            localStorage.clear();
            location.reload();
        }
    }
};
