
'use strict';

var Game = function(resizer) {
    this.canvas = resizer.getCanvas();
    this.realCtx = this.canvas.getContext('2d');
    this.canvasUI = new GJS.CanvasUI({
        element: this.canvas,
        getCanvasPositionFromEvent: function(event) {
            return resizer.getCanvasPosition(event);
        }
    });
    this.time = 0;

    var numPlayers = 1;
    this.input = new GJS.InputMapper(this, numPlayers);
    // Example usage of GJS.InputMapper
    //this.input.addListener(GJS.Gamepad.BUTTONS.UP_OR_ANALOG_UP, ['up', 'w'], this.upPress, this.upRelease);
    
    if (DEV_MODE) {
        this.input.addListener(undefined, ['0'], this.devModeTakeScreenshot);
    }
    this.takeScreenshot = false;
    
    var gameDate = new Date();
    gameDate.setYear(1910);
    gameDate.setMonth(9);
    gameDate.setDate(1);
    
    this.conditions = new Conditions({
        date: gameDate,
        distanceFromPole: 1300
    });
    this.conditionsUI = new ConditionsUI(this.conditions);
};

Game.prototype.render = function(ctx) {
    // GJS.CanvasResizer passes a wrapped 2D context to use here when run in FIXED_COORDINATE_SYSTEM mode,
    // where ctx.canvas.width/height are set to the coordinate system width/height.
    // Otherwise the context initialized here is used.
    if (ctx === undefined) {
        ctx = this.realCtx;
    }
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    ctx.save();
    ctx.translate(200, 400);
    ctx.scale(20, 20);
    this.conditionsUI.render(ctx);
    ctx.restore();
    
    var that = this;
    if (this.takeScreenshot) {
        ctx.canvas.toBlob(function(blob) {
            saveAs(blob, 'screenshot.png');
            that.takeScreenshot = false;
        });
        this.takeScreenshot = false;
    }
    
    return ctx;
};

Game.prototype.update = function(deltaTime) {
    this.time += deltaTime;
    this.input.update();
    // Update your level here
    GJS.Audio.muteAll(Game.parameters.get('muteAudio'));
};

/**
 * Mouse/touch handler for pressing down a mouse button or touch.
 * @param {Object} event With following keys:
 *   currentPosition: Vec2 with current pointer coordinates in the canvas coordinate system.
 *   lastDown: Vec2 with coordinates of the latest press event in the canvas coordinate system.
 *   isDown: Boolean telling if the pointer is down.
 *   index: Integer index of the pointer being tracked.
 */
Game.prototype.canvasPress = function(event) {
};

/**
 * Mouse/touch handler for releasing a mouse button or touch.
 * @param {Object} event With following keys:
 *   currentPosition: Vec2 with current pointer coordinates in the canvas coordinate system.
 *   lastDown: Vec2 with coordinates of the latest press event in the canvas coordinate system.
 *   isDown: Boolean telling if the pointer is down.
 *   index: Integer index of the pointer being tracked.
 */
Game.prototype.canvasRelease = function(event) {
};

/**
 * Mouse/touch handler when a pointer is being moved.
 * @param {Object} event With following keys:
 *   currentPosition: Vec2 with current pointer coordinates in the canvas coordinate system.
 *   lastDown: Vec2 with coordinates of the latest press event in the canvas coordinate system.
 *   isDown: Boolean telling if the pointer is down.
 *   index: Integer index of the pointer being tracked.
 */
Game.prototype.canvasMove = function(event) {
};

/**
 * Set the takeScreenshot flag so that a screenshot is taken on the next frame.
 */
Game.prototype.devModeTakeScreenshot = function() {
    this.takeScreenshot = true;
};

// Parameters added here can be tuned at run time when in developer mode
Game.parameters = new GJS.GameParameters({
    'muteAudio': {initial: false}
});

var DEV_MODE = querystringUtil.get('devMode') !== undefined;

window['start'] = function() {
    var DEBUG_MAIN_LOOP = DEV_MODE && true; // Set to true to allow fast-forwarding main loop with 'f'
    Game.parameters.set('muteAudio', (DEV_MODE && true)); // Set to true if sounds annoy developers

    mathUtil.seedrandom();

    var canvas = document.createElement('canvas');
    var canvasWrapper = document.createElement('div');
    canvasWrapper.appendChild(canvas);

    GJS.commonUI.createUI({
        parent: canvasWrapper,
        fullscreenElement: document.body,
        twitterAccount: 'Oletus',
        fillStyle: '#ffffff',
        opacity: 0.5,
        scale: 1
    });
    
    var resizer = new GJS.CanvasResizer({
        mode: GJS.CanvasResizer.Mode.FIXED_COORDINATE_SYSTEM,
        width: 1280,
        height: 720,
        canvas: canvas,
        wrapperElement: canvasWrapper
    });
    var game = new Game(resizer);
    
    // Create event handlers for mouse and touch based input that will call on the canvas* members of game.
    resizer.createPointerEventListener(game, true);

    // Initialize after CanvasResizer so it is always drawn on top
    if (DEV_MODE) {
        Game.parameters.initGUI();
    }

    startMainLoop([resizer, game, new GJS.LoadingBar(), resizer.pixelator()], {debugMode: DEBUG_MAIN_LOOP});
};
