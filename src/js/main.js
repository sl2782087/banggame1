$(function () {
    $("body>a").hide();


    var _width = window.screen.availWidth;
    var _height = window.screen.availHeight;
    // var _width = document.documentElement.clientWidth;
    // var _height = document.documentElement.clientHeight;
    var unit = 1080 / _width;
    var game = new Phaser.Game(_width, _height, Phaser.AUTO, 'game-box');
    game.States = {};
    var runArr = ['run_00', 'run_01', 'run_02', 'run_03', 'run_04', 'run_05', 'run_06', 'run_07', 'run_08', 'run_09', 'run_10', 'run_11', 'run_12', 'run_13', 'run_14', 'run_15'];
    var getArr = ['get_00', 'get_01', 'get_02', 'get_03', 'get_04', 'get_05', 'get_06', 'get_07', 'get_08', 'get_09', 'get_10', 'get_11', 'get_12', 'get_13', 'get_14', 'get_15', 'get_16', 'get_17', 'get_18', 'get_19'];
    var loseArr = ['lose_00', 'lose_01', 'lose_02', 'lose_03', 'lose_04', 'lose_05', 'lose_06', 'lose_07', 'lose_08', 'lose_09', 'lose_10', 'lose_11', 'lose_12', 'lose_13', 'lose_14', 'lose_15', 'lose_16', 'lose_17', 'lose_18', 'lose_19', 'lose_20', 'lose_21', 'lose_22', 'lose_23', 'lose_24', 'lose_25', 'lose_26', 'lose_27', 'lose_28', 'lose_29', 'lose_30', 'lose_31', 'lose_32', 'lose_33', 'lose_34', 'lose_35', 'lose_36'];

// 天降之物
    function Drop(config) {
        this.init = function () {
            this.drops = game.add.group();
            this.drops.enableBody = true;
            this.drops.scale.set(1 / unit);
            this.drops.createMultiple(config.makeCount, config.selfPic);
            this.drops.setAll('body.width', 100 / unit);
            this.drops.setAll('body.height', 100 / unit);
            this.drops.setAll('outOfBoundsKill', true);
            this.drops.setAll('checkWorldBounds', true);

            this.maxWidth = (game.width - 115 / unit) * unit;
            game.time.events.loop(Phaser.Timer.SECOND * config.selfTimeInterval, this.generateDrop, this);
        };
        this.generateDrop = function () {
            var e = this.drops.getFirstExists(false);
            if (e) {
                e.reset(game.rnd.integerInRange(0, this.maxWidth), -game.cache.getImage(config.selfPic).height);
                e.body.velocity.y = config.velocity;
                e.body.acceleration.y = config.acceleration;
            }
        };
    }

// 游戏初始化场景
    game.States.bootState = function () {
        this.init = function () {
            game.scale.pagesAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
            game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            game.musicPause = false;
        };
        this.preload = function () {
            game.load.image('loadbg', '/src/images/loadbg.jpg');
            game.load.image('loadword', '/src/images/loadword.png');
            game.load.image('progress', '/src/images/progress.png');
            game.load.image('progressBar', '/src/images/progressBar.png');
        };
        this.create = function () {
            game.state.start('loader');
        };
    };
//游戏加载场景
    game.States.loaderState = function () {
        this.init = function () {
            this.bg = game.add.sprite(0, 0, 'loadbg');
            this.bg.width = _width;
            this.bg.height = _height;
        };
        this.preload = function () {
            //进度条
            this.progress = game.add.sprite(_width / 2, 587 / unit, 'progress');
            this.progress.anchor.set(0.5, 0);
            this.progress.width = 892 / unit;
            this.progress.height = 278 / unit;
            this.progressBar = game.add.sprite(109 / unit, 794 / unit, 'progressBar');
            this.progressBar.anchor.set(0, 0);
            this.progressBar.width = 0 / unit;
            this.progressBar.height = 60 / unit;
            var tween = game.add.tween(this.progressBar);
            this.loadword = game.add.sprite(_width / 2, 804 / unit, 'loadword');
            this.loadword.anchor.set(0.5, 0);
            this.loadword.width = 193 / unit;
            this.loadword.height = 40 / unit;


            game.load.spritesheet('voice', '/src/images/voice.png', 105, 105, 2);
            // game.load.spritesheet('getchange','/src/images/getchange.png',112,200,20);
            game.load.atlas('allbang', '/src/images/bangAll.png', '/src/images/bangAll.json');
            game.load.image('ground', '/src/images/ground.jpg');
            game.load.image('title', '/src/images/title.png');
            game.load.image('startBtn', '/src/images/startBtn.png');
            game.load.image('help', '/src/images/help.png');
            game.load.image('popup', '/src/images/popup.png');
            game.load.image('comb', '/src/images/comb.png');
            game.load.image('boom', '/src/images/boom.png');
            game.load.image('scorebox', '/src/images/scorebox.png');
            game.load.image('score', '/src/images/score.png');
            game.load.audio('bgm', '/src/audio/bgm.mp3', true);
            game.load.audio('boom', '/src/audio/boom.mp3', true);
            game.load.audio('click', '/src/audio/button.mp3', true);
            game.load.audio('get', '/src/audio/get.mp3', true);
            game.load.audio('lose', '/src/audio/lose.mp3', true);

            game.load.onLoadComplete.add(function () {
                game.sound.setDecodedCallback(['bgm', 'boom', 'click', 'get', 'lose'], function () {
                    tween.to({width: 861 / unit}, 800, null, true);
                    setTimeout(function () {
                        game.state.start('main');
                    }, 1500);
                }, this);
            });
        }
    };
    game.States.mainState = function () {
        this.create = function () {
            this.bgmControl = function () {
                game.musicPause ? (game.musicPause = false, this.voiceBtn.frame = 0, this.bgm.play()) : (game.musicPause = true, this.voiceBtn.frame = 1, this.bgm.stop());
            };
            this.startGame = function () {
                this.clickbgm = game.add.audio('click', 0.5, false);
                this.clickbgm.play();
                setTimeout(function () {
                    game.state.start('game');
                }, 1000);
            };
            this.closeHelp = function () {
                this.helpPopup.visible = false;
            };
            this.showHelp = function () {
                this.helpPopup.visible = true;
            };
            // 背景
            this.bg = game.add.sprite(0, 0, 'loadbg');
            this.bg.width = _width;
            this.bg.height = _height;
            // 地面
            this.ground = game.add.sprite(0, game.height, 'ground');
            this.ground.anchor.set(0, 1);
            this.ground.width = game.width;
            this.ground.height = 195 / unit;
            // 标题
            var title = game.add.image(36 / unit, 211 / unit, 'title');
            title.width = 1020 / unit;
            title.height = 523 / unit;
            // 开始游戏
            this.startGame = game.add.button(393 / unit, 846 / unit, 'startBtn', this.startGame, this);
            this.startGame.width = 309 / unit;
            this.startGame.height = 311 / unit;
            // 音乐控制
            this.bgm = game.add.sound('bgm', 0.5, true);
            this.bgm.play();
            this.voiceBtn = game.add.sprite(923 / unit, 45 / unit, 'voice', 0);
            this.voiceBtn.width = 105 / unit;
            this.voiceBtn.height = 105 / unit;
            this.voiceBtn.inputEnabled = true;
            this.voiceBtn.events.onInputDown.add(this.bgmControl, this);
            //海豚
            this.bang = game.add.sprite(game.world.centerX, game.height - 178 / unit, 'allbang');
            this.bang.anchor.set(0.5, 1);
            this.bang.width = 700 / unit;
            this.bang.height = 750 / unit;
            this.bang.animations.add('run',runArr);
            this.bang.animations.play('run', 20, true);
            //鸡冠
            this.comb1 = game.add.sprite(138 / unit, 1428 / unit, 'comb');
            this.comb1.width = 137 / unit;
            this.comb1.height = 157 / unit;
            this.comb1.rotation = 1.5 * Math.PI;
            var updown1 = this.add.tween(this.comb1);
            updown1.to({top: 1350 / unit}, 500, Phaser.Easing.Quadratic.InOut, true, 0, Number.MAX_VALUE, true);
            this.comb2 = game.add.sprite(825 / unit, 1347 / unit, 'comb');
            this.comb2.width = 137 / unit;
            this.comb2.height = 157 / unit;
            var updown2 = this.add.tween(this.comb2);
            updown2.to({top: 1250 / unit}, 700, Phaser.Easing.Quadratic.InOut, true, 300, Number.MAX_VALUE, true);
            //帮助信息
            this.helpBtn = game.add.button(game.width, 912 / unit, 'help', this.showHelp, this);
            this.helpBtn.anchor.set(1, 0);
            this.helpBtn.width = 86 / unit;
            this.helpBtn.height = 238 / unit;
            this.helpPopup = game.add.image(118 / unit, 798 / unit, 'popup');
            this.helpPopup.width = 835 / unit;
            this.helpPopup.height = 513 / unit;
            this.helpPopup.inputEnabled = true;
            this.helpPopup.events.onInputDown.add(this.closeHelp, this);
            this.helpPopup.visible = false;

        };
    };
    game.States.gameState = function () {
        // this.setupChange=function (bang) {
        //     bang.anchor.set(0.5,1);
        //     bang.width=350/unit;
        //     bang.height=700/unit;
        //     bang.animations.add('getchange');
        // };
        this.create = function () {
            game.physics.startSystem(Phaser.Physics.ARCADE);
            // 背景
            this.bg = game.add.sprite(0, 0, 'loadbg');
            this.bg.width = _width;
            this.bg.height = _height;
            // 地面
            this.ground = game.add.sprite(0, game.height, 'ground');
            this.ground.anchor.set(0, 1);
            this.ground.width = game.width;
            this.ground.height = 195 / unit;
            game.physics.arcade.enable(this.ground);
            //海豚
            this.bang = game.add.sprite(game.world.centerX, game.height - 178 / unit, 'allbang');
            this.bang.anchor.set(0.5, 1);
            this.bang.width = 700 / unit;
            this.bang.height = 750 / unit;
            this.bang.animations.add('bangrun',runArr);
            this.bang.animations.add('bangget',getArr);
            this.bang.animations.add('banglose',loseArr);
            this.bang.animations.play('bangrun', 20, true);
            game.physics.arcade.enable(this.bang);
            this.bang.body.collideWorldBounds = true;
            //分数
            this.scoreBox = game.add.sprite(25 / unit, 20 / unit, 'scorebox');
            this.scoreBox.width = 525 / unit;
            this.scoreBox.height = 157 / unit;
            this.score = game.add.retroFont('score', 32, 62, "0123456789", 10, 0, 0);
            this.score.setFixedWidth(320, Phaser.RetroFont.ALIGN_RIGHT);
            this.score.text = "0"
            this.num = game.add.image(200 / unit, 86 / unit, this.score);
            this.num.scale.set(1 / unit);
            this.onStart();
            //音效
            this.getbgm = game.add.audio('get', 0.2, false);

            // 变身
            // this.getchanges=game.add.group();
            // this.getchanges.createMultiple(3, 'getchange');
            // this.getchanges.forEach(this.setupChange, this);

        };
        this.onStart = function () {
            //游戏开始
            this.bang.inputEnabled = true;
            this.bang.input.enableDrag(false);
            this.bang.input.allowVerticalDrag = false;
            this.scorecount = 0;

            var drop = {
                dropcomb: {
                    game: this,
                    selfPic: "comb",
                    makeCount: 30,
                    velocity: 400,
                    acceleration: 200,
                    angularVelocity: 20,
                    selfTimeInterval: 0.5,
                },
                dropboom: {
                    game: this,
                    selfPic: "boom",
                    makeCount: 15,
                    velocity: 350,
                    acceleration: 200,
                    angularVelocity: 0,
                    selfTimeInterval: 0.8,
                }
            }
            this.acomb = new Drop(drop.dropcomb);
            this.acomb.init();
            this.aboom = new Drop(drop.dropboom);
            this.aboom.init();

        };
        this.crashDrops = function (bang, drop) {
            if (drop.key === "comb") {
                drop.kill();
                // this.bang.animations.stop('bangrun');
                this.bang.animations.currentAnim.stop();
                this.bang.animations.play('bangget', 20, false);
                this.getbgm.play();
                this.scorecount += 1000;

            } else {
                // bang.kill();
                // this.dead();
                this.bang.animations.currentAnim.stop();
                this.bang.animations.play('banglose', 20, false);
            }
        }
        this.update = function () {
            this.acomb && game.physics.arcade.overlap(this.acomb.drops, this.bang, this.crashDrops, null, this);
            this.aboom && game.physics.arcade.overlap(this.aboom.drops, this.bang, this.crashDrops, null, this);
            if(this.bang.animations.currentAnim.isFinished){
                this.bang.animations.play('bangrun', 20, true);
            };
            this.score.text = "" + this.scorecount;
        };
    };

    game.state.add('boot', game.States.bootState);
    game.state.add('loader', game.States.loaderState);
    game.state.add('main', game.States.mainState);
    game.state.add('game', game.States.gameState);

    game.state.start('boot');

});