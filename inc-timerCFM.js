<!---
*
*  Javascript Timer VERSION 1.0 (clever name, I know)
*	Author: Tommy Harding 
*	Email: tharding@m2ns.com
*
*	This is a javascript function that makes an on screen timer.
*	The function requires an input field named 'ticketTime' to update the current time counted
*	your start and stop buttons should include this javascript: onclick="toggleTimer(1);" to start
*	and onclick="toggleTimer(0);" to stop.
*	a version with one stop/start button can be made/modified on request (I had orginally done this but my current project required two buttons).
*
*	Version 2.0
*	Author: Tommy Harding
*	Email: tharding@m2ns.com
*
*	Change Log
*
*	Version 1.1
*	Added timestamp for an EndTime so the timer can log timestamps if desired.
*	
*	Version 1.2
*	Placed in ColdFusion cfm so it will be able to accept cftags and processing
*	
*	Version 2.0 (Major Change)
*	Adding start time so when exiting the page, the timer can continue to count and keep track of time while closed.
*	
*	***Known Issues for Version 1.0***: 
*	1. After starting the timer, clicking stop, then double-clicking (or multiple, rapid clicks on) the start start button,
*	results in the function running more than one instance, and speeding up the timer to faster than one second. this is being worked on and will be updated. ***FIXED IN VERSION 1.1***
*
*	***Known Issues for Version 2.0***:
*	If the timer is running, opening and closing the page more than once will result in the client variable resetting and the timer set back to 0 and not running. (since the client variable is at 0)
*
--->

<!--- Declare vars --->
var base = 60;
var seconds = 0;
var x = 0;
var pcdStartTime, pcdCurrentTime, pcdTime, pcdStartTimeStamp, pcdEndTimeStamp, pcoClock;
var init = 0;

<cfif CLIENT.cdTimeKeeping NEQ 0>
	<cfoutput>
		var pcdJSBeginTime = new Date(#pcdBeginTime#);
		var wcdMin = #dateDiff("n", CLIENT.cdTimeKeeping, wcdCurrentTime)#;
		var wcdSec = #dateDiff("s", CLIENT.cdTimeKeeping, wcdCurrentTime)#;
		var wcdHr = #dateDiff("h", CLIENT.cdTimeKeeping, wcdCurrentTime)#;
	</cfoutput>

	if(wcdMin >= 0 && wcdMin < 10){
		wcdMin = '0'+wcdMin;
	}

	if(wcdSec >= 0 && wcdSec < 10){
		wcdSec = '0'+wcdSec;
	}

	if(wcdHr >= 0 && wcdHr < 10){
		wcdHr = '0'+wcdHr;
	}

	var wnToggle = 1;
	var wnTimerOn = 1;
	<cfif CLIENT.bTimerOn EQ 1>
		$(document).ready(function(){
			getTheTime()
		});
	</cfif>

<cfelse>

	var wnToggle = 0;
	var wnTimerOn = 0;
	var wcdMin = '00';
	var wcdSec = '00';
	var wcdHr = '00';

</cfif>

<!--- toggling the timer (i could probably do without this function later but this was the easy way) --->
function toggleTimer(wnToggle){

	<!--- this effectivley locks the start button so the timer cannot be restarted until cleared --->
	<!--- but will still hold the previous value --->
	if(pcdStartTime != null && wnToggle==1){
		return;
	}
		if(wnToggle == 1){

			wnTimerOn = 1;

		}
		else{
			wnTimerOn = 0;
		}

		getTheTime();

}

<!--- Get the start time and end time on start and stop --->
function getTheTime(){
	if (init==0 && wnTimerOn == 1){
		wnTimerOn = 1;

		<cfif CLIENT.cdTimeKeeping NEQ 0>
			pcdStartTime = new Date(pcdJSBeginTime).getTime();
		<cfelse>
			pcdStartTime = new Date().getTime();
		</cfif>

		init = 1;

		if(document.getElementById('startTime')){
			pcdStartTimeStamp = new Date().getMonth()+1+'/'+new Date().getDate()+'/'+new Date().getFullYear()+' '+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds();

			}
	}

	if(wnTimerOn == 0){
		wnTimerOn = 0
		if(document.getElementById('endTime')){
			pcdEndTimeStamp = new Date().getMonth()+1+'/'+new Date().getDate()+'/'+new Date().getFullYear()+' '+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds();
			}

	}

	startStop(pcdStartTime);

}

<!--- function that drives the timer and updates the output --->
function startStop(){

	pcoClock = document.getElementById('ticketTime');

	if(wnTimerOn == 1){
		pcdTime = timer(pcdStartTime);
		setTimeout("startStop()",1000);
		pcoClock.value = pcdTime;
	}

	if(wnTimerOn == 0){
		return pcdTime;
	}

}

<!--- this is the timer itself  based on comparing current time to the start time (in milliseconds) --->
function timer(){
	pcdCurrentTime = (new Date().getTime() - pcdStartTime) - (wcdSec*1000);

	<!--- at 100 milliseconds update the second count --->
	if(pcdCurrentTime>999){
		wcdSec++;

		<!--- if second count is under 10, add a zero to the front --->
		if(wcdSec < 10){
			wcdSec = '0'+wcdSec;
		}
	}

	<!--- at 60 seconds update the minute count --->
	if(wcdSec > 59){
		wcdSec = '00'
		wcdMin++;

		<!--- if minute count is under 10, add a zero to the front --->
		if(wcdMin < 10){
			wcdMin = '0'+wcdMin;
		}
	}

	<!--- at 60 minutes update the hour count --->
	if(wcdMin > 59){
		wcdMin = '00'
		wcdHr++;

		<!--- if hour count is under 10, add a zero to the front (when is it ever going to go over 10?) --->
		if(wcdHr < 10){
			wcdHr = '0'+wcdHr;
		}
	}

	pcdTime = wcdHr+':'+wcdMin+':'+wcdSec;
	return pcdTime;
}

<!--- clears the timer and var that are used (might make the initilize into a function itself. we'll see) --->
function clearTimer(){

	<!--- make sure the timer is off before clearing --->
	if(wnTimerOn == 0){
		pcoClock = document.getElementById('ticketTime');
		pcoClock.value = '00:00:00';
		pcdTime = '';
		wcdMin = '00';
		wcdSec = '00';
		wcdHr = '00';
		init = 0;
		pcdEndTimeStamp = null;
		pcdStartTime = null;
		pcdEnterTime = null;

	}

	<!--- if you hit "clear" while the timer is running it won't do anything --->
	else{
		return;
	}
}

function addTime(){
	if(wnTimerOn == 0 && pcdStartTime != null && pcdEndTimeStamp != null){
		<!--- If the elements exist --->
		if(document.getElementById('startTime') && document.getElementById('endTime')){
			//Select Elements --->
			var pcdStartDisplay = document.getElementById('startTime');
			var pcdEndDisplay = document.getElementById('endTime');
			var pcdElementClass = document.getElementById('timeStamp');

			<!--- Show elements on page --->
			pcdElementClass.removeAttribute("style");

			<!--- Add time into inputs --->
			pcdStartDisplay.value = pcdStartTimeStamp;
			pcdEndDisplay.value = pcdEndTimeStamp;

			if(wcdSec > 0){
				wcdMin = parseInt(wcdMin);
				wcdMin = parseInt(wcdMin+1);
			}
			var pcdEnterTime = wcdMin;

			pcdEnterTime = wcdMin/60;

			pcdEnterTime = pcdEnterTime.toFixed(2);
			pcdEnterTime = parseFloat(pcdEnterTime);

			if(parseInt(wcdHr) > 0){
				wcdHr = parseInt(wcdHr);
				pcdEnterTime = parseFloat(wcdHr+pcdEnterTime);
			}
			document.getElementById('hours').value = pcdEnterTime;
			console.log(document.getElementById('hours').value);

			clearTimer();
		}
	}
}
function addTimeDash(){
	if(wnTimerOn == 0){
		// //Select Elements --->
		// var pcdStartDisplay = document.getElementById('startTime');
		// var pcdEndDisplay = document.getElementById('endTime');
		// var pcdElementClass = document.getElementById('timeStamp');

		// <!--- Show elements on page --->
		// pcdElementClass.removeAttribute("style");

		// <!--- Add time into inputs --->
		// pcdStartDisplay.value = pcdStartTimeStamp;
		// pcdEndDisplay.value = pcdEndTimeStamp;

		if(wcdSec > 0){
			wcdMin = parseInt(wcdMin);
			wcdMin = parseInt(wcdMin+1);
		}
		var pcdEnterTime = wcdMin;

		pcdEnterTime = wcdMin/60;

		pcdEnterTime = pcdEnterTime.toFixed(2);
		pcdEnterTime = parseFloat(pcdEnterTime);

		if(parseInt(wcdHr) > 0){
			wcdHr = parseInt(wcdHr);
			pcdEnterTime = parseFloat(wcdHr+pcdEnterTime);
		}
		document.getElementById('hours').value = pcdEnterTime;
		console.log(document.getElementById('hours').value);

		clearTimer();
	}
}
