/**
 * Render a deck
 */

let selected = new Set();

function click_card() {
    let card = "";
    let c = this.children;
    
    for(let i = 0 ; i < c.length ; i++) {
        if(c[i].className == "value") {
            card += c[i].innerHTML;
        } else {
            card += c[i].className;
        }
    }

    if (selected.has(card)) {
        selected.delete(card);
        this.className = "card";
    } else {
        selected.add(card);
        this.className = "card selected";
    }
    // console.log(selected);
};

function renderHand(hand) {
    document.getElementById("deck").innerHTML = "";

    hand.sort(function (c1, c2) {
        function cardToInt(card) {
            switch(card[0]) {
                case "1":
                    return 10;
                case "J":
                    return 11;
                case "Q":
                    return 12;
                case "K":
                    return 13;
                case "A":
                    return 14;
                case "2":
                    return 15;
                default:
                    return parseInt(card);
            }
        }
        return cardToInt(c1) - cardToInt(c2);
    });

    hand.forEach(card => {
        let card_div = document.createElement("div");
        let color_div = document.createElement("div");
        let value_div = document.createElement("div");
        let img = document.createElement("img");

        card_div.className = "card";
        if (card.length > 2) {
            img.src = "/public/images/" + card[2] + ".png";
            color_div.className = card[2];
        } else {
            img.src = "/public/images/" + card[1] + ".png";
            color_div.className = card[1];
        }
        color_div.appendChild(img);
        

        value_div.className = "value";
        if (card.length > 2) {
            value_div.innerHTML = card[0] + card[1];
        } else { 
            value_div.innerHTML = card[0];
        }
        card_div.appendChild(value_div);
        card_div.appendChild(color_div);
        card_div.onclick = click_card;

        document.getElementById("deck").appendChild(card_div);
    });
}


function renderChallengers(ennemies) {
    document.getElementById("challengers").innerHTML = "";
    ennemies.forEach(ennemy =>{
        let pseudo = ennemy[0];
        let nb_card = ennemy[1];

        let challenger_div = document.createElement("div");
        let back_div = document.createElement("div");
        let back_content_div = document.createElement("p");
        let name_div = document.createElement("div");
        
        challenger_div.className = "challenger";
        back_div.className = "back";
        name_div.className = "name";

        name_div.innerHTML = pseudo;
        back_content_div.innerHTML = nb_card;
        back_div.appendChild(back_content_div);

        challenger_div.appendChild(name_div);
        challenger_div.appendChild(back_div);

        document.getElementById("challengers").appendChild(challenger_div);
    });
}

function renderMiddle(middle, playF) {
    document.getElementById("middle").innerHTML = "";

    document.getElementById("middle").onclick = function () {
        playF(selected);
        selected.forEach(card => {
            selected.delete(card);
        });
    };

    middle.forEach(card => {
        let card_div = document.createElement("div");
        let color_div = document.createElement("div");
        let value_div = document.createElement("div");
        let img = document.createElement("img");

        img.src = "/public/images/" + card[1] + ".png";
        card_div.className = "card";
        color_div.className = card[1];
        color_div.appendChild(img);
        

        value_div.className = "value";
        value_div.innerHTML = card[0];
        card_div.appendChild(value_div);
        card_div.appendChild(color_div);
        document.getElementById("middle").appendChild(card_div);
    });
}

function renderHistoric(historic) {
    document.getElementById("historic").innerHTML = "";
    let table = document.createElement("table");
    let table_body = document.createElement("tbody");

    historic.forEach(turn => {
        let tr = document.createElement('tr');
        let td = document.createElement('td');

        let acc = turn[0];

        if (turn[1].length > 0) {
            acc += ": ";
            turn[1].forEach(card => {
                acc += card + " ";
            });
        } else {
            acc += " skipped his turn";
        }

        td.appendChild(document.createTextNode(acc));

        tr.appendChild(td);
        table_body.appendChild(tr);
    });

    table.appendChild(table_body);
    document.getElementById("historic").appendChild(table);
}

function renderGame(challengers, middle, hand, historic, playF) {
    renderChallengers(challengers);
    renderMiddle(middle, playF);
    renderHand(hand);
    renderHistoric(historic);
}