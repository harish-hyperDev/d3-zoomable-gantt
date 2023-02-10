$(document).ready(function () {
    $('.js-example-basic-multiple').select2();
});


// To get the event positio05
var keyFunction = function (d) {
    return d.startdate + d.date;
}

var svg = d3.select("svg")

var margin = {
    top: 20,
    right: 20,
    bottom: 110,
    left: 50
},
    margin2 = {
        top: 430,
        right: 20,
        bottom: 30,
        left: 50
    },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    height2 = +svg.attr("height") - margin2.top - margin2.bottom;

// Define the div for the tooltip
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")

var parseDate = d3.timeParse("%b %Y");

const dateParse = (x) => {
    if (!isNaN(new Date(moment(x).format("DD/MM/YYYY hh:mm:ss a")).getTime())) {
        return new Date(moment(x).format("DD/MM/YYYY hh:mm:ss a"));
    } else return null
}

const momentTimeFormat = (y, d) => {

    let extractDate = moment(y).format('DD/MM/YYYY')

    console.log("y ", extractDate)

    /* let dy = y.getDate()
    let mn = y.getMonth()
    let yr = y.getFullYear() */

    let a = moment(y).format("hh:mm:ss a")
    // let ampm = a.substring(0,a.length - 3)

    console.log("just a ", a)
    let a24 = convertTime12To24(a)
    // let a24 = convertTime12To24("3:25:01 PM")
    console.log("a24 ", a24)

    // let ampm = a[a.length - 3] + a[a.length - 2] + a[a.length - 1]
    // console.log(ampm)

    a = a.substring(0, a.length - 3)


    console.log(a)
    let m = moment.duration(a24).asSeconds() + moment.duration(d).asSeconds()
    console.log("m ", m)

    function durationTo24H(data) {
        /* var minutes = data % 60;
        var hours = (data - minutes) / 60;  
        return (hours + ":" + minutes); */

        let hours = data / 3600;
        let mins = (data % 3600) / 60;
        let secs = (mins * 60) % 60;
        return (Math.trunc(hours) + ":" + Math.trunc(mins) + ":" + Math.trunc(secs));
    }

    function convertTime12To24(time) {
        var hours = Number(time.match(/^(\d+)/)[1]);
        var minutes = Number(time.match(/:(\d+)/)[1]);
        var secs = time.match(/:(\d+):(\d+)/)[2];
        var AMPM = time.match(/\s(.*)$/)[1];
        if ((AMPM === "PM" || AMPM === "pm") && hours < 12) hours = hours + 12;
        if ((AMPM === "AM" || AMPM === "am") && hours === 12) hours = hours - 12;
        var sHours = hours.toString();
        var sMinutes = minutes.toString();
        var sSecs = secs.toString();
        if (hours < 10) sHours = "0" + sHours;
        if (minutes < 10) sMinutes = "0" + sMinutes;
        return (sHours + ":" + sMinutes + ":" + sSecs);
    }

    /* function convertTime24To12(time) {
      // Check correct time format and split into components
      time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
      if (time.length > 1) { // If time format correct
        time = time.slice(1);  // Remove full string match value
        time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
      } 
  
  
      return time.join(''); // return adjusted time or original string
  
  
    }*/

    console.log("dt24h ", durationTo24H(m))
    let resultTime = durationTo24H(m)
    let resultDate = extractDate + " " + resultTime

    let finalRes = new Date(moment(extractDate + " " + resultTime).format('MM/DD/YYYY hh:mm:ss a'))

    // console.log("result date ", resultDate)
    // console.log("ress ", finalRes)

    return finalRes
    // return durationTo24H(m)

    // let z = moment.duration(a).asHours() + moment.duration('0:00:55').asHours()
    // console.log(z)
    // return z

}

var drawChatFromData = d3.csv('../data/timeline_sample.csv', function (data) {
    // console.log(this)
    // data = data.filter(d => d['level_0'] !== '')
    let dkeys = Object.keys(data)
    let fdata;
    var dates;

    const dateRegEx = /(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}/
    const timeFormtAmPM = /([1-9]|0[1-9]|1[0-2]):[0-5][0-9] ([AaPp][Mm])/
    const durationRegEx = /(2[0-4]|[0-1]?[0-9]):[0-5][0-9]:[0-5][0-9]/

    /* for(let i = 0; i < data.length; i++) {
      for(let j = 0; j < data.length; j++) {
        console.warn(data[i][j])
      }
    } */

    /* for(let i = 0; i < data.length; i++) {
      for(let j = 0; j < dkeys.length; j++) {
        // console.log(data[i][dkeys[j]])
        console.log(dkeys[j])
      }
      // console.log(data[i])
    } */

    dates = Object.keys(data[0]).filter((d) => dateRegEx.test(d))

    data = data.filter(obj => {
        return Object.values(obj).some(value => value != null && value !== "");
    });

    console.log(data)
    // console.log(data)
    var callsData;




    var filterCallsByDate = []
    var filteredData = []
    var extraInfo = []




    // The below filter removes empty array and only returns callStartedDate and Duration of the call(callEndDate)
    filterCallsByDate = data.map((d, i) => {
        return Object.keys(d).map((keys) => {

            let date = keys;

            // console.log("date ", keys.match(dateRegEx))
            // console.log("values ", d[keys])


            // console.log(keys.match(dateRegEx))
            // if (dateRegEx.test(keys) && d[keys] !== '' && d[keys] !== null && dateParse(keys) !== null) {
            // if (dateRegEx.test(keys) && d[keys] !== '' && d[keys] !== null && dateParse(keys) !== null) {
            if (dateRegEx.test(keys) && d[keys] !== '' && d[keys] !== null && dateParse(keys) !== null) {

                /* console.log("extract ", keys + ' ' + timeFormtAmPM.exec(d[keys])[0])
                console.log("extracted full date ", dateParse(keys + ' ' + timeFormtAmPM.exec(d[keys])[0])) */

                // console.log("duration reg ", durationRegEx.exec(d[keys])[0])
                // console.log("inside keys ", keys)

                console.log(keys)
                console.log(d[keys])

                // console.warn(dateParse(keys + ' ' + timeFormtAmPM.exec(d[keys])[0]), "\n", momentTimeFormat(keys + ' ' + timeFormtAmPM.exec(d[keys])[0], durationRegEx.exec(d[keys])[0]))

                // don't remove these variables!!
                let callStartedDate = dateParse(keys + ' ' + timeFormtAmPM.exec(d[keys])[0])
                // console.log("call start ", callStartedDate)
                let callEndDate = momentTimeFormat(keys + ' ' + timeFormtAmPM.exec(d[keys])[0], durationRegEx.exec(d[keys])[0])

                // console.log("finding err start dates", callStartedDate)
                // console.log("finding err end dates", callEndDate)
                // console.log("finding ------------------------------------------------------------")

                console.log('sage ', d['SageCRMid'])
                console.log("closed ", new Date(moment(d["Close Date"]).format("DD/MM/YYYY")))
                console.log("started ", d["Created Date"])
                try {
                    // console.warn("time formt err ", timeFormtAmPM.exec(d[keys])[0] === '' && keys)
                    return {
                        startdate: callStartedDate,
                        enddate: callEndDate,
                        date: keys,
                        accountId: d['Account ID'],
                        amount: d['Total Amount (Required)'],
                        quantity: d['Quantity'],

                        duration: durationRegEx.exec(d[keys])[0],
                        sageCRMid: d['SageCRMid'],
                        stage: d['Stage'],

                        oppurtunityOwner: d['Opportunity Owner'],
                        oppurtunityId: d['Opportunity ID'],

                        created: d['Created Date'],
                        closed: d['Close Date'],
                        lastModified: d['Last Modified Date']
                        // status: Object.keys(taskStatus)[Math.floor(Math.random() * taskStatusKeys.length)]
                    }
                } catch (err) { console.log("exception at key ", keys) }
                // return { callStarted: dateParse(keys) }
            }

        }).filter(k => k)
    })

    function getSelectedValues() {
        var dropDownn = document.getElementById('dropdown'), countryArray = [], i;
        for (i = 0; i < dropDownn.options.length; i += 1) {
            if (dropDownn.options[i].selected) {
                //countryArray.push( dropDown.options[i].value); //If you need only values 
                countryArray.push({ Name: dropDownn.options[i].text, Value: dropDownn.options[i].value });
            }
        }
        console.log("country", countryArray);
        return false;
    }

    function getValue(select) {
        var result = [];
        var options = select && select.options;

        var s = $("select")
        console.log("select ", s)
        console.log("options ", options)
        var opt;

        for (var i = 0; i < options.length; i++) {
            opt = options[i];

            if (opt.selected) {
                result.push(opt.value || opt.text);
            }
        }

        console.log("get dropdown ", result)
        // return result;
    }



    // console.warn("inner ")
    let one = filterCallsByDate.filter(outer => {
        return outer.map(inner => { return inner })
    })


    let red = []
    let reducer = []

    for (let i = 0; i < filterCallsByDate.length; i++) {
        // console.log("for")
        for (let j = 0; j < filterCallsByDate.length; j++) {
            if (filterCallsByDate[i][j] !== null && filterCallsByDate[i][j] !== undefined) {
                // console.log(filterCallsByDate[i][j])
                reducer.push(filterCallsByDate[i][j])
            }
        }
    }

    reducer = reducer.filter(k => k)

    var twoReducer = []

    if($('.js-example-basic-multiple').val().length > 0) {
        console.log("jq dropdown")

    }

    var mData = reducer;
    // console.log(reducer)

    console.log("\n calls \n\n", filterCallsByDate)
    // console.log("\n one \n\n", one)
    console.log("\n reducer \n\n", reducer)
    
    // console.log("\n filtered \n\n", filteredData)



    function reDraw(param) {
        
        console.log(param)
        if(param) {
            if(param.length !== 0) {
                twoReducer = []
                reducer.map(d => {
                    // d['sageCRMid']
                    return param.forEach((p,i) => {
                        if(p === d['sageCRMid'])
                            twoReducer.push(d)
                    }) 
                })
                console.log("two way red ", twoReducer)
            } 
            else twoReducer = [] 
        } 
        else twoReducer = []

        if(!twoReducer.length)
            twoReducer = reducer
            
        console.log("\n two way reducer \n\n", twoReducer)
        console.log("param ", param)

        // svg.selectAll('g')

        var x = d3.scaleTime()
            .domain([d3.min(mData, function (d) {
                return d.startdate;
            }), d3.max(mData, function (d) {
                return d.enddate;
            })])
            .range([0, width]),
            x2 = d3.scaleTime().range([0, width]),
            // y = d3.scaleOrdinal().range([height, 0]),
            y2 = d3.scaleLinear().range([height2, 0]);

        var y = d3.scaleBand()
            .domain(mData.map(function (entry) {
                return entry.date;
            }))
            .rangeRound([height, 0])

        // colors for each type
        var types = [...new Set(mData.map(item => item.date))];
        var colors = chroma.scale(['#8b0000', '#FFCCCB']).colors(types.length)

        var type2color = {}
        types.forEach(function (element, index) {
            type2color[element] = colors[index]
        });
        console.log("type 2 ", type2color)

        /*var y = d3.scale.ordinal()
                .domain(data.map(function(entry){
                    return entry.key;
                }))
                .rangeBands([0, height]);*/
        // var y = d3.scaleBand()
        //         .domain(data.map(function(entry){
        //             return entry.key;
        //         }))
        //     .rangeRound([0, height])
        //     .padding(0.1);      

        var rectTransform = function (d) {
            return "translate(" + x(d.startdate) + "," + y(d.date) + ")";
        };

        var xAxis = d3.axisBottom(x),
            xAxis2 = d3.axisBottom(x2),
            yAxis = d3.axisLeft(y).tickSize(0);

        var brush = d3.brushX()
            .extent([
                [0, height2 - 50],
                [width, height2]
            ])
            .on("brush end", brushed);

        var zoom = d3.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([
                [0, 0],
                [width, height]
            ])
            .extent([
                [0, 0],
                [width, height]
            ])
            .on("zoom", zoomed);

        // var area = d3.area()
        //     .curve(d3.curveMonotoneX)
        //     .x(function(d) { return x(d.date); })
        //     .y0(height)
        //     .y1(function(d) { return y(d.price); });
        svg.append("rect")
            .attr("class", "zoom")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(zoom);

        svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", width)
            .attr("height", height)
            //   .attr("width", width)
            //   .attr("height", height)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        var area = svg.append("g")
            .attr("class", "zoom")
            .attr('class', 'clipped')
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        var focus = svg.append("g")
            .attr("class", "focus")
            // .attr('clip-path', 'url(#clip)')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        area.selectAll(".circle")
            .data(mData, keyFunction).enter()
            .append("rect")
            //.attr('clip-path', 'url(#clip)')
            .attr("rx", 5)
            .attr("ry", 5)
            .attr("class", "circle")
            .attr("y", 0)
            .attr("transform", rectTransform)
            .attr("height", function (d) {
                return y.bandwidth();
            })
            .attr("width", function (d) {
                // console.log("negatives ", x(d.enddate) - x(d.startdate))
                // console.log("negatives ", d.enddate, d.startdate)
                return (x(d.enddate) - x(d.startdate))
            })
            .style("fill", function (d) {
                return type2color[d.date]
            })
            .on("mouseover", function (d) {
                tooltip
                    .style("left", d3.event.pageX + "px")
                    .style("top", d3.event.pageY + "px")
                    .style("padding", "5px")
                    .style("display", "inline-block")
                    .html(`${d.date} <br><br> 
                        Call Duration : ${d.duration} <br>
                        Oppurtunity Owner : ${d.oppurtunityOwner} <br>
                        Opportunity ID : ${d.oppurtunityId} <br>
                        Stage : ${d.stage} <br>
                        SageCRMid : ${d.sageCRMid} <br>
                        <br>
                        Account ID : ${d.accountId} <br>
                        Total Amount (Required) : ${d.amount} <br>
                        <br>
                        Created Date : ${d.created} <br>
                        Closed Date : ${d.closed} <br>
                        Last Modified Date : ${d.lastModified} <br>
                        <br>
                `)
            })
            .on("mouseout", function (d) {
                tooltip.style("display", "none")
            });

        var area2 = d3.area()
            .curve(d3.curveMonotoneX)
            .x(function (d) {
                return x2(d.startdate);
            })
            .y0(height2)
            .y1(function (d) {
                return y2(d.price);
            });


        var context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

        // var data = priceData

        //   x.domain(d3.extent(data, function(d) { return d.date; }));
        //   y.domain([0, d3.max(data, function(d) { return d.price; })]);
        x2.domain(x.domain());
        y2.domain(y.domain());

        //   focus.append("path")
        //       .datum(data)
        //       .attr("class", "area")
        //       .attr("d", area);

        focus.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        focus.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis);

        context.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", area2);

        context.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis2);

        context.append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.move, x.range());




        function brushed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
            var s = d3.event.selection || x2.range();
            x.domain(s.map(x2.invert, x2));
            area.selectAll(".circle").attr("transform", rectTransform)
                .attr("width", function (d) {
                    return (x(d.enddate) - x(d.startdate))
                })
            //   focus.select(".focus").attr("d", focus);
            focus.select(".axis--x").call(xAxis);
            svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                .scale(width / (s[1] - s[0]))
                .translate(-s[0], 0));
        }

        function zoomed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
            var t = d3.event.transform;
            x.domain(t.rescaleX(x2).domain());
            area.selectAll(".circle").attr("transform", rectTransform)
                .attr("width", function (d) {
                    return (x(d.enddate) - x(d.startdate))
                })
            //   focus.select(".area").attr("d", area);
            focus.select(".axis--x").call(xAxis);
            context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
        }

        function removeDuplicates(arr) {
            return arr.filter((item,
                index) => arr.indexOf(item) === index);
        }

        let mids = removeDuplicates(reducer.map(d => d['sageCRMid']))
        console.log("mids ", mids)

        var dropDown = d3.select(".dropdown")
        var options = dropDown.selectAll("option")
            .data(() => mids)

            .enter()
            .append("option")

        options.text((d) => d)
            .attr("value", (d) => d)
        svg.attr('transform', 'translate(0,50)')

        // console.log("svg sel2 ", svg.selectAll('g').remove())
    }

    // console.log("jq ", )

    $('.js-example-basic-multiple').on("change", function (ev) {
        console.log("jq ", $('.js-example-basic-multiple').val())

        svg.selectAll('g').remove()
        // removeChart();
        reDraw($('.js-example-basic-multiple').val());
    })

    $('.js-example-basic-multiple')
    // console.log("jq ", $('#dropdown'))

    

    /* $(document).ready(function () {
        reDraw();
    }); */
    reDraw();
    
    // dropDown.on("change", getSelectedValues)

    /* d3.select(".dropdown")
        .attr("transform", "translate(0,-100)") */
})