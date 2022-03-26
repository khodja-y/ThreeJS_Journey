import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter
{
    constructor()
    {
        super();

        //Setup
        this.start = Date.now();
        this.currentTime = this.start;
        this.eslapsedTime = 0;
        this.delta = 14;

        window.requestAnimationFrame(() =>
        {
            this.tick();
        })
    }

    tick()
    {
        const currentTime = Date.now();

        this.delta = currentTime - this.currentTime;
        this.currentTime = currentTime;
        this.eslapsedTime = this.currentTime - this.start;

        this.trigger('tick');

        window.requestAnimationFrame(() =>
        {
            this.tick();
        })
    }
}