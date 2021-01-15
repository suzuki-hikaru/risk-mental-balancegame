'use strict'

let countupVal, updateVal, judgeVal;
let count = 25;
let state;

// useimage
const playerpicto = "./images/humanpicto.png"
const enemypicto = "./images/enemypicto.png"
const healerpicto = "./images/healerpicto.png"

let countup = function () {
    count--;
    player.mental--;
    document.getElementById("timer").innerHTML = `timer:${count}/25`;
    console.log(count)
    document.getElementById("mental").innerHTML = `mental:${player.mental}`;
    console.log("test" + player.mental)

}

let Human = function () { // Human のコンストラクタ関数
    this.image = new Image();
    this.image.style.position = "fixed";
}

let Player = function () { // Player のコンストラクタ関数
    Human.apply(this, arguments);
    this.x = document.getElementById("main-canvas").getBoundingClientRect().left;
    this.y = document.getElementById("main-canvas").getBoundingClientRect().top;
    this.image.src = playerpicto;
    this.mental = 20;

    this.risk = 0;
}

let Healer = function () { // Healn のコンストラクタ関数
    this.image = new Image();
    this.image.style.position = "fixed";
    this.x = Math.floor(Math.random() * (subCanvas.getendx() - subCanvas.getendx() + 1) + subCanvas.getx());
    this.y = Math.floor(Math.random() * (subCanvas.getendy() - subCanvas.getendy() + 1) + subCanvas.gety());
    this.dx = Math.floor(Math.random() * 11) - 5;
    this.dy = Math.floor(Math.random() * 11) - 5;
    this.image.src = healerpicto;
}

let MainCanvas = function () {
    this.target = document.getElementById("main-canvas")
    this.x = this.target.getBoundingClientRect().left;
    this.y = this.target.getBoundingClientRect().top;
    this.endx = this.target.getBoundingClientRect().left + 550;
    this.endy = this.target.getBoundingClientRect().top + 200;

    console.log("main" + this.y)

    this.getx = function () {
        return this.x;
    }

    this.gety = function () {
        return this.y;
    }

    this.getendx = function () {
        return this.endx;
    }

    this.getendy = function () {
        return this.endy;
    }
}

let SubCanvas = function () {
    MainCanvas.apply(this, arguments);
    this.target = document.getElementById("sub-canvas")
    this.x = this.target.getBoundingClientRect().left;
    this.y = this.target.getBoundingClientRect().top;
    this.endx = this.target.getBoundingClientRect().left + 550;
    this.endy = this.target.getBoundingClientRect().top + 165;

    console.log("sub" + this.y)
}

let Enemy = function () { // Enemy のコンストラクタ関数
    Human.apply(this, arguments);
    this.x = Math.floor(Math.random() * (mainCanvas.getendx() - mainCanvas.getendx() + 1) + mainCanvas.getx());
    this.y = Math.floor(Math.random() * (mainCanvas.getendy() - mainCanvas.getendy() + 1) + mainCanvas.gety());

    this.dx = Math.floor(Math.random() * 11) - 5;
    this.dy = Math.floor(Math.random() * 11) - 5;
    this.image.src = enemypicto;
}

Player.prototype = new Human;
Enemy.prototype = new Human;
Healer.prototype = new Human;

Player.prototype.subrisk = function () {
    this.risk = this.risk - 1;
}

Player.prototype.addrisk = function () {
    this.risk = this.risk + 1;
}

Player.prototype.getrisk = function () {
    return this.risk;
}

Enemy.prototype.update = function () {
    this.x = this.x + this.dx;
    this.y = this.y + this.dy;

    if (this.x < mainCanvas.getx() || this.x > mainCanvas.getendx() - this.image.width) {
        this.x = this.x - this.dx;
        this.dx *= -1;
    }
    if (this.y < mainCanvas.gety() || this.y > mainCanvas.getendy() - this.image.height) {
        this.y = this.y - this.dy;
        this.dy *= -1;
    }
    this.image.style.left = this.x + "px";
    this.image.style.top = this.y + "px";

}

Healer.prototype.update = function () {
    this.x = this.x + this.dx;
    this.y = this.y + this.dy;

    if (this.x < subCanvas.getx() || this.x > subCanvas.getendx() - this.image.width) {
        this.x = this.x - this.dx;
        this.dx *= -1;
    }

    if (this.y < subCanvas.gety() || this.y > subCanvas.getendy() - this.image.height) {
        this.y = this.y - this.dy;
        this.dy *= -1;
    }

    this.image.style.left = this.x + "px";
    this.image.style.top = this.y + "px";

}

let mainCanvas;
let subCanvas;
let player;
let healer;
let enemy = new Array(2);

function MouseMove(e) {
    let mouseX = (e.clientX - player.image.width / 2);
    let mouseY = (e.clientY - player.image.height / 2)
    if (mainCanvas.getendx < mouseX) {
        mouseX = mainCanvas.getendx() - player.image.width / 2;
    }
    if (mainCanvas.getendy < mouseY) {
        mouseX = mainCanvas.getendy() - player.image.height / 2;
    }
    player.x = mouseX;
    player.y = mouseY;
    player.image.style.left = player.x + "px";
    player.image.style.top = player.y + "px";
}

let update = function () { // アップデート
    for (let i = 0; i < enemy.length; i++) {
        enemy[i].update();
    }

    healer.update();

    if (player.risk < 0) {
        player.risk = 0;
    }

    if (player.getrisk() >= 10) {
        state = "感染リスク超過";
        gameover();
    }
    if (player.mental == 0) {
        state = "ストレス超過";
        gameover();
    }
    if (count == 0) {
        state = "タイムアップ";
        gameover();
    }
}

let judge = function () {
    for (let i = 0; i < enemy.length; i++) {
        if ((Math.abs(player.x - enemy[i].x) < player.image.width) && (Math.abs(player.y - enemy[i].y) < player.image.height)) {
            player.addrisk();
            document.getElementById("risk").innerHTML = `risk:${player.risk}`;

            player.mental++;
            document.getElementById("mental").innerHTML = `mental:${player.mental}`;

        }
    }

    if ((Math.abs(player.x - healer.x) < player.image.width) && (Math.abs(player.y - healer.y) < player.image.height)) {
        player.subrisk();
        document.getElementById("risk").innerHTML = `risk:${player.risk}`;

        player.mental--;
        document.getElementById("mental").innerHTML = `mental:${player.mental}`;

    }
}

function gameover() {
    for (let i = 0; i < enemy.length; i++) {
        enemy[i].image.style.display = "none";
    }

    healer.image.style.display = "none";
    player.image.style.display = "none";

    document.getElementById("inform").style.display = "block";
    document.getElementById("sub-inform").style.display = "block";

    clearInterval(judgeVal);
    clearInterval(updateVal); // 関数updateを一定時間ごとに呼び出していたのを止める．
    clearInterval(countupVal); // 関数countupを一定時間ごとに呼び出していたのを止める．

    document.getElementById("state").innerHTML = `【GameOver!!】`;
    document.getElementById("inform").innerHTML = `${state}`;
    document.getElementById("inform").innerHTML = `【ゲーム終了】`;
    document.getElementById("sub-inform").innerHTML = `${state}`;

}
