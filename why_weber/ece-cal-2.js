//string date to start the list range.
//recommend using Date.now() to filter out past events
var startDate = Date.now();
var items = [];
$.getJSON(
    "https://www.googleapis.com/calendar/v3/calendars/c_tavsahovtdark6lu9khban4qek@group.calendar.google.com/events?key=AIzaSyCrPzedxOXMEoXd5dzdF9hDOAkjcb3lsL0&singleEvents=true&orderBy=starttime&maxResults=5&timeMin="+ new Date(startDate).toISOString(),
    function(data) {
	$.each(data["items"], function(key, val) {
	    if (items.includes(startDate(val["start"])) === false) {
//		console.log(val);
		items.push(startDate(val["start"]));		
	    }
//	    console.log(items);
	});
	items = items.slice().sort();
	//      console.log(items)
	for (var i = 0; i < items.length - 1; i++) {
	    if (items[i + 1] == items[i]) {
		items.splice(i, 1);
	    }
	}

	var events = {};
	items.forEach(function(item) {
	    $.each(data["items"], function(key, val) {
		if (item == startDate(val["start"])) {
		    //          console.log(val);
		    if(events[item] === undefined){
			events[item] = new Array();
		    }
		    
		    events[item].push({
			'eventTitle' : val["summary"],
			'eventDescr' : val["description"]===undefined ? "<i>No Event Description</i>" : val["description"],
			'startTime' : startTime(val["start"]),
			'endDate' : moment(startDate(val["end"])).format('l'),
			'endTime' : startTime(val["end"]),
			'htmlLink' : val["htmlLink"]
		    });
		    //console.log(events);
		    //console.log(val);
		}
		
	    });
	});
	var markup = "";
	items.forEach(function(eventDate){
	    var monthName = moment(eventDate).format("MMMM").toUpperCase();
	    var monthDate = moment(eventDate).format("DD");
	    markup += "<ol class='info clearfix'>";
	    markup += "<div class='date-box'>";
	    markup += "<span class='date-month'>"+monthName+"</span>";
	    markup += "<span class='date-day'>"+monthDate+"</span>";
	    markup += "</div><div class='events'>";
	    events[eventDate].forEach(function(event){
		//        console.log(event);
		markup += "<li class='cal'>";
		markup += "<h5 class='calendar-title'>"+event["eventTitle"]+"</h5>";
		markup += "<div class='event-details'>";
		markup += "<u>Start Time</u>: "+event["startTime"]+"<br/>";
		markup += "<u>End Date</u>: "+event["endDate"]+"<br/>";
		markup += "<u>End Time</u>: "+event["endTime"]+"<br/><br/>";
		markup += event["eventDescr"] + "<br/><br/>";
		markup += "<a href='"+event["htmlLink"]+"'>View this Event in Google Calendar</a><br/><br/>";
		markup += "</div></li>"
	    });
	    markup +="</span></ol></div></div>";
	});
	$("#calendar-list").append(markup);
	//console.log(events);

	function startDate(d) {
	    if (d["dateTime"] === undefined) return d["date"];
	    else {
		var formatted = new Date(d["dateTime"]);
		var day = formatted.getDate();
		var month = formatted.getMonth() + 1;
		var year = formatted.getFullYear();
		return year + "-" + pad(month) + "-" + pad(day);
	    }
	}
	
	function startTime(d){
	    if (d["dateTime"] === undefined) return "All Day";
	    else {
		var formatted = new Date(d["dateTime"]);
		return moment(d["dateTime"]).format('LT');
	    }
	}

	function pad(n) {
	    return n < 10 ? "0" + n : n;
	}

	$(".events").click(function(e) {
	    $(e.target)
		.next("div")
		.siblings("div")
		.slideUp();
	    $(e.target)
		.next("div")
		.slideToggle();
	});
    }
);
