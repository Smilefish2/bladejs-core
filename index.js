'use strict';

var App = function (jade) {

    jade = jade || require('jade');

    /**
     * Add New Nodes
     */
    require('./lib/nodes');

    /**
     * Overrides Jade Lexer Prototype
     */
    require('./lib/Lexer')(jade);

    /**
     * Overrides Jade Parser Prototype
     */
    require('./lib/Parser')(jade);

    /**
     * Overrides Jade Compiler Prototype
     */
    require('./lib/Compiler')(jade);

};

module.exports = App();
