'use strict';

module.exports = function () {
    var Jade = require('jade');
    var Blade = Jade.Parser.prototype;
    var utils = Jade.utils;
    var nodes = Jade.nodes;
    var blade = require('./nodes');

    Blade.parseDirectives = function () {
        var tag = this.expect('bladeDirectives');
        var directives = new blade.Directives(tag.name, tag.val, tag.statements);
        var block;

        directives.line = this.line();

        // handle block
        block = 'indent' == this.peek().type;
        if (block) {
            directives.block = this.block();
        }

        // handle missing block
        if (tag.requiresBlock && !block) {
            directives.block = new nodes.Block();
        }

        return directives;
    };


    /**
     * Parser Expression
     */
    Blade.parseExpr = function () {
        switch (this.peek().type) {
          case 'bladeDirectives':
            return this.parseDirectives();
          case 'tag':
            return this.parseTag();
          case 'mixin':
            return this.parseMixin();
          case 'block':
            return this.parseBlock();
          case 'mixin-block':
            return this.parseMixinBlock();
          case 'case':
            return this.parseCase();
          case 'extends':
            return this.parseExtends();
          case 'include':
            return this.parseInclude();
          case 'doctype':
            return this.parseDoctype();
          case 'filter':
            return this.parseFilter();
          case 'comment':
            return this.parseComment();
          case 'text':
            return this.parseText();
          case 'each':
            return this.parseEach();
          case 'code':
            return this.parseCode();
          case 'blockCode':
            return this.parseBlockCode();
          case 'call':
            return this.parseCall();
          case 'interpolation':
            return this.parseInterpolation();
          case 'yield':
            this.advance();
            var block = new nodes.Block;
            block.yield = true;
            return block;
          case 'id':
          case 'class':
            var tok = this.advance();
            this.lexer.defer(this.lexer.tok('tag', 'div'));
            this.lexer.defer(tok);
            return this.parseExpr();
          default:
            throw new Error('unexpected token "' + this.peek().type + '"');
        }
    };

    /**
     * Parse Expression
     *
     * @return {object}
     */
    Blade.parse = function () {

        var block = new nodes.Block, parser;

        block.line = 0;
        block.filename = this.filename;

        while ('eos' != this.peek().type) {
            if ('newline' == this.peek().type) {
                this.advance();
            } else {
                var next = this.peek();
                var expr = this.parseExpr();
                expr.filename = expr.filename || this.filename;
                expr.line = next.line;
                block.push(expr);
            }
        }

        if (parser = this.extending) {
            this.context(parser);
            var ast = parser.parse();
            this.context();

            // hoist mixins
            for (var name in this.mixins) {
                ast.unshift(this.mixins[name]);
            }

            return ast;
        }

        if (!this.extending && !this.included && Object.keys(this.blocks).length) {
            var blocks = [];

            utils.walkAST(block, function (node) {
                if (node.type === 'Block' && node.name) {
                    blocks.push(node.name);
                }
            });

            Object.keys(this.blocks).forEach(function (name) {
                if (blocks.indexOf(name) === -1 && !this.blocks[name].isSubBlock) {
                    console.warn('Warning: Unexpected block "'
                     + name
                     + '" '
                     + ' on line '
                     + this.blocks[name].line
                     + ' of '
                     + (this.blocks[name].filename)
                     + '. This block is never used. This warning will be an error in v2.0.0');
                }
            }.bind(this));
        }

        return block;
    };
};
