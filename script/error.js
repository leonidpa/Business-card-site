var ErrorColor = " #00cc00";

function LogError(err) {
    console.log(
        "%c" + 
        "\n\t" + err.name + 
        "\n\t" + err.message + 
        "\n\t" + err.stack,
        "color:" + ErrorColor);
}

class Error{
    constructor(message){
        this.message = message;
        this.name = "Error";
        this.stack = [];
    }
}

class AngularMuduleError extends Error{
    constructor(message){
        super(message);
        this.name="Angular Mudule Error";
    }
}
class HttpGetError extends Error    {
    constructor(message){
        super(message);
        this.name="Http Get Error";
    }
}