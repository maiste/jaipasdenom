function createLobby() {
    var dt = new Date().getTime();
    const id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    
    window.sessionStorage.host = id;

    const url = window.location.href+ 'lobby/' + id;
    window.location.href = url;
    window.location.replace(url);
}