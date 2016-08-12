'use strict';

module.exports = function () {

    /**
     * Add New Nodes
     */
    require('./lib/nodes');

    /**
     * Overrides Jade Lexer Prototype
     */
    require('./lib/Lexer');

    /**
     * Overrides Jade Parser Prototype
     */
    require('./lib/Parser');

    /**
     * Overrides Jade Compiler Prototype
     */
    require('./lib/Compiler');
};
