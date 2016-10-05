/****************************************************************************
	moment-simple-format.js, 

	(c) 2016, FCOO

	https://github.com/FCOO/moment-format
	https://github.com/FCOO

****************************************************************************/

(function (moment, $ /*, window, document, undefined*/) {
	"use strict";
 
    /***********************************************************
    dateFormatList = array[0..dateFormats-1] of {DMY: [String], MDY: [String], YMD: [String]}
    List of different format-strings in tree different sequence
    ***********************************************************/
    var dateFormatList = [],
        w, m, y, 
        wFormat, mFormat, backslash, yFormat, dateFormat;
    for (w in {F:'', S:'', N:''})
        for (m in {F:'', S:'', D:''})
            for (y in {F:'', S:'', N:''}){
                dateFormat = {code: w+m+y, DMY: '', MDY: '', YMD:''};
                wFormat = w == 'F' ? 'dddd, ' : w == 'S' ? 'ddd, ' : '';
                mFormat = m == 'F' ? 'MMMM'   : m == 'S' ? 'MMM'   : 'MM';
                yFormat = y == 'F' ? 'YYYY'   : y == 'S' ? 'YY'    : '';
                backslash = mFormat == 'MM'; 
                
                dateFormat.DMY = wFormat + 'DD' + (backslash ? '/' : '. ') + mFormat + (yFormat ? (backslash ? '/' : ' ') + yFormat : '');
                dateFormat.MDY = wFormat + mFormat + (backslash ? '/' : ' ') + 'DD' + (yFormat ? (backslash ? '/' : ', ') + yFormat : '');
                dateFormat.YMD = wFormat + (yFormat ? yFormat + (backslash ? '/' : ' ') : '') + mFormat + (backslash ? '/' : ' ') + 'DD';

                dateFormatList.push( dateFormat );
            }
    //Special case: NNN
    dateFormatList.push( { code:'NNN', DMY: 'DD', MDY: 'DD', YMD: 'DD'} );
    
    /* 'Handmade' version to see the principle 
        { code:'FFF', DMY: 'dddd, DD. MMMM YYYY', MDY: 'dddd, MMMM DD, YYYY', YMD: 'dddd, YYYY MMMM DD' },    //Monday, 24. December 2015 | Monday, December 24, 2015 | Monday, 2015 December 24
        { code:'SFF', DMY: 'ddd, DD. MMMM YYYY' , MDY: 'ddd, MMMM DD, YYYY' , YMD: 'ddd, YYYY MMMM DD'  },    //Mon, 24. December 2015    | Monday, December 24, 2015 | Mon, 2015 December 24
        { code:'SSF', DMY: 'ddd, DD. MMM YYYY'  , MDY: 'ddd, MMM DD, YYYY'  , YMD: 'ddd, YYYY MMM DD'   },    //Mon, 24. Dec 2015         | Mon Dec 24, 2015          | Mon 2015 Dec 24
        { code:'SSS', DMY: 'ddd, DD. MMM YY'    , MDY: 'ddd, MMM DD, YY'    , YMD: 'ddd, YY MMM DD'     },    //Mon, 24. Dec 15           | Mon Dec 24, 15            | Mon 15 Dec 24
        { code:'NSF', DMY: 'DD. MMM YYYY'       , MDY: 'MMM DD, YYYY'       , YMD: 'YYYY MMM DD'        },    //24. Dec 2015              | Dec 24, 2015              | 2015 Dec 24
        { code:'NSS', DMY: 'DD. MMM YY'         , MDY: 'MMM DD, YY'         , YMD: 'YY MMM DD'          },    //24. Dec 15                | Dec 24, 15                | 15 Dec 24
        { code:'NDF', DMY: 'DD/MM/YYYY'         , MDY: 'MM/DD/YYYY'         , YMD: 'YYYY/MM/DD'         },    //24/12/2015                | 12/24/2015                | 2015/12/24
        { code:'NDS', DMY: 'DD/MM/YY'           , MDY: 'MM/DD/YY'           , YMD: 'YY/MM/DD'           },    //24/12/15                  | 12/24/15                  | 15/12/24
        { code:'NDN', DMY: 'DD/MM'              , MDY: 'MM/DD'              , YMD: 'MM/DD'              },    //24/12                     | 12/24                     | 12/24

        { code:'NNN', DMY: 'DD'                 , MDY: 'DD'                 , YMD: 'DD'                 },    //24                        | 24                        | 24
    */

    var defaultOptions = {
            time          : 24,
            timezone      : 'local',
            date          : 'DMY',
            dateFormat    : {
                weekday: 'None', 
                month  : 'Short', 
                year   : 'Full'
            },
            relativeFormat: {
                now    : true, 
                days   : false, 
                hours  : true,
                minutes: true
            },
            text: {
                utc     : 'UTC',
                local   : 'local',
                dayAbbr : 'd',
                hourAbbr: 'h',
                minAbbr : 'm',
                now     : 'now',
                to      : 'to'
            }
        },

        //Create namespace
        namespace = moment.simpleFormat = {
            options       : defaultOptions,
            code          : '',
            dateFormat    : '',
            timeFormat    : '',
            timezoneList  : [],
            relativeFormat: ''
        };

    

    function options2code( options ){
        //Convert the format of dastes in options to a tree-char code
        function convert( singleOption ){
            singleOption = singleOption.toUpperCase();
            return singleOption == 'FULL'    ? 'F' :
                   singleOption == 'SHORT'   ? 'S' : 
                   singleOption == 'DIGITAL' ? 'D' : 
                   singleOption == 'NONE'    ? 'N' : 
                                   singleOption;
        } 
        return convert( options.dateFormat.weekday ) + convert( options.dateFormat.month ) + convert( options.dateFormat.year );
    }            

    //Global const, var, and methods

    // moment.sfGetOptions
    moment.sfGetOptions = function( options ){ 
        return $.extend( true, {}, namespace.options, options );
    };

    // moment.sfGetDateFormat
    moment.sfGetDateFormat = function( options ){ 
        options = $.extend( true, {}, namespace.options, options );
        var i, code = options2code( options );
        for (i=0; i<dateFormatList.length; i++ )
            if (dateFormatList[i].code == code)
              return dateFormatList[i][ options.date ]; 
        return '';
    };

    // moment.sfGetTimeFormat
    moment.sfGetTimeFormat = function( options ){ 
        options = $.extend( true, {}, namespace.options, options );
        return parseInt(options.time) == 24 ? 'HH:mm' : 'hh:mma';
    };

    // moment.sfGetHourFormat
    moment.sfGetHourFormat = function( options ){ 
        options = $.extend( true, {}, namespace.options, options );
        return parseInt(options.time) == 24 ? 'HH' : 'hha';
    };

    // moment.sfGetTimezone
    moment.sfGetTimezone = function( id ){     
        id = id || namespace.options.timezone;
        for (var i=0; i<namespace.timezoneList.length; i++ )
            if (namespace.timezoneList[i].id == id)
                return namespace.timezoneList[i];
        return null;
    };

    // moment.sfGetRelativeFormat
    moment.sfGetRelativeFormat = function( options ){ 
        options = $.extend( true, {}, namespace.options, options );
        var opt_relativeFormat = options.relativeFormat,
            opt_text           = options.text;

        return (opt_relativeFormat.days    ? 'd['  + opt_text.dayAbbr  + ']' : '') + 
               (opt_relativeFormat.hours   ? 'h['  + opt_text.hourAbbr + ']' : '') +
               (opt_relativeFormat.minutes ? 'mm[' + opt_text.minAbbr  + ']' : '');
    };
    
    // moment.sfSetFormat
    moment.sfSetFormat = function( options ){ 
        $.extend( true, namespace.options, options );
        namespace.code = options2code( namespace.options );

        namespace.dateFormat     = this.sfGetDateFormat( namespace.options );
        namespace.timeFormat     = this.sfGetTimeFormat( namespace.options );
        namespace.hourFormat     = this.sfGetHourFormat( namespace.options );
        namespace.timezone       = this.sfGetTimezone( namespace.options.timezone );
        namespace.relativeFormat = this.sfGetRelativeFormat( namespace.options );
    
    };
    
    // moment.sfAddTimezone
    moment.sfAddTimezone = function( options ){ 
        var THIS = this;
        if ($.isArray( options ))
            $.each( options, function( index, opt ){ THIS.sfAddTimezone( opt ); } );
        else { 
            options.name = options.name || options.id;
            var offset = 0;
            switch (options.id){
                case 'local': offset = (new Date()).getTimezoneOffset();    break;
                case 'utc'  : offset = null; break;
                default     : offset = window.moment.tz.zone(options.id).parse(Date.UTC()); break;
            }
            options.offset = offset;                      
            options.fullName = options.name;                      
            if (offset !== null){
                options.fullName += ' (UTC';
                if (offset){
                    options.fullName += (offset<0?'+':'-');
                    offset = Math.abs(offset);        
                    var h = Math.floor(offset / 60),
                        m = offset % 60;
                    options.fullName += (h<10?'0':'') + h + ':' + (m<10?'0':'') + m;
                }
                options.fullName += ')';

            }
            namespace.timezoneList.push(options);
        }
    };
    
    // moment.sfDateFormatList
    moment.sfDateFormatList = function( includeCodeFunc ){
        includeCodeFunc = includeCodeFunc || function(/* code */){ return true; };
        var i, dateFormat, result = [];
        for (i=0; i<dateFormatList.length; i++ ){
            dateFormat = dateFormatList[i];
            if (includeCodeFunc( dateFormat.code ) ){
                result.push( dateFormat[ namespace.options.date ] );              
            }
        }
        return result;
    };

    // moment.sfInit
    moment.sfInit = function( options ){ 
        this.sfSetFormat( options );

        this.timezoneList = [];
        this.sfAddTimezone([
            { id:'local', name: namespace.options.text.local },
            { id:'utc',   name: namespace.options.text.utc   }
        ]);
    };

    moment.sfInit();
    

    //Moment.prototype.method == moment.fn.method

    // moment.fn.tzMoment
    moment.fn.tzMoment = function( timezone ) { 
        timezone = timezone || namespace.options.timezone;
        if (timezone == 'local') return this.local();
        if (timezone == 'utc') return this.utc();
        return this.tz( timezone );
    };


    //moment.fn._sfAnyFormat
    moment.fn._sfAnyFormat = function( options, func ){
        if (options){
            var saveOptions = $.extend(true, {}, namespace.options);
            moment.sfSetFormat( options );
        }

        var result = $.proxy( func, this )();

        if (options)
            moment.sfSetFormat( saveOptions );

        return result;
    };



    // moment.fn.dateFormat
    moment.fn.dateFormat = function( options ) { 
        return this._sfAnyFormat( options, function(){
            return this.format( namespace.dateFormat );
        });
    };

    // moment.fn.timeFormat
    moment.fn.timeFormat = function( options ) { 
        return this._sfAnyFormat( options, function(){
            return this.format( namespace.timeFormat );
        });
    };

    // moment.fn.hourFormat
    moment.fn.hourFormat = function( options ) { 
        return this._sfAnyFormat( options, function(){
            return this.format( namespace.hourFormat );
        });
    };



    // moment.fn.dateTimeFormat
    moment.fn.dateTimeFormat = function( options ) { 
        return this.dateFormat( options ) + ' ' + this.timeFormat( options );
    };

    // moment.fn.relativeFormat
    moment.fn.relativeFormat = function( options ) { 
        return this._sfAnyFormat( options, function(){
            var minDiff = this.diff( moment() , '', true),
                sign = minDiff < 0 ? '-' : '+';
            minDiff = Math.abs( minDiff ) ;
            return (namespace.options.relativeFormat.now ? namespace.options.text.now : '') + sign + moment.duration(minDiff).format( namespace.relativeFormat );
        });
    };

}(moment, jQuery, this, document));


