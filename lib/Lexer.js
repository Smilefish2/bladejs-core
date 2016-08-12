'use strict';

function assertExpression(exp) {
    //this verifies that a JavaScript expression is valid
    Function('', 'return (' + exp + ')');
}

function assertNestingCorrect(exp) {
    //this verifies that code is properly nested, but allows
    //invalid JavaScript such as the contents of `attributes`
    var res = characterParser(exp)
    if (res.isNesting()) {
        throw new Error('Nesting must match on expression `' + exp + '`')
    }
}

module.exports = function() {
    const Jade = require('jade');
    let Blade = Jade.Lexer.prototype;

    /**
     * @extends
     */
    Blade.extends = function () {
        var captures;
        var regexp = /^extends\b([^\n]+)/;

        if (captures = regexp.exec(this.input)) {
            this.consume(captures[0].length);
            var tag = this.tok('@extends', captures[1]);
            tag.selfClossing = true;
            return tag;
        }
    };

    /**
     * @sections
     */
    Blade.block = function () {
        var captures;
        var regexp = /^block\b([^\n]+)/;
        if (captures = regexp.exec(this.input)) {
            this.consume(captures[0].length);
            var tag = this.tok('@section', captures[1]);
            captures[1] = captures[1].split(',');
            tag.selfClossing = captures[1].length > 1;
            return tag;
        }
    };

    /**
     * @include
     */
    Blade.include = function () {
        var captures;
        var regexp = /^include\b([^\n]+)/;

        if (captures = regexp.exec(this.input)) {
            this.consume(captures[0].length);
            var tag = this.tok('@include', captures[1]);
            tag.selfClossing = true;
            return tag;
        }
    };

    /**
     * @yield
     */
    Blade.yield = function () {
        var captures;
        var regexp = /^yield\b([^\n]+)/;

        if (captures = regexp.exec(this.input)) {
            this.consume(captures[0].length);
            var tok = this.tok('@yield', captures[1]);
            tok.selfClossing = true;
            return tok;
        }
    };
};