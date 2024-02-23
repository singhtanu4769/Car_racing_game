(function () {
    angular
        .module('gameApp', [])
        .controller('GameController', GameController);

    GameController.$inject = ['$document', '$window', '$scope'];

    function GameController($document, $window, $scope) {
        const gameCtrl = this;
        const gameArea = $document[0].querySelector('.gameArea');
        const score = $document[0].querySelector('.score');
        const highScore = $document[0].querySelector('.highScore');

        gameCtrl.player = {
            speed: 5,
            score: 0,
            highScore: 0,
            isStart: false,
        };

        gameCtrl.keys = {};

        function Start() {
            gameArea.innerHTML = "";
            $document[0].querySelector('.startScreen').classList.add('hide');
            gameCtrl.player.isStart = true;
            gameCtrl.player.score = 0;
            window.requestAnimationFrame(Play);

            for (let i = 0; i < 5; i++) {
                let roadLines = document.createElement('div');
                roadLines.setAttribute('class', 'roadLines');
                roadLines.y = (i * 140);
                roadLines.style.top = roadLines.y + "px";
                gameArea.appendChild(roadLines);
            }

            for (let i = 0; i < 3; i++) {
                let Opponents = document.createElement('div');
                Opponents.setAttribute('class', 'Opponents');
                Opponents.y = ((i) * -300);
                Opponents.style.top = Opponents.y + "px";
                gameArea.appendChild(Opponents);
                Opponents.style.left = Math.floor(Math.random() * 350) + "px";
                Opponents.style.backgroundColor = randomColor();
            }

            let car = document.createElement('div');
            car.setAttribute('class', 'car');
            gameArea.appendChild(car);
            gameCtrl.player.x = car.offsetLeft;
            gameCtrl.player.y = car.offsetTop;
        }

        gameCtrl.Start = Start;

        function handleKeyDown(event) {
            gameCtrl.keys[event.key] = true;
        }

        function handleKeyUp(event) {
            gameCtrl.keys[event.key] = false;
        }

        function Play() {
            let car = document.querySelector('.car');
            let road = gameArea.getBoundingClientRect();

            if (gameCtrl.player.isStart) {
                moveLines();
                moveOpponents(car);

                if (gameCtrl.keys.ArrowUp && gameCtrl.player.y > (road.top + 70)) {
                    gameCtrl.player.y -= gameCtrl.player.speed;
                }
                if (gameCtrl.keys.ArrowDown && gameCtrl.player.y < (road.height - 75)) {
                    gameCtrl.player.y += gameCtrl.player.speed;
                }
                if (gameCtrl.keys.ArrowRight && gameCtrl.player.x < 350) {
                    gameCtrl.player.x += gameCtrl.player.speed;
                }
                if (gameCtrl.keys.ArrowLeft && gameCtrl.player.x > 0) {
                    gameCtrl.player.x -= gameCtrl.player.speed;
                }

                car.style.top = gameCtrl.player.y + "px";
                car.style.left = gameCtrl.player.x + "px";

                highScore.innerHTML = "HighScore" + ":" + (gameCtrl.player.highScore - 1);
                gameCtrl.player.score++;
                gameCtrl.player.speed += 0.01;

                if (gameCtrl.player.highScore < gameCtrl.player.score) {
                    gameCtrl.player.highScore++;
                    highScore.innerHTML = "HighScore" + ":" + (gameCtrl.player.highScore - 1);
                    highScore.style.top = "80px";
                }

                score.innerHTML = "Score" + ":" + (gameCtrl.player.score - 1);
                window.requestAnimationFrame(Play);
            }
        }

        function moveLines() {
            let roadLines = document.querySelectorAll('.roadLines');
            roadLines.forEach(function (item) {
                if (item.y >= 700)
                    item.y -= 700;
                item.y += gameCtrl.player.speed;
                item.style.top = item.y + "px";
            });
        }

        function moveOpponents(car) {
            let Opponents = document.querySelectorAll('.Opponents');
            Opponents.forEach(function (item) {
                if (isCollide(car, item)) {
                    endGame();
                }
                if (item.y >= 750) {
                    item.y -= 900;
                    item.style.left = Math.floor(Math.random() * 350) + "px";
                }
                item.y += gameCtrl.player.speed;
                item.style.top = item.y + "px";
                item.style.backgroundImage = "url('opponent car.png')";
            });
        }

        function isCollide(a, b) {
            aRect = a.getBoundingClientRect();
            bRect = b.getBoundingClientRect();
            return !((aRect.top > bRect.bottom) || (aRect.bottom < bRect.top) || (aRect.right < bRect.left) || (aRect.left > bRect.right));
        }

        function endGame() {
            gameCtrl.player.isStart = false;
            gameCtrl.player.speed = 5;
            $document[0].querySelector('.startScreen').classList.remove('hide');
        }

        function randomColor() {
            function c() {
                let hex = Math.floor(Math.random() * 256).toString(16);
                return ("0" + String(hex)).substr(-2);
            }
            return "#" + c() + c() + c();
        }

        $document[0].addEventListener('keydown', handleKeyDown.bind(gameCtrl));
        $document[0].addEventListener('keyup', handleKeyUp.bind(gameCtrl));

        $scope.gameCtrl = gameCtrl;
    }
})();
