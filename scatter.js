var chartTitle = 'Články v predátorských a místních časopisech v různých institucích'
var yAxisLabel = 'Podíl výsledků v RIV publikovaných v predátorských časopisech'
var xAxisLabel = 'Podíl výsledků v RIV publikovaných v místních časopisech'

var fields = ['Zemědělské a veterinární vědy', 'Technické vědy', 'Humanitní vědy', 'Lékařské vědy','Přírodní vědy','Společenské vědy']
var usedfields = fields

function filterArray (institutions) {
     listinst = $.map(institutions,function(el) {return el;});
     if (usedfields.length != fields.length) {
        listinst = listinst.filter(inst => usedfields.includes(inst.Obor))
    }
    return listinst;
};

function toggleLegendClick(field,g,institutions,xScale,yScale,color,tooltip){
    if (usedfields.includes(field)) {
        usedfields = usedfields.filter(e => e != field);
    }
    else {
        usedfields.push(field)
    }
    DrawData(g,institutions,xScale,yScale,color,tooltip);
}

function DrawData(g,institutions,xScale,yScale,color,tooltip) {

    var points = filterArray(institutions)

    g.selectAll(".dot").remove();
    g.selectAll('.dot')
        .data(points)
        .enter()
        .append('circle')
        .attr('class','dot')
        .attr('cx', function(d) {return xScale(d.LocalShare); })
        .attr('cy', function(d) {return yScale(d.PredatoryShare); })
        .attr('r', 5 )
        .attr('fill',function(d) {return color(d.Obor); })
        .attr('id',function(d) {return d.JEDNOTKA})
        //.attr('class','selected') // Adjust selection here
        .attr('data-legend',function(d) {return d.Obor})
        .on('mouseover',function(d) {
            tooltip.transition()
                .duration(200)
                .style('opacity',0.9);
            tooltip.html(d.JEDNOTKA)
        })
        .on('mouseout',function(d){
            tooltip.transition()
                .duration(500)
                .style('opacity',0);
        })
        .on('mousemove',function (d) {
            tooltip.html(d.JEDNOTKA)
                .style('left',(d3.event.pageX) + 'px')
                .style('top',(d3.event.pageY - 28) + 'px')
        })
};

function DrawStatics(g,yAxis,xAxis,xScale,yScale,height,width) {
    // Draw y-axis
    g.append('g')
        .attr("class", "y axis")
        .call(yAxis);
    g.append('text')
        .attr("transform", "rotate(-90)")
        .attr('class','label')
        .attr('x',0-(height/2))
        .attr('y',-50)
        .style("text-anchor", "middle")
        .text(yAxisLabel);

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
      .text(xAxisLabel);

      // Add lines
      g.append("line")
        .attr("x1",xScale(1))
        .attr('y1',yScale(0))
        .attr("x2",xScale(0))
        .attr('y2',yScale(1))
        .attr('class','helpline')
        .attr('stroke-dasharray',"5,5");

      g.append("line")
        .attr("x1",xScale(0.8))
        .attr('y1',yScale(0))
        .attr("x2",xScale(0))
        .attr('y2',yScale(0.8))
        .attr('class','helpline')
        .attr('stroke-dasharray',"5,5");

      g.append("line")
        .attr("x1",xScale(0.6))
        .attr('y1',yScale(0))
        .attr("x2",xScale(0))
        .attr('y2',yScale(0.6))
        .attr('class','helpline')
        .attr('stroke-dasharray',"5,5");

      g.append("line")
        .attr("x1",xScale(0.4))
        .attr('y1',yScale(0))
        .attr("x2",xScale(0))
        .attr('y2',yScale(0.4))
        .attr('class','helpline')
        .attr('stroke-dasharray',"5,5");

      g.append("line")
        .attr("x1",xScale(0.2))
        .attr('y1',yScale(0))
        .attr("x2",xScale(0))
        .attr('y2',yScale(0.2))
        .attr('class','helpline')
        .attr('stroke-dasharray',"5,5");

        //triangle
        g.append('polygon')
        .attr('class','triangle')
        .attr('points',xScale(1) + ',' +yScale(0) + ' ' + xScale(1) + ',' +yScale(1) + ' ' + xScale(0) + ',' +yScale(1))
};

function DrawLegend(institutions,g,xScale,yScale,color,tooltip) {
    var legendG = g.append('g')
                    .attr('class','legendG')
                    .attr('transform','translate(230,35)')
    var legendRect = legendG.append('rect')
                        .attr('class','legendRect')
                        .attr('fill','white')
                        .attr('width','205px')
                        .attr('height','150px')
                        .attr('transform','translate(-15,-15)')
                        .attr('fill-opacity','0.6');
    legendG.append('text')
            .text('Zobrazit/skrýt obory:')
            .attr('id','legendDesc')
            .attr('transform','translate(0,2)')

    var legend = legendG.selectAll('.legend')
                    .data(color.domain())
                    .enter()
                    .append('g')
                    .attr('class','legend')
                    .attr('transform',function(d,i) {return 'translate(0,'+ (20 + i*20) + ')'; })
                    .on('click',function(d) {
                        toggleLegendClick(d,g,institutions,xScale,yScale,color,tooltip);
                        $(this).toggleClass('legendPassive');
                    });

    //Draw legend circles
    legend.append('circle')
        .attr('cy',0)
        .attr('r',5)
        .attr('width',18)
        .attr('height',18)
        .style('fill',color)
        .style('stroke',color);

    //Draw legend text
    legend.append('text')
        .attr('x',15)
        .attr('dy','.35em')
        .style('text-anchor','begin')
        .text(function(d) {return d})
};

function DrawChart(institutions) {
    $("#chart").empty();

    var margin = {top:10,right:20,bottom:30,left:60},
        width = 530 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

        var xScale = d3.scaleLinear()
            .range([0,width])
            .domain([0,1]);

        var xAxis = d3.axisBottom().scale(xScale).ticks(5).tickFormat(d3.format(".0%"));

        var yScale = d3.scaleLinear()
    		.range([height,0])
    		.domain([0,1]);
        var yAxis = d3.axisLeft().scale(yScale).ticks(5).tickFormat(d3.format(".0%"));

        var color = d3.scaleOrdinal()
        	.domain(['Zemědělské a veterinární vědy', 'Technické vědy', 'Humanitní vědy', 'Lékařské vědy','Přírodní vědy','Společenské vědy'])
        	.range(['#d53e4f','#fc8d59','#fee08b','#e6f598','#99d594','#3288bd']);

        var svg = d3.select('#chart')
                    .append('svg')
                    .attr('overflow','hidden')
                    .attr('id','svg')
                    .attr('width',width + margin.left + margin.right + 'px')
                    .attr('height',height + margin.bottom + margin.top + 'px')
                    .append('g')
                    .attr('transform','translate(' + margin.left + ',' + margin.top + ')');

        var g = svg.append('g')
                    .attr('id','chartGroup');

        d3.select('.tooltip').empty()
        var tooltip = d3.select('body')
                        .append('div')
                        .attr('class','tooltip')
                        .style('opacity',0);

        DrawStatics(g,yAxis,xAxis,xScale,yScale,height,width);

        DrawData(g,institutions,xScale,yScale,color,tooltip);

        DrawLegend(institutions,g,xScale,yScale,color,tooltip);
};
