UIL.Proto = function( o ){

    o = o || {};



    this.zone = { x:0, y:0, w:0, h:0 };

    this.py = 0;
    this.actif = false;

    this.main = o.main || null;

    //this.type = '';
    // percent of title
    this.p = o.p || o.tPercent || 0;

    // if need resize width
    this.autoWidth = true;

    this.isGroup = false;
    this.parentGroup = null;

    // if height can change
    this.autoHeight = false;

    // if is on ui pannel
    this.isUI = o.isUI || false;

    // only for number
    this.isNumber = false;

    // only most simple 
    this.mono = false;

    // stop listening for edite slide text
    this.isEdit = false;

    // no title 
    this.simple = o.simple || false;

    // define obj size
    this.setSize( o.size );

    // title size
    if(o.sa !== undefined ) this.sa = o.sa;
    if(o.sb !== undefined ) this.sb = o.sb;
    
    // last number size for slide
    this.sc = o.sc === undefined ? 47 : o.sc;

    // like dat gui
    this.parent = null;
    this.val = null;
    this.isSend = false;

    var h = 20;
    if( this.isUI ) h = UIL.HEIGHT;//this.main.height;
    this.h = o.h || o.height || h;
    this.h = this.h < 11 ? 11 : this.h;
    
    this.bgcolor = UIL.COLOR || o.bgcolor;

    this.bg = this.isUI ? this.main.bg : 'rgba(44,44,44,0.3)';
    if(o.bg !== undefined ) this.bg = o.bg;



    //this.fontColor = o.fontColor === undefined ? UIL.BASECOLOR : o.fontColor;
    this.titleColor = o.titleColor || UIL.BASECOLOR;
    this.fontColor = o.fontColor || UIL.BASECOLOR;
    this.colorPlus = UIL.ColorLuma(this.fontColor, 0.3);
    

    this.txt = o.name || 'Proto';
    this.rename = o.rename || '';
    this.target = o.target || null;

    this.callback = o.callback === undefined ? null : o.callback;
    this.endCallback = null;

    if( this.callback === null && this.isUI && this.main.callback !== null ) this.callback = this.main.callback;

    // elements

    this.c = [];

    // style 

    this.s = [];

    //this.c[0] = UIL.DOM('UIL', 'div', 'position:relative; height:20px; float:left;');
    this.c[0] = UIL.DOM(null, 'div', UIL.BASIC + 'position:relative; height:20px; float:left;');
    this.s[0] = this.c[0].style;

    if( this.isUI ) this.s[0].marginBottom = '1px';
    

    if( !this.simple ){ 
        //this.c[1] = UIL.DOM('UIL text');
        this.c[1] = UIL.DOM(null, 'div', UIL.BASIC + UIL.TXT );
        this.s[1] = this.c[1].style;
        this.c[1].textContent = this.rename === '' ? this.txt : this.rename;
        this.s[1].color = this.titleColor;
    }

    if(o.pos){
        this.s[0].position = 'absolute';
        for(var p in o.pos){
            this.s[0][p] = o.pos[p];
        }
        this.mono = true;
    }

    if(o.css){
        this.s[0].cssText = o.css; 
    }

};

UIL.Proto.prototype = {

    constructor: UIL.Proto,

    // make de node


    init: function (){

        var s = this.s; // style cached

        //s[0] = this.c[0].style;
        s[0].height = this.h + 'px';

        if( this.isUI ) this.s[0].background = this.bg;//this.isUI ? this.main.bg : UIL.bgcolor(this.bgcolor);
        if( this.autoHeight ) this.s[0].transition = 'height 0.1s ease-out';
        if( this.c[1] !== undefined && this.autoWidth ){
            s[1] = this.c[1].style;
            s[1].height = (this.h-4) + 'px';
            s[1].lineHeight = (this.h-8) + 'px';
        }

        var frag = UIL.frag();

        for( var i=1, lng = this.c.length; i !== lng; i++ ){
            if( this.c[i] !== undefined ) {
                frag.appendChild( this.c[i] );
                s[i] = this.c[i].style;
            }
        }


        if( this.target !== null ){ 
            this.target.appendChild( this.c[0] );
        } else {
            if( this.isUI ) this.main.inner.appendChild( this.c[0] );
            else document.body.appendChild( this.c[0] );
        }

        this.c[0].appendChild( frag );

        //this.s = s;

        this.rSize();
        this.addEvent();

    },

    mouseAction: function ( mouse ){

    },

    getActif: function () {
        return this.actif;
    },

    rename: function ( s ){
        this.c[1].textContent = s;
    },

    setBG: function( c ){

        this.bg = c;
        this.s[0].background = c;

    },

    listen: function () {

        UIL.listens.push( this );
        return this;

    },

    listening: function () {

        if( this.parent === null ) return;
        if( this.isSend ) return;
        if( this.isEdit ) return;

        this.setValue( this.parent[ this.val ] );

    },

    setValue: function ( v ) {

        if( this.isNumber ) this.value = this.numValue( v );
        else this.value = v;

        this.update();

    },

    update: function () {
        
    },

    // update every change

    onChange: function ( f ) {

        this.callback = f;
        return this;

    },

    // update only on end

    onFinishChange: function ( f ) {

        this.callback = null;
        this.endCallback = f;
        return this;

    },

    send: function ( v ) {
        this.isSend = true;

        if( this.parent !== null ) this.parent[ this.val ] = v || this.value;
        if( this.callback ) this.callback( v || this.value );
        
        this.isSend = false;

    },

    sendEnd: function ( v ) {

        if( this.endCallback ) this.endCallback( v || this.value );
        if( this.parent !== null ) this.parent[ this.val ] = v || this.value;

    },

    

    // clear node
    
    clear: function () {

        this.clearEvent();
        UIL.clear( this.c[0] );

        if( this.target !== null ){ 
            this.target.removeChild( this.c[0] );
        } else {
            if( this.isUI ) this.main.clearOne( this );
            else document.body.removeChild( this.c[0] );
        }

        this.c = null;
        this.s = null;
        this.callback = null;
        this.target = null;

    },

    // change size 

    setSize: function ( sx ) {

        if( !this.autoWidth ) return;

        this.size = sx || UIL.WIDTH;
        if( !this.p ) this.p = UIL.P;

        if( this.simple ){
            this.sa = 0;
            this.sb = this.size;
        }else{
            var pp = this.size * ( this.p / 100 );
            this.sa = ~~ pp;
            this.sb = ~~ this.size - pp - 10;
        }

    },

    rSize: function () {

        if( !this.autoWidth ) return;

        this.s[0].width = this.size + 'px';
        if( !this.simple ) this.s[1].width = this.sa + 'px';
    
    },

    // for numeric value

    setTypeNumber: function ( o ) {

        this.isNumber = true;

        this.value = 0;
        if(o.value !== undefined){
            if( typeof o.value === 'string' ) this.value = o.value * 1;
            else this.value = o.value;
        }

        this.min = o.min === undefined ? -Infinity : o.min;
        this.max = o.max === undefined ?  Infinity : o.max;
        this.precision = o.precision === undefined ? 2 : o.precision;

        var s;

        switch(this.precision){
            case 0: s = 1; break;
            case 1: s = 0.1; break;
            case 2: s = 0.01; break;
            case 3: s = 0.001; break;
            case 4: s = 0.0001; break;
        }

        this.step = o.step === undefined ?  s : o.step;

        this.range = this.max - this.min;

        this.value = this.numValue( this.value );
        
    },

    numValue: function ( n ) {

        return Math.min( this.max, Math.max( this.min, n ) ).toFixed( this.precision ) * 1;

    },

    // ----------------------
    //   Events dispatch
    // ----------------------

    addEvent: function () {

        var i = this.c.length, j, c;
        while( i-- ){
            c = this.c[i];
            if( c !== undefined ){
                if( c.events !== undefined ){
                    j = c.events.length;
                    while( j-- ) c.addEventListener( c.events[j], this, false );
                }
            }
        }

    },

    clearEvent: function () {

        var i = this.c.length, j, c;
        while( i-- ){
            c = this.c[i];
            if( c !== undefined ){
                if( c.events !== undefined ){
                    j = c.events.length;
                    while( j-- ) c.removeEventListener( c.events[j], this, false );
                }
            }
        }

    },

    handleEvent: function ( e ) {
        
    },

    // ----------------------
    // object referency
    // ----------------------

    setReferency: function ( obj, val ) {

        this.parent = obj;
        this.val = val;

    },

    display: function ( v ) {

        this.s[0].display = v ? 'block' : 'none';

    },


}