'use strict';

function cleanValue(tag) {
    if (tag.hasParam) {
        return tag.val.replace(/[\/|\\]/g, '.');  // replace '/' to '.'
    } else {
        return (
            tag.val.replace(/[\/|\\]/g, '.')  // replace '/' to '.'
            .replace(/(["'])/g, '')
            .replace(/([\(|\)])/g, '')
        );
    }
}

function hasParam (val) {
    val = val.trim();
    return val.charAt(0) === '(' && val.charAt(val.length - 1) === ')';
}

module.exports = function () {
    const Jade = require('jade');
    let Blade = Jade.Parser.prototype;
    let utils = Jade.utils;
    let nodes = Jade.nodes;
    let blade = require('./nodes');

    /**
     * Convert Blade Tag
     * 
     * @param  {object} tag
     * @return {object}
     */
    Blade.directives = function (tag) {
        tag = tag;
        tag.hasParam = hasParam(tag.val);
        tag.val = cleanValue(tag).trim();
        let Directives = new blade.Directives(tag.type, tag.val, tag.selfClossing, tag.hasParam);
        return Directives;
    };

    Blade['@extends'] = function () {
        var tag = this.expect('@extends');
        return this.directives(tag);
    };

    Blade['@section'] = function () {
        var tag = this.expect('@section');
        return this.directives(tag);
    };

    Blade['@include'] = function () {
        var tag = this.expect('@include');;
        return this.directives(tag);
    };

    Blade['@yield'] = function () {
        var tag = this.expect('@yield');
        return this.directives(tag);
    };


    /**
     * Parser Expression
     */
    Blade.parseExpr = function () {
        switch (this.peek().type) {
            case 'tag':
                return this.parseTag();
            case 'mixin':
                return this.parseMixin();
            case '@section':
                return this['@section']();
            case 'mixin-block':
                return this.parseMixinBlock();
            case 'case':
                return this.parseCase();
            case '@extends':
                return this['@extends']();
            case '@include':
                return this['@include']();
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
            case '@yield':
                return this['@yield']();
            case 'id':
            case 'class':
                var tok = this.advance();
                this.lexer.defer(this.lexer.tok('tag', 'div'));
                this.lexer.defer(tok);
                return this.parseExpr();
            default:
                throw new Error('Unexpected Token "' + this.peek().type + '"');
        }
    };

    /**
     * Parse Expression
     * 
     * @return {object}
     */
    Blade.parse = function () {

        let block = new nodes.Block, parser;

        block.line = 0;
        block.filename = this.filename;

        while ('eos' != this.peek().type) {
            if ('newline' == this.peek().type) {
                this.advance();
            } else {
                let next = this.peek();
                let expr = this.parseExpr();
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