# moment-simple-format
>


## Description
Plugin to Moment with easy formatting and timezone selection

## Installation
### bower
`bower install https://github.com/FCOO/moment-simple-format.git --save`

## Demo
http://FCOO.github.io/moment-simple-format/demo/ 

## Usage

Simplifies the format of moment by setting

1. The format for time is `'24'` or '`12'` ('14:00' or '02:00 pm')
2. Witch time-zone the moment is displayed in:
    - local
    - utc
    - or any `moment.tz` time-zone added by `moment.sfAddTimezone`
3. The sequence of the different parts:
    - `DMY`: Day-Month-Year
    - `MDY`: Month-Day-Year
    - `YMD`: Teay-Month-Day
4. A date-string is formed by setting one of tree formats for each of the following tree parts: 
    - `weekday`: Format = `'Full'`, `'Short'`, or `'None'` (alt. `'F'`/`'S'`/`'N'`)
    - `month  `: Format = `'Full'`, `'Short'`, or `'Digital'` (alt. `'F'`/`'S'`/`'D'`) 
    - `year   `: Format = `'Full'`, `'Short'`, or `'None'`  (alt. `'F'`/`'S'`/`'N'`)
5. A relative moment-string is in the form `[now](+|-)[d[day-abbr]][h[hour-abbr]][mm[minutes-abbr]]`. Witch part to include is set by options `relativeFormat: {now: true, days: false, hours: true, minutes: true}` and options `text: {utc: 'UTC', local: 'local', dayAbbr : 'd', hourAbbr: 'h', minAbbr : 'm', now: 'now', to: 'to'}``

### options
The full options for setting the format:

	{
		time          : 24,       // = '24'/24/'12'/12
		timezone      : 'local',  // = 'local' or 'utc' or the id of a timezone added with moment.sfAddTimezone
		date          : 'DMY',    // = 'DMY'/'MDY'/'YMD'
		dateFormat    : {
			weekday: 'None',  // = 'full'/'f'/'short'/'s'/'none'/'n'
			month  : 'Short', // = 'full'/'f'/'short'/'s'/'digital'/'d'
			year   : 'Full'   // = 'full'/'f'/'short'/'s'/'none'/'n'
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
	}


There is a special case: `dateFormat: {weekday:'none', month:'none', year:'none'}` => only the date of the month

#### Examples of `dateFormat` (with `date:'DMY'`)
`dateFormat: {weekday:'F', month:'F', year:'F'}` => format = `'dddd, DD. MMMM YYYY'` (eg. `'Monday, 24. December 2015'`)
`dateFormat: {weekday:'N', month:'S', year:'F'}` => format = `'DD. MMM YYYY'`  (eg. `'24. Dec 2015'`)
`dateFormat: {weekday:'N', month:'D', year:'S'}` => format = `'DD/MM/YY'`  (eg. `'24/12/15'`)

### Methods

##### `moment.sfInit( options )`
Initialize the options and the list of time-zones
Only need to be call if `options.text` is changed

##### `moment.sfSetFormat( options )`
Set the `options`

##### `moment.sfAddTimezone( options )`
Adds a time-zone to the list of available time-zones

    options = {id: [String], //id of the timezone from moment.tz
               name: [String] //optional name for the timezone
              }
All the timezones are in `moment.simpleFormat.timezoneList //[]`

##### `moment.sfDateFormatList( includeCodeFunc )`
Return a array of available formats. 

`includeCodeFunc = function( code )`: optional - return true or false to include or exclude a format with code from the list

##### `moment.sfGetOptions( [options] )
Return the current options optional merged with `options`

##### `moment.sfGetDateFormat( [options] )
Return the current moment date format based on current options optional merged with `options`

##### `moment.sfGetTimeFormat( [options] )
Return the current moment time format based on current options optional merged with `options`

##### `moment.sfGetHourFormat( [options] )
Return the current moment hour format based on current options optional merged with `options`

##### `moment.sfGetTimezone( [id] )
Return the current timezone record moment or the timezone record withid = `id`

##### `moment().tzMoment( [timezone] )`
Return the moment adjusted to `timezone` or the time-zone set with `moment.sfSetFormat`

##### `moment().dateFormat( [options] )`
Return a formatted date string. The format is given by `options` or the options set with `moment.sfSetFormat`

##### `moment().timeFormat( [options] )`
Return a formatted time string. The format is given by `options` or the options set with `moment.sfSetFormat`

##### `moment().hourFormat( [options] )`
Return a formatted hour string. The format is given by `options` or the options set with `moment.sfSetFormat`

##### `moment().dateTimeFormat( [options] )`
Return a formatted date and time string. The format is given by `options` or the options set with `moment.sfSetFormat`

##### `moment().relativeFormat( [options] )`
Return a relative time string. The format is given by `options` or the options set with `moment.sfSetFormat`



## Copyright and License
This plugin is licensed under the [MIT license](https://github.com/FCOO/moment-simple-format/LICENSE).

Copyright (c) 2016 [FCOO](https://github.com/FCOO)

## Contact information

Niels Holt nho@fcoo.dk
