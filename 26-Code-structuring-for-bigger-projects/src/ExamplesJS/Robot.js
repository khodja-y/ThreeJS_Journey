

export default class Robot
{
    // name;
    constructor(name, legs)
    {
        console.log('thanks');
        this.name = name;
        this.legs = legs;
    }
    sayHi()
    {
        console.log(`Hello i am  ${this.name}, i have ${this.legs} legs`);
    }
}
