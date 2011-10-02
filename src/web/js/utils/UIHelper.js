/*
UIHelper.js
UI helper module, handles property setup of ui elements.
*/

var KAIOPUA = (function (main) {
    
    var shared = main.shared = main.shared || {},
        utils = main.utils = main.utils || {},
        uihelper = utils.uihelper = utils.uihelper || {},
        uiElementIDBase = 'ui_element',
        uiElementShowTime = 500,
        uiElementHideTime = 250;
        
    /*===================================================
    
    custom functions
    
    =====================================================*/
    
    function ui_element_ify ( parameters, el ) {
        var el = el || {}, 
            elementType,
            id,
            classes,
            autoPosition,
            text,
            cssmap,
            domElement;
        
        // handle parameters
        
        parameters = parameters || {};
        
        elementType = parameters.elementType || 'div';
        
        id = parameters.id || uiElementIDBase;
        
        classes = parameters.classes || '';
        
        staticPosition = parameters.staticPosition || false;
        
        text = parameters.text || '';
        
        cssmap = parameters.cssmap || {};
        
        cssmap.position = cssmap.position || (staticPosition === true) ? 'static' : 'absolute';
        
        // init dom element
        
        el.domElement = document.createElement( elementType );
        
        $(el.domElement).html( text );
        
        el.staticPosition = staticPosition;
        
        // id
        
        el.id = id;
        
        $(el.domElement).attr( 'id', id );
        
        // classes
        
        $(el.domElement).addClass( classes );
        
        // css
        
        $(el.domElement).css( cssmap );
        
        // dimensions
        
        if ( parameters.hasOwnProperty('width') ) {
            $(el.domElement).width( parameters.width );
        }
        
        if ( parameters.hasOwnProperty('height') ) {
            $(el.domElement).height( parameters.height );
        }
        
        // functions
        
        el.ui_reposition = function ( x, y ) {
            var tempadded = false;
            
            if ( el.staticPosition === false ) {
            
                if ( $(el.domElement).innerHeight() === 0 ) {
                    tempadded = true;
                    $(document.body).append( el.domElement );
                }
                
                $(el.domElement).css({
                    'left' : x + 'px',
                    'top' : y + 'px',
                    'margin-top' : (-$(el.domElement).height() * 0.5) + 'px',
                    'margin-left' : (-$(el.domElement).width() * 0.5) + 'px'
                });
                
                if ( tempadded ) {
                    $(el.domElement).detach();
                }
                
            }
        };
        
        el.ui_keep_centered = function () {
            
            if ( el.staticPosition === true ) {
                el.staticPosition = false;
                $(el.domElement).css({'position' : 'absolute'});
            }
            
            shared.signals.windowresized.add( el.ui_centerme );
            el.ui_centerme( shared.screenWidth, shared.screenHeight );
        };
        
        el.ui_not_centered = function () {
            shared.signals.windowresized.remove( el.ui_centerme );
        };
        
        el.ui_centerme = function ( W, H ) {
            el.ui_reposition( W * 0.5, H * 0.5 );
        };
        
        el.ui_show = function ( container, time, callback ) {
            if ( typeof container !== 'undefined' ) {
                $( container ).append( el.domElement );
            }
            
            if ( time === 0 || uiElementShowTime === 0 ) {
                $( el.domElement ).show();
            } 
            else {
                $( el.domElement ).fadeIn(time || uiElementShowTime);
            }
            
            $( el.domElement ).promise().done(function () {
                
                if ( typeof callback !== 'undefined' ) {
                    callback.call();
                }
                
            });
        };
        
        el.ui_hide = function ( remove, time, callback ) {
            if ( time === 0 || uiElementHideTime === 0 ) {
                $( el.domElement ).hide();
            } 
            else {
                $( el.domElement ).fadeOut(time || uiElementHideTime);
            }
            
            $( el.domElement ).promise().done(function () {
                
                if ( typeof callback !== 'undefined' ) {
                    callback.call();
                }
                
                if ( remove === true ) {
                    $( el.domElement ).detach();
                }
                
            });
        };
        
        return el;
    }
    
    /*===================================================
    
    public properties
    
    =====================================================*/
    
    uihelper.ui_element_ify = ui_element_ify;
    
    return main; 
    
}(KAIOPUA || {}));