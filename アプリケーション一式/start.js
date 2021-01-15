'use strict'

let start = function () { // ブラウザにコンテンツがロードされたときに1度だけ呼ばれる関数
    document.getElementById("state").innerHTML = `【Suvive】`;
    document.getElementById("inform").style.display = "none";
    document.getElementById("sub-inform").style.display = "none";

    clearInterval(updateVal);
    clearInterval(countupVal);
    clearInterval(judgeVal);

    mainCanvas = new MainCanvas();
    subCanvas = new SubCanvas();

    player = new Player();
    healer = new Healer();

    count = 25;
    player.risk = 0;
    player.mental = 20;

    updateVal = setInterval(update, 10);
    countupVal = setInterval(countup, 1000);
    judgeVal = setInterval(judge, 100);

    for (let i = 0; i < enemy.length; i++) {
        enemy[i] = new Enemy();
    }

    document.body.appendChild(player.image);
    document.body.appendChild(healer.image);

    for (let i = 0; i < enemy.length; i++) {
        document.body.appendChild(enemy[i].image);
    }

    // マウスが移動したときに MouseMove 関数が呼ばれるようにイベントリスナを設定
    if (document.addEventListener) {
        document.addEventListener("mousemove", MouseMove);
    } else if (document.attachEvent) {
        document.attachEvent("onmousemove", MouseMove);
    }
}

let record = function () {
    document.getElementById("record-list").innerHTML += `<li>【${state}】<br>risk:${player.risk}, mental:${player.mental}</li>`;
}