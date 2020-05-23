/**
 * Render the pre-game lobby.
 */


function createTitle(text, to) {
    let title = document.createElement("div");
    title.id = "title";
    title.innerHTML = text;
    document.getElementById(to).appendChild(title);
}
function renderPlayers(players) {
    document.getElementById("players").innerHTML = "";

    createTitle("Players", "players");

    let lobbyPlayers = document.createElement("div");
    lobbyPlayers.id = "lobbyPlayers";
    document.getElementById("players").appendChild(lobbyPlayers);

    let ul = document.createElement('ul');

    players.forEach(function(player, index, _) {
        let player_div = document.createElement("li");
        player_div.id = "player" + index;
        player_div.innerHTML = player;
        ul.appendChild(player_div);
    });

    document.getElementById("lobbyPlayers").appendChild(ul);

}

function renderLink(link) {
    document.getElementById("shareLink").innerHTML = "";
    createTitle("Link to the lobby:", "shareLink");
    
    let link_div = document.createElement("div");
    link_div.id = "link";
    link_div.innerHTML = link;

    
    let copy = document.createElement("button");
    copy.id = "copy";
    copy.innerHTML = "Copy the link";
    
    document.getElementById("shareLink").appendChild(link_div);
    document.getElementById("shareLink").appendChild(copy);

    document.querySelector("#copy").addEventListener("click", function(){
        let link_tmp = document.createElement('textarea');
        link_tmp.value = link;
        document.body.appendChild(link_tmp);
        link_tmp.select();
        document.execCommand("copy");
        document.body.removeChild(link_tmp);
    });

}

function renderStart(players, link) {
    document.getElementById("startGame").innerHTML = "";
    let start = document.createElement("button");
    start.id = "start";
    start.innerHTML = "Start the game";

    document.getElementById("startGame").appendChild(start);

    document.querySelector('#game').addEventListener("click", function (){
        // TODO: Start the game
    });
}

function renderLobby(players, link) {
    renderPlayers(players);
    renderLink(link);
    renderStart(players, link);
}