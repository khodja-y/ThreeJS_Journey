import Robot from './Robot.js'

export default class FlyingRobot extends Robot
{
    takeOff()
    {
        console.log('have a good flight');
    }

    land()
    {
        console.log(`welcome back ${this.name}`);
    }
}