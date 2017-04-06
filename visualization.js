(function createInputSelector() {
    var profs = ['Wittman, Hannah', 'Hammond, Gail', 'Elisia, Ingrid', 'Valley, William', 'Lamers, Yvonne', 'Liew, Mark', 'Riseman, Andrew', 'Stopps, Gregory', 'Black, Thomas', 'von Keyserlingk, Marina', 'Friesen, Erin', 'Novak, Elizabeth', 'Lewis, Delisa', 'Vercammen, James', 'Jovel, Eduardo', 'Fortin, Marie-Claude', 'Li-Chan, Eunice', 'Madadi Noei, Azita', 'Barr, Susan', 'Castellanos Hurtado, Valeria', 'Sandberg, Gary', 'Cullen, Laura', 'Simmons, Dean', 'Cerri, Ronaldo', 'Burton, Bruce', 'Lavkulich, Leslie', 'Izadi Shavakand, Fariba', 'Daly, Zachary', 'Smit, Rosanne', 'Holm, Wendy', 'Arthur, Jennifer', 'Cliff, Margaret', 'Cinq-Mars, Crystal', 'Lund, Steven', 'Green, Timothy', 'Rajamahendran, Rajadurai', 'Silper, Bruna', 'Snow, Mary', 'Anema, Aranka', 'Xu, Zhaoming', 'Allen, Kevin', 'Chan, Judy', 'McHugh, Duncan', 'Raisinghani, Latika', 'Measday, Vivien', 'Holowaychuk, Sean', 'Walker, Kristen', 'Hilmer, P', 'Shackleton, David', 'Brown, Sandra', 'Temu, Alice', 'Johnson, Michael', 'Saenz Garza, Natalia', 'Van Vuuren, Hendrik', 'Zawistowski, Jerzy', 'Meng, Guangtao', 'Zibrik, Deborah', 'Scaman, Christine', 'Tugault-Lafleur, Claire', 'Farrell, Anthony', 'McQueen, Jennifer', 'Cant, Meghann', 'Kovacevic, Jovana', 'Ormandy, Elisabeth', 'Ellis, Brian', 'Yaghmaee, Parastoo', 'Smukler, Sean', 'Schuppli, Catherine', 'Wilson, Julie', 'Gulati, Sumeet', 'Upadhyaya, Mahesh', 'Traviss, Karol', 'Chen, Xiumin', 'Ackerman, Paige', 'Novak, Mike', 'Marshall, Valin', 'Rushen, Jeffrey', 'Baker-French, Sophia', 'Ross, Nancy', 'Kitts, David', 'Miladinovic, Zoran', 'Phasuk, Suvaporn', 'Krzic, Maja', 'Kasten, Gerry', 'Chapman, Gwenneth', 'Wiseman, Kelleen', 'Whitfield, Kyly', 'Rojas, Alejandro', 'Wang, Siyun', 'Barichello, Richard', 'Yada, Rickey', 'Castellarin, Simone', 'Dubois, Sara', 'Akhtar, Yasmin', 'Burnett, Tracy', 'Cheung, Imelda', 'Cowan, Shannon', 'Rideout, Candice', 'Schreier, Hanspeter', 'Bomke, Arthur', 'Keeney, Kristie', 'Liceaga, Andrea', 'Jolliffe, Peter', 'Facon, Michel', 'Kafka, Tamar', 'Black, Jennifer', 'Sullivan, Thomas', 'Oikawa, Chris', 'Robertson, Rebecca', 'Makowska, Inez Joanna', 'Fraser, David', 'McAusland, Carol', 'Bennett, Christopher', 'Isman, Murray', 'McLean, Judy', 'Mroz, Lawrence', 'Wasik, Ronald', 'Weary, Daniel', 'Rankin, Joanne', 'Karakochuk, Crystal', 'Lu, Xiaonan', 'Alizadeh Pasdar, Nooshin', 'Skura, Brenton', 'McArthur, David']
    
    var sortByLastName = profs.sort()

    var sel = document.getElementById('selectProf')

    var populateSelector = sortByLastName.map(function(x) {
        var opt = document.createElement('option')
        opt.innerHTML = x
        opt.value = x
        sel.appendChild(opt)
    })
}())

var handleSelectChange = function() {
    // clears svg
    d3.select('#parent').selectAll('*').remove()
    var optionValue = document.getElementById('selectProf').value
    // creates visualization from selected prof
    draw(optionValue)
}

var handleAverageToggle = function() {
    if (document.getElementById('toggleAvg').checked) {
        d3.selectAll('.avg-line').style('display', 'none')
    }
}

var svg = d3.select('svg'),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")").attr('id', 'parent');

var x = d3.scaleBand().rangeRound([0,width]),
    y = d3.scaleLinear().rangeRound([height, 0])

// util functions
var getFloorOfCourse = function(x) {
    return Math.floor(Number(x.split(" ")[1].split("").slice(0,3).join(""))/100)*100
}
var calcAvg = function(d, yearWithData) {
    var period = d.Period.slice(0,4)
    var course = getFloorOfCourse(d.Course)
    var size = d["Responses Expected"]

    var calculateAverageForPeriod = R.pipe(
        R.filter(function(d) {
            return d.course === course
        }),
        R.filter(function(d) {
            if (size < 50) {
                return d.size < 50
            } else {
                return d.size >= 50
            }
        }),
        R.map(function(d) {
            return d.avg
        }),
        R.mean
    )
    if (isNaN(calculateAverageForPeriod(yearWithData[period]))) {
        return -1;
    } 
    return calculateAverageForPeriod(yearWithData[period])
}
var calcClassSize = function(d, yearWithData) {
    var period = d.Period.slice(0,4)
    var course = getFloorOfCourse(d.Course)
    var size = d["Responses Expected"]

    var calculateAverageClassSizeForPeriod = R.pipe(
        R.filter(function(d) {
            return d.course === course
        }),
        R.filter(function(d) {
            if (size < 50) {
                return d.size < 50
            } else {
                return d.size >= 50
            }
        }),
        R.map(function(d) {
            return d.size
        }),
        R.mean
    )
    return calculateAverageClassSizeForPeriod(yearWithData[period])
}

var draw = function(instructor) {
    var color = d3.scaleOrdinal(d3.schemeCategory10)    
    var title = document.getElementById('title')
    title.innerText = instructor

    var maxmin = document.getElementById('max-min')

    d3.csv('output.csv', function(error, data) {
        if (error) throw error;

        var instructorData = data.filter(function(d) {
            return d.Instructor === instructor
        })
        
        period = instructorData.map(function(d) { return d.Period.slice(0,4)}).sort(function (a,b) { return a-b })

        var countUniquePeriod = period.reduce(function(values, v) {
            if (!values.set[v]) {
                values.set[v] = 1;
                values.count++;
            }
            return values;
        }, { set: {}, count: 0 }).count;
        
        var calculateAveragePerYearExcludingProf = R.pipe(
            R.filter(function (d) { return d.Instructor !== instructor }),
            R.map(function (d) { 
                d.Course = getFloorOfCourse(d.Course)
                d.Period = d.Period.split("").slice(0,4).join("")
                return d
            }),
            R.reduce(function(obj, d) {
                var defaultToArray = R.defaultTo([])
                obj[d.Period] = defaultToArray(obj[d.Period])
                
                obj[d.Period].push({
                    course: d.Course,
                    size: Number(d['Responses Expected']),
                    avg: Number(d['Instructor Avg']),
                    instructor: d.Instructor
                })
                return obj
            }, {})
        )

        var yearWithData = calculateAveragePerYearExcludingProf(data)

        var averages = instructorData.map(function(d) {
            return calcAvg(d, yearWithData)
        })

        var minArray = R.append(Number(d3.min(instructorData, function(d) { return d['Instructor Avg']})), averages)
        var maxArray = R.append(Number(d3.max(instructorData, function(d) { return d['Instructor Avg']})), averages)
        var minArrayFiltered = minArray.filter(function(x) { return x >= 0 })
        var min = Math.min.apply(null, minArrayFiltered)
        var max = Math.max.apply(null, maxArray)

        var maxMinMessage = "The minimum score is " + Math.round(d3.min(instructorData, function(d) { return d['Instructor Avg']})*100)/100 + ". " + "The maximum score is " + Math.round(d3.max(instructorData, function(d) { return d['Instructor Avg']})*100)/100 + "."
        maxmin.innerText = maxMinMessage

        x.domain(period)
        y.domain([min, max])

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(10))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("UMI6");

        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .html(function(d) { 
                
                avg = Math.round(Number(d['Instructor Avg'])*100) / 100;
                console.log(Math.round(calcAvg(d, yearWithData)*100)/100)
                var style = "<span style='color: green'>"
                if ((Math.round((avg-Math.round(calcAvg(d, yearWithData)*100)/100)*100)/100) < 0) {
                    style = "<span style='color: red'>" 
                } 
                var delta = Math.round((avg-Math.round(calcAvg(d, yearWithData)*100)/100)*100)/100
                if (Math.round(calcAvg(d, yearWithData)*100)/100 === -1) {
                    delta = "not applicable"
                }

                return "<strong>UMI6:</strong> <span style='color: black;'>" + avg + "</span>" + "<br>" 
                    + "<strong>Course:</strong> <span style='color: black;'>" + d.Course + "</span>" + "<br>" 
                    + "<strong>Term:</strong> <span style='color: black;'>" + d.Period + "</span>" + "<br>"
                    + "<strong>Total Number of Responses:</strong> <span style='color: black'>" + d.Submissions + "</span>" + "<br>" 
                    + "<strong>Course Size:</strong> <span style='color: black'>" + d['Responses Expected'] + "</span>" + "<br>"
                    + "<strong>Response Rate:</strong> <span style='color: black'>" + Math.round(d.Submissions/d['Responses Expected']*100) + "%" + "</span>" + "<br>" 
                    + "<strong>Delta:</strong>" + style + " " + delta + "</span>" + "<br>" 
            });

        var avgTip = d3.tip()
            .attr('class', 'd3-tip')
            .html(function(d) {                 
                return "<strong>Average UMI6:</strong> <span style='color: black;'>" + Math.round(calcAvg(d, yearWithData)*100)/100 + "</span>" + "<br>" 
                    + "<strong>Year Level:</strong> <span style='color: black;'>" + getFloorOfCourse(d.Course) + "</span>" + "<br>" 
                    + "<strong>Average Class Size:</strong> <span style='color: black;'>" + Math.round(calcClassSize(d, yearWithData)*100)/100 + "</span>" + "<br>" 
                     
            });

        g.selectAll('.dot')
            .data(instructorData)
            .enter().append('circle')
            .attr('class', 'dot')
            .attr('r', function(d) { return Math.pow(Math.log(d['Responses Expected']), 1.7) })
            .attr('cx', function(d) { return x(d.Period.slice(0,4))+width/countUniquePeriod/2 })
            .attr('cy', function (d) { return y(d['Instructor Avg']) })
            .style('fill', function(d) { 
                splitCourseName = d.Course.split(' ')
                return color(splitCourseName[0] + splitCourseName[1])
            })
            .attr('opacity', 0.5)
            .attr('class', function(d) {
                splitCourseName = d.Course.split(' ')
                return splitCourseName[0] + splitCourseName[1]
            })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)

        g.selectAll('.line')
            .data(instructorData)
            .enter().append('line')
            .attr('y1', function(d) { return y(Math.round(calcAvg(d, yearWithData)*100)/100) })
             .attr('y2', function(d) { return y(Math.round(calcAvg(d, yearWithData)*100)/100) })
             .attr('x1', function(d) { return x(d.Period.slice(0,4))+width/countUniquePeriod/2 - 18})
             .attr('x2', function(d) { return x(d.Period.slice(0,4))+width/countUniquePeriod/2 + 18})
             .attr('style', "stroke:rgb(0,0,0);stroke-width:6")
             .attr('class', function(d) {
                splitCourseName = d.Course.split(' ')
                return splitCourseName[0] + splitCourseName[1] + " " + 'avg-line'
            })
            .on('mouseover', avgTip.show)
            .on('mouseout', avgTip.hide)
            
        var legend = g.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("id", function(d) { return d} )
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
            .on('click', function(d) {
                if (document.getElementsByClassName(d)[0].style.display === 'none') {
                    d3.selectAll("." + d).style('display', '')    
                    d3.select('#' + d).style('opacity', 1)
                }
                else { 
                    d3.selectAll("." + d).style('display', 'none')
                    d3.select('#' + d).style('opacity', 0.4)
                }
            });

        // draw legend colored rectangles
        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color)
            .attr("opacity", 0.4);

        // draw legend text
        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d })
            
        svg.call(tip)
        svg.call(avgTip)        
        handleAverageToggle()
    })
}

// initial draw
handleSelectChange()