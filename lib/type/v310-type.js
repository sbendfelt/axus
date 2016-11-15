const Type = require('./type');

class v310Type extends Type {

    constructor(typeString, design, ...aliases) {
        super(typeString, design, ...aliases);
        this.apiVersion = '310';
        this.keyFunction = Type.keyFunction.bind(null, this.apiVersion);
    }

}

module.exports = v310Type;
