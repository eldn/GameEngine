/**
 * Hilo 2.0.0 for commonjs
 * Copyright 2016 alibaba.com
 * Licensed under the MIT License
 */



/**
 * @language=en
 * @class Ticker is a Timer. It can run the code at specified framerate.
 * @param {Number} fps The fps of ticker.Default is 60.
 * @module hilo/util/Ticker
 * @requires hilo/core/Class
 * @requires hilo/util/browser
 */
class Ticker{

    constructor(fps){
        this._targetFPS = fps || 60;
        this._interval = 1000 / this._targetFPS;
        this._tickers = [];
    }

    _paused: boolean = false;
    _targetFPS: number = 0;
    _interval: number =  0;
    _intervalId: any = null;
    _tickers: Array<any> = null;
    _lastTime: number = 0;
    _tickCount: number = 0;
    _tickTime: number = 0;
    _measuredFPS: number = 0;
    _useRAF : boolean;

    /**
     * @language=en
     * Start the ticker.
     * @param {Boolean} userRAF Whether or not use requestAnimationFrame, default is true.
     */
    start(useRAF){
        if(useRAF === undefined){
            useRAF = true;
        }
        
        if(this._intervalId) return;
        this._lastTime = +new Date();

        var self = this, interval = this._interval,
            raf = window.requestAnimationFrame ||
                  window[browser['jsVendor'] + 'RequestAnimationFrame'];

        var runLoop;
        if(useRAF && raf && interval < 17){
            this._useRAF = true;
            runLoop = function(){
                self._intervalId = raf(runLoop);
                self._tick();
            };
        }else{
            runLoop = function(){
                self._intervalId = setTimeout(runLoop, interval);
                self._tick();
            };
        }

        this._paused = false;
        runLoop();
    }

    /**
     * @language=en
     * Stop the ticker.
     */
    stop(){
        if(this._useRAF){
            var cancelRAF = window.cancelAnimationFrame ||
                  window[browser['jsVendor'] + 'CancelAnimationFrame'];
            cancelRAF(this._intervalId);
        }
        else{
            clearTimeout(this._intervalId);
        }
        this._intervalId = null;
        this._lastTime = 0;
        this._paused = true;
    }

    /**
     * @language=en
     * Pause the ticker.
     */
    pause(){
        this._paused = true;
    }


    /**
     * @language=en
     * Resume the ticker.
     */
    resume(){
        this._paused = false;
    }


    /**
     * @private
     */
    _tick(){
        if(this._paused) return;
        var startTime = +new Date(),
            deltaTime = startTime - this._lastTime,
            tickers = this._tickers;

        //calculates the real fps
        if(++this._tickCount >= this._targetFPS){
            this._measuredFPS = 1000 / (this._tickTime / this._tickCount) + 0.5 >> 0;
            this._tickCount = 0;
            this._tickTime = 0;
        }else{
            this._tickTime += startTime - this._lastTime;
        }
        this._lastTime = startTime;

        var tickersCopy = tickers.slice(0);
        for(var i = 0, len = tickersCopy.length; i < len; i++){
            tickersCopy[i].tick(deltaTime);
        }
    }


    /**
     * @language=en
     * Get the fps.
     */
    getMeasuredFPS(){
        return Math.min(this._measuredFPS, this._targetFPS);
    }

    /**
     * @language=en
     * Add tickObject. The tickObject must implement the tick method.
     * @param {Object} tickObject The tickObject to add.It must implement the tick method.
     */
    addTick(tickObject){
        if(!tickObject || typeof(tickObject.tick) != 'function'){
            throw new Error('Ticker: The tick object must implement the tick method.');
        }
        this._tickers.push(tickObject);
    }


    /**
     * @language=en
     * Remove the tickObject
     * @param {Object} tickObject The tickObject to remove.
     */
    removeTick(tickObject){
        var tickers = this._tickers,
            index = tickers.indexOf(tickObject);
        if(index >= 0){
            tickers.splice(index, 1);
        }
    }

    /**
     * 下次tick时回调
     * @param  {Function} callback
     * @return {tickObj}
     */
    nextTick(callback){
        var that = this;
        var tickObj = {
            tick(dt){
                that.removeTick(tickObj);
                callback();
            }
        };

        that.addTick(tickObj);
        return tickObj;
    }

    /**
     * 延迟指定的时间后调用回调, 类似setTimeout
     * @param  {Function} callback
     * @param  {Number}   duration 延迟的毫秒数
     * @return {tickObj}
     */
    timeout(callback, duration){
        var that = this;
        var targetTime = new Date().getTime() + duration;
        var tickObj = {
            tick(){
                var nowTime = new Date().getTime();
                var dt = nowTime - targetTime;
                if(dt >= 0){
                    that.removeTick(tickObj);
                    callback();
                }
            }
        };
        that.addTick(tickObj);
        return tickObj;
    }

    /**
     * 指定的时间周期来调用函数, 类似setInterval
     * @param  {Function} callback
     * @param  {Number}   duration 时间周期，单位毫秒
     * @return {tickObj}
     */
    interval(callback, duration){
        var that = this;
        var targetTime = new Date().getTime() + duration;
        var tickObj = {
            tick(){
                var nowTime = new Date().getTime();
                var dt = nowTime - targetTime;
                if(dt >= 0){
                    if(dt < duration){
                        nowTime -= dt;
                    }
                    targetTime = nowTime + duration;
                    callback();
                }
            }
        };
        that.addTick(tickObj);
        return tickObj;
    }
}

module.exports = Ticker;