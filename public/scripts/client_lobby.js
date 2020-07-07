/**
 * Handle the client-side for the lobby.
 */
function fetchPlayers(socket, uuid) {
    socket.emit('fetch players', uuid);
}

function joinLobby(socket, uuid, pseudo) {
    const msg = uuid + ';' + pseudo;
    socket.emit('join lobby', msg)
}

function isHost(uuid) {
    const x = window.sessionStorage.host;
    if (x) {
        return x === uuid;
    }
    return false;
}