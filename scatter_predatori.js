var bZoomed = false;
function DrawChart() {
	var points = $.map(data.points,function (el) {if(el.Included == 'True') {return el; }})

	var margin = {top:30,right:20,bottom:30,left:40},
		width = 530 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var zMin = 30;
	var zMax = 5000;

	var domXMax = (bZoomed) ? 40 : 100 ;
	var xScale = d3.scaleLinear()
			.range([0,width])
			.domain([0,domXMax]);

	var xAxis = d3.axisBottom().scale(xScale).ticks(5);
	var domYMax = (bZoomed) ? 1: 3;
	var yScale = d3.scaleLinear()
			.range([height,0])
			.domain([0,domYMax]);

	var bubbleScale = d3.scaleLinear()
			.range([2,15])
			.domain([zMin,zMax]);

	var color = d3.scaleOrdinal()
	  .domain(["Frontiers", "Impact Journals", "ostatní vydavatelé", "samostatné časopisy"])
	  .range(["#9BBB59", "#F79646" , "#4F81BD","#BB133E"]);



	//define canvas
	var svg = d3.select('#chart')
		.append('svg')
		.attr('overflow', 'hidden')
		.attr('id','svg')
		.attr("width",width + margin.left + margin.right + "px")
		.attr("height",height +margin.bottom + margin.top + "px")
		.append("g")
		.attr("transform","translate(" + margin.left + "," + margin.top +")");


	//var canvas = svg.append('canvas').attr('width','600px').height('height','550px')
	var g = svg.append('g')
				.attr('id','chartGroup');

	//define tooltip
	var tooltip = d3.select("body").append("div")
					.attr("class","tooltip")
					.style("opacity",0);

	g.selectAll(".dot")
		.data(points)
		.enter()
		.append("circle")
		.attr("cx", function(d) {return xScale(d.DevelopedAuthors); })
		.attr("cy",function(d) {return yScale(d.SJR); })
		.attr("r",function(d) {return bubbleScale(d.Results); })
		.attr("fill",function (d) {return color(d.category); })
		.attr("id", function(d) {return d.ISSN})
		.attr("class", function(d) {
			if(document.getElementById("ddlSearch").value != "0"){
				if (d.selected != "0")	{ return "selected"; }
				else { return "unselected"; }
			}

		})
		.attr("data-legend", function (d) {return d.category; })
		.on("mouseover", function(d) {
			tooltip.transition()
               .duration(200)
               .style("opacity", 0.9);
			tooltip.html(GetTooltipText(d));

      })
      .on("mouseout", function(d) {
          	tooltip.transition()
               .duration(500)
               .style("opacity", 0);
      })
      .on("mousemove", function(d) {
    	  tooltip.html(GetTooltipText(d))
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px")
      })
      .on("click", function(d) {
    	  SelectFromDDL(d);
      });

	//vertical lines
	g.append("line")
		.attr("x1",xScale(33.3))
		.attr('y1',yScale(0))
		.attr("x2",xScale(33.3))
		.attr('y2',yScale(3))
		.attr('class','helpline')
		.attr('stroke-dasharray',"5,5");

	g.append("line")
		.attr("x1",xScale(100))
		.attr('y1',yScale(0))
		.attr("x2",xScale(100))
		.attr('y2',yScale(3))
		.attr('class','helpline');

	//horizontal line
	g.append("line")
		.attr("x1",xScale(0))
		.attr('y1',yScale(1))
		.attr("x2",xScale(100))
		.attr('y2',yScale(1))
		.attr('class','helpline')
		.attr('stroke-dasharray',"5,5");

	g.append("line")
		.attr("x1",xScale(0))
		.attr('y1',yScale(3))
		.attr("x2",xScale(100))
		.attr('y2',yScale(3))
		.attr('class','helpline');


	//quadrant numbers
	g.append('text')
		.attr('x',xScale(90))
		.attr('y',yScale(2.7))
		.attr('class','quadrantText')
		.text('I.');

	g.append('text')
		.attr('x',xScale(5))
		.attr('y',yScale(2.7))
		.attr('class','quadrantText')
		.text('II.');

	g.append('text')
		.attr('x',xScale(5))
		.attr('y',yScale(0.7))
		.attr('class','quadrantText')
		.text('III.');

	g.append('text')
		.attr('x',xScale(90))
		.attr('y',yScale(0.7))
		.attr('class','quadrantText')
		.text('IV.');

	// draw y-axis
	g.append('g')
		.attr("class", "y axis")
		.call(yAxis);
	g.append('text')
		.attr("transform", "rotate(-90)")
		.attr('class','label')
		.attr('x',0-(height/2))
		.attr('y',-30)
		.style("text-anchor", "middle")
		.text(data.yLabel);

	// draw x-axis
	g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("x", width/2)
      .attr("y", 30)
      .style("text-anchor", "middle")
      .text(data.xLabel);

	// add legend frame
 	  var legPositions = [0,80,200,330];

	  var legend = g.selectAll(".legend")
	      .data(color.domain())
	    .enter().append("g")
	      .attr("class", "legend")
	      //.attr("transform", function(d, i) { return "translate(" + i * 110 + ",-14)"; });
		  .attr("transform", function(d, i) { return "translate(" + legPositions[i] + ",-14)"; });

	  // draw legend colored rectangles
	  legend.append("circle")
		  .attr("cy", 0)
		  .attr('r',6)
		  .attr("width", 18)
		  .attr("height", 18)
		  .style("fill", color);

	  // draw legend text
	  legend.append("text")
		  .attr("x", 15)
		  //.attr("y", 9)
		  .attr("dy", ".35em")
		  .style("text-anchor", "begin")
		  .text(function(d) { return d;})
			//if (detectIE() != false)
			//{
			//		$('#btnZoom').css('display','none');
			//		$('#ddlSearch').css('width','580px')
			//}
	};

function UpdateZoom()
{
	bZoomed = (bZoomed) ? false : true ;
	var linkText = (bZoomed) ? 'Oddálit' : 'Přiblížit III.';
	$('#btnZoom').text(linkText);
	$("#chart").empty();
	$(".tooltip").remove();
	DrawChart();
};

function GetTooltipText(d)
{
	var s = "<b>" + d.JournalName + "</b> (ISSN " + d.ISSN + ")<br> Ve Scopusu celkem " + d.Results + " výsledků";

	return s
};

function SelectFromDDL(d)
{
	$.each(data.points,function(key, value)
			{
			    value.selected = "0";
			});
	document.getElementById("ddlSearch").value = d.ISSN;

    var obj = data.points[d.ISSN];
    delete data.points[d.ISSN];
    data.points[obj.ISSN] = obj;
	data.points[d.ISSN].selected = "1";

	openDescBox(d);
	$("#chart").empty();
	$(".tooltip").remove();
	DrawChart();
}


function findJournal()
{
	//unselect previous
	$.each(data.points,function(key, value)
		{
		    value.selected = "0";
		});

	//selected row
	var xrow = document.getElementById("ddlSearch").value;

	//select new one
    if (xrow == "0"){
    	closeDescBox()
    }
    else{
        //document.getElementById("message").innerHTML = "Having a Baby!!";
        var obj = data.points[xrow];
        delete data.points[xrow];
        data.points[obj.ISSN] = obj;
    	data.points[xrow].selected = "1";
    	openDescBox(data.points[xrow])
    }

    //get the element as last to be drawn last


	$("#chart").empty();
	$(".tooltip").remove();
	DrawChart();



};

function openDescBox(d)
{
	//$('#descBox').removeClass('boxclosed');
	$('#descBox').css('display','block');
	$('#descBox').animate({height:'150px'},500,
			function() {
		$('#jTitle').html('<strong>' + d.JournalName + '</strong> (ISSN: ' + d.ISSN + ')');
		$('#jPublisher').html('Vydavatelství: ' + d.Publisher +  ' (' + d.PublisherCountry + ')');
		var sLink = 'https://www.scopus.com/results/results.uri?numberOfFields=0&src=s&clickedLink=&edit=&editSaveSearch=&origin=searchbasic&authorTab=&affiliationTab=&advancedTab=&scint=1&menu=search&tablin=&searchterm1=' + d.ISSN + '&field1=ISSN&dateType=Publication_Date_Type&yearFrom=2013&yearTo=2015&loadDate=7&documenttype=Article%2CReview&resetFormLink=&st1=' + d.ISSN + '&st2=&sot=b&sdt=b&sl=15&s=ISSN%28' +d.ISSN + '%29&sid=6DD658C6ADDFBFFB9E2BBFF39306F5D8.wsnAw8kcdt7IPYLO0V48gA%3A110&searchId=6DD658C6ADDFBFFB9E2BBFF39306F5D8.wsnAw8kcdt7IPYLO0V48gA%3A110&txGid=6DD658C6ADDFBFFB9E2BBFF39306F5D8.wsnAw8kcdt7IPYLO0V48gA%3A11&sort=plf-f&originationType=b&rr=';
		var sLink = 'https://www.scopus.com/results/results.uri?numberOfFields=0&src=s&clickedLink=&edit=&editSaveSearch=&origin=searchbasic&authorTab=&affiliationTab=&advancedTab=&scint=1&menu=search&tablin=&searchterm1=' + d.ISSN + '&field1=ISSN&dateType=Publication_Date_Type&yearFrom=2013&yearTo=2015&loadDate=7&documenttype=Article%2CReview&resetFormLink=&st1=' + d.ISSN + '&st2=&sot=b&sdt=b&sl=15&s=ISSN%28' + d.ISSN + '%29'
		$('#jResults').html('V letech 2013 - 2015 je ve Scopusu  <a href="'+sLink+'" target="_blank">' + d.Results + ' výsledků</a> (aktuální k 30. říjnu 2016; odkaz směřuje do placené části databáze)')

		$('#jOtherDB').html(GetIndexationString(d));
		$('#closeDescLink').html('<a id="closeDescLink" href="#" onclick="closeDescBox();return false;"><img src="CloseIcon.png" height="30" width="30"></img></a>')
	});
	//$('#scopusLink').attr('href',sLink);
};

function GetIndexationString(d)
{
	var result = "";
	if (d.Included == 'True'){
		if (d.WoS == '1.0') { result += 'Indexován ve Web of Science'} else {result += 'Není indexován ve Web of Science'}
		if (d.DOAJ == 'not in DOAJ') {result += ' a není v databázi DOAJ.'} else {
			if (d.DOAJ == 'normal') {result += ' a v databázi DOAJ je zařazen na základě méně náročných kriterií.'} else { result += ' a v databázi DOAJ získal tzv. "zelené razítko".'}
		}
	}
	else {
		result = 'Časopis nemá dost pozorování k zařazení do hlubší analýzy'
	}
	return result;
}

function closeDescBox()
{
	$('#descBox').animate({height:'0px'},500,
		function() {
			$('#descBox').css('display','none');

			$.each(data.points,function(key, value)
					{
					    value.selected = "0";
					});

			document.getElementById("ddlSearch").value = "0";


			$("#chart").empty();
			$(".tooltip").remove();
			DrawChart();
	});
};


//Handling Internet Explorer
function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }

    // var edge = ua.indexOf('Edge/');
    // if (edge > 0) {
    //    // Edge (IE 12+) => return version number
    //    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    // }

    // other browser
    return false;
}
