/**
 * Handle the client-side for the lobby.
 */
function fetchPlayers(socket, uuid) {
    socket.emit('fetch players', uuid);
}