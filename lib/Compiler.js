'use strict';

module.exports = function() {
    const Jade = require('jade');
    let Blade = Jade.Compiler.prototype;

    Blade.visitDirectives = function (tag) {
        let type = tag.name;
        let value = tag.val;

        if (tag.selfClossing) {
            if (type === '@extends') {
                this.buffer(type);
                this.buffer(`('${ value }')`);
            } else if (type === '@section') {
                if (this.pp) this.prettyIndent(1, true);
                this.buffer(type);
                if (tag.hasParam) this.buffer(value);
                else this.buffer(`(${ value })`);
            } else {
                if (this.pp) this.prettyIndent(1, true);
                this.buffer(type);
                if (tag.hasParam) this.buffer(value);
                else this.buffer(`('${ value }')`);
            }
        } else {
            var endType = type.replace(/(\@)(\w+)/, '$1end$2');

            if (this.pp) this.prettyIndent(1, true);
            this.buffer(type);
            if (tag.hasParam) this.buffer(value);
            else this.buffer(`('${ value }')`);

            if (this.pp) this.prettyIndent(1, true);
            this.buffer(endType);
        }
    };


    /**
     * Visit Code
     * 
     * @param  {obj} code
     * @return {string}
     */
    Blade.visitCode = function(code) {
        let val = code.val;
        if (code.buffer) {
            val = code.escape ? `{{ ${ val } }}` : `{!! ${ val } !!}`;
        } else {
            val = `@${ val }`;
        }

        this.buffer(val);
    };


    /**
     * Blade Comment
     */
    Blade.visitComment = function(comment) {
        if (!comment.buffer) return;
        if (this.pp) this.prettyIndent(1, true);

        var Comment = comment.val.trim();
        var val = '{{-- ' + Comment + ' --}}';

        this.buffer(val);
    };


    /**
     * Blade Block Comment
     */
    Blade.visitBlockComment = function(comment){
        if (!comment.buffer) return;
        if (this.pp) this.prettyIndent(1, true);
        var line = comment.block.nodes.length;

        this.indents++;
        this.buffer('{{--');
        if (this.pp) this.prettyIndent(1, line == 1);
        this.visit(comment.block);
        if (this.pp) this.prettyIndent(0, true);
        this.buffer('--}}');
        this.indents--;
    };
};