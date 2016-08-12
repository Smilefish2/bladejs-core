'use strict';

var Jade  = require('jade');
var Node  = Jade.nodes.Node;
var Block = Jade.nodes.Block;

var Directives = module.exports = function Directives(name, value, selfClossing, hasParam) {
    this.name = name;
    this.val = value || 'undefined';
    this.selfClossing = selfClossing;
    this.hasParam = hasParam || false;
    // this.block = block || new Block;
};

Directives.prototype = Object.create(Node.prototype);
Directives.prototype.constructor = Directives;

Directives.prototype.type = 'Directives';