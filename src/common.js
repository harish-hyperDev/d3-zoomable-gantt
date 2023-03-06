var w = window.innerWidth - 135;
var h = 200;


d3.csv("../data/SampleData_harish.csv", function (data) {

  let check = Object.assign({}, data[0])

  check["Created Date"] = "01/01/2023"
  check["Close Date"] = "05/02/2023"
  check["Account Name"] = "Test"

  // data = [data[0],  check, data[1], data[100], data[3], data[4], data[6]]

  data = [...data.slice(0, 60), check]

  // Used SageCRMid instead of type

  var dateFormat = d3.timeParse("%d/%m/%Y");



  var timeScale = d3.scaleTime()
    /* .domain([d3.min(taskArray, function (d) { ,
    d3.max(taskArray, function (d) { return dateFormat(d.startTime); })])f
    d3.max(taskArray, function (d) { return dateFormat(d.endTime); })]) */
    .domain([
      d3.min(data, function (d) { return dateFormat(d["Created Date"]); }),
      d3.max(data, function (d) { return dateFormat(d["Close Date"]); })
    ])
    .range([0, w - 10]);



  /* var yScale = d3.scaleBand()
    .domain(data.map(function (entry) {
      return entry.sageCRMid;
    }))
    .rangeRound([h, 0]) */

  var categories = new Array();

  for (var i = 0; i < data.length; i++) {
    categories.push(data[i]["SageCRMid"]);
  }

  var catsUnfiltered = categories; // for vert labels

  categories = checkUnique(categories);
  console.log("length ",  categories.length)


  // checking with one category first
  // categories = [categories[0], categories[1], categories[2]]



  /* var title = svg.append("text")
                    .text("Gantt Chart Process")
                    .attr("x", w / 2)
                    .attr("y", 25)
                    .attr("text-anchor", "middle")
                    .attr("font-size", 18)
                    .attr("fill", "#009FFC"); 
  */



  function makeGant(tasks, pageWidth, pageHeight, gantChartLabel, gantChartIndex) {

    var barHeight = 10;
    var gap = barHeight + 4;
    var topPadding = 75;
    var sidePadding = 100;

    console.log("page width ", pageWidth)
    var colorScale = d3.scaleLinear()
      .domain([0, categories.length])
      .range(["#00B9FA", "#F95002"])
      .interpolate(d3.interpolateHcl);

    

    makeGrid(sidePadding, topPadding, pageWidth, pageHeight);
    drawRects(tasks, gap, topPadding, sidePadding, barHeight, colorScale, pageWidth, pageHeight, gantChartIndex);
    vertLabels(gap, topPadding, sidePadding, barHeight, colorScale, gantChartLabel);



  }


  function drawRects(theArray, theGap, theTopPad, theSidePad, theBarHeight, theColorScale, w, h, gantChartIndex) {

    var bigRects = svg.append("g")
      .selectAll("rect")
      .data(theArray)
      .enter()
      .append("rect")

      .attr("x", 0)
      .attr("y", function (d, i) {

        return i * theGap + theTopPad - 2;
      })
      .attr("width", function (d) {
        // return 2500;
        // return w - theSidePad / 2;
        return w - 100;
      })


      .attr("height", theGap)
      .attr("stroke", "none")
      .attr("fill", function (d) {
        /* for (var i = 0; i < categories.length; i++) {
          if (d.type == categories[i]) {
            return d3.rgb(theColorScale(i));
          }
        } */

        return "#fff";
      })
      .attr("opacity", 0);  // the opacity of rect bar itself (like there's opacity on left and right side of bar, so modified the opactity to 0 in this line)


    var rectangles = svg.append('g')
      .selectAll("rect")
      .data(theArray)
      .enter();


    var innerRects = rectangles.append("rect")
      .attr("class", `rect${gantChartIndex}`)
      .attr("rx", 3)
      .attr("ry", 3)
      .attr("x", function (d) {
        // return timeScale(dateFormat.parse(d.startTime)) + theSidePad;
        return timeScale(dateFormat(d["Created Date"]));
      })
      .attr("y", function (d, i) {
        return i * theGap + theTopPad;
      })


      // issue with the width here
      .attr("width", function (d) {
        // return (timeScale(dateFormat.parse(d.endTime)) - timeScale(dateFormat.parse(d.startTime)));


        return (timeScale(dateFormat(d["Close Date"])) - timeScale(dateFormat(d["Created Date"])));
      })
      .attr("height", theBarHeight)
      .attr("stroke", "none")
      .attr("fill", function (d) {
        for (var i = 0; i < categories.length; i++) {
          if (d["SageCRMid"] == categories[i]) {
            return d3.rgb(theColorScale(i));
          }
        }
      })


    // Text to appear on rects 
    var rectText = rectangles.append("text")
      // (not displaying the text for now)

      /* .text(function (d) {
        return d["Account Name"];
      }) */

      // anyway it's just x for text, as the text is commmented, the below code doesn't matter.
      .attr("x", function (d) {
        // return (timeScale(dateFormat.parse(d.endTime)) - timeScale(dateFormat.parse(d.startTime))) / 2 + timeScale(dateFormat.parse(d.startTime)) + theSidePad;
        // return (timeScale(dateFormat(d["Close Date"])) - timeScale(dateFormat(d["Created Date"]))) / 2 + timeScale(dateFormat(d["Created Date"])) + theSidePad;  // working fine
        return (timeScale(dateFormat(d["Close Date"])) - timeScale(dateFormat(d["Created Date"]))) / 2 + timeScale(dateFormat(d["Created Date"]));
      })
      .attr("y", function (d, i) {
        return i * theGap + 14 + theTopPad;
      })
      .attr("class", `text${gantChartIndex}`)
      .attr("font-size", 11)
      .attr("text-anchor", "middle")
      .attr("text-height", theBarHeight)
      .attr("fill", "#fff");

    d3.select(`.gantt${gantChartIndex}`)
      .append("div")
      .attr("id", `tag${gantChartIndex}`)
      .attr("class", "tooltip")

    $(`.text${gantChartIndex}`).mouseover(function () {
      var tag = "";

      if (d3.select(this).data()[0].details != undefined) {
        tag = "Account Name: " + d3.select(this).data()[0]["Account Name"] + "<br/>" +
          "SageCRMid: " + d3.select(this).data()[0]["SageCRMid"] + "<br/>" +
          "Created: " + d3.select(this).data()[0]["Created Date"] + "<br/>" +
          "Closed: " + d3.select(this).data()[0]["Close Date"] + "<br/>" +
          "Details: " + d3.select(this).data()[0].details;
      } else {
        tag = "Account Name: " + d3.select(this).data()[0]["Account Name"] + "<br/>" +
          "Type: " + d3.select(this).data()[0]["SageCRMid"] + "<br/>" +
          "Created: " + d3.select(this).data()[0]["Created Date"] + "<br/>" +
          "Closed: " + d3.select(this).data()[0]["Close Date"];
      }

      var output = document.getElementById(`tag${gantChartIndex}`);

      var x = this.x.animVal.getItem(this) + "px";
      var y = d3.event.pageY - 10 + "px"

      output.innerHTML = tag;
      output.style.top = y;
      output.style.left = x;
      output.style.visibility = "visible"
    })

    $(`.text${gantChartIndex}`).mouseout(function () {
      var output = document.getElementById(`tag${gantChartIndex}`);
      output.style.visibility = "hidden"
    })

    rectText.on('mouseover', function (e) {
      var tag = "";

      if (d3.select(this).data()[0].details != undefined) {
        tag = "Account Name: " + d3.select(this).data()[0]["Account Name"] + "<br/>" +
          "SageCRMid: " + d3.select(this).data()[0]["SageCRMid"] + "<br/>" +
          "Created: " + d3.select(this).data()[0]["Created Date"] + "<br/>" +
          "Closed: " + d3.select(this).data()[0]["Close Date"] + "<br/>" +
          "Details: " + d3.select(this).data()[0].details;
      } else {
        tag = "Account Name: " + d3.select(this).data()[0]["Account Name"] + "<br/>" +
          "Type: " + d3.select(this).data()[0]["SageCRMid"] + "<br/>" +
          "Created: " + d3.select(this).data()[0]["Created Date"] + "<br/>" +
          "Closed: " + d3.select(this).data()[0]["Close Date"];
      }

      var output = document.getElementById(`tag${gantChartIndex}`);

      var x = this.x.animVal.getItem(this) + "px";
      var y = d3.event.pageY - 10 + "px"

      output.innerHTML = tag;
      output.style.top = y;
      output.style.left = x;
      output.style.visibility = "visible"


    }).on('mouseout', function () {
      var output = document.getElementById(`tag${gantChartIndex}`);
      output.style.visibility = "hidden"
    });


    innerRects.on('mouseover', function (e) {
      //
      var tag = "";
      // 

      if (d3.select(this).data()[0].details != undefined) {
        tag = "Account Name: " + d3.select(this).data()[0]["Account Name"] + "<br/>" +
          "SageCRMid: " + d3.select(this).data()[0]["SageCRMid"] + "<br/>" +
          "Created: " + d3.select(this).data()[0]["Created Date"] + "<br/>" +
          "Closed: " + d3.select(this).data()[0]["Close Date"] + "<br/>" +
          "Details: " + d3.select(this).data()[0].details;
      } else {
        tag = "Account Name: " + d3.select(this).data()[0]["Account Name"] + "<br/>" +
          "SageCRMid: " + d3.select(this).data()[0]["SageCRMid"] + "<br/>" +
          "Created: " + d3.select(this).data()[0]["Created Date"] + "<br/>" +
          "Closed: " + d3.select(this).data()[0]["Close Date"];
      }
      var output = document.getElementById(`tag${gantChartIndex}`);

      var x = (this.x.animVal.value + this.width.animVal.value / 2) + "px";
      var y = d3.event.pageY - 10 + "px"

      output.innerHTML = tag;
      output.style.top = y;
      output.style.left = x;
      output.style.visibility = "visible";
    }).on('mouseout', function () {
      var output = document.getElementById(`tag${gantChartIndex}`);
      output.style.visibility = "hidden"
    });



  }

  // https://codepen.io/jey/details/nOEeME

  function makeGrid(theSidePad, theTopPad, w, h) {

    var xAxis = d3.axisBottom()
      .scale(timeScale)
      .ticks(d3.timeDay.filter(d => d3.timeDay.count(0, d) % 10 === 0))    // use d3.timeDay for diff. in days
      .tickSize(-h + theTopPad + 20, 0, 0)
      .tickFormat(d3.timeFormat('%d %b'));

    // var yAxis = d3.axisLeft(yScale)


    // the bottom grid x-axis
    var grid = svg.append('g')
      .attr('class', 'grid')
      // .attr('transform', 'translate(' + theSidePad + ', ' + (h - 25) + ')')
      .attr('transform', 'translate(' + 0 + ', ' + (h - 25) + ')')
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "middle")
      .attr("fill", "#000")
      .attr("stroke", "none")
      .attr("font-size", 10)
      .attr("dy", "1em");

    /* var yGrid = svg.append('g')
      .attr('class', 'y--axis')
      .attr('transform', `translate(0,20)`)
      .call(yAxis) */
  }

  function vertLabels(theGap, theTopPad, theSidePad, theBarHeight, theColorScale, theGantChartLabel) {
    var numOccurances = new Array();
    var prevGap = 0;

    // 

    for (var i = 0; i < categories.length; i++) {
      numOccurances[i] = [categories[i], getCount(categories[i], catsUnfiltered)];
    }

    // 



    // Text on left axis
    var axisText = svg.append("g") //without doing this, impossible to put grid lines behind text
      .selectAll("text")
      .data(numOccurances)
      .enter()
      .append("text")
      .text(function (d) {

        // return d[0];
        return theGantChartLabel
      })
      .attr("x", 10)

      // gaps between rects
      .attr("y", (d) => { return 1 * theGap / 2 + theTopPad - 30 })
      .attr("font-size", 17)
      .attr("text-anchor", "start")
      .attr("text-height", 14)

      // For coloring left axis label, no use with parameters now
      .attr("fill", function (d) {
        for (var i = 0; i < categories.length; i++) {
          if (theGantChartLabel == categories[i]) {
            return d3.rgb(theColorScale(i)).darker();
          }
        }
      });

  }

  //from this stackexchange question: http://stackoverflow.com/questions/1890203/unique-for-arrays-in-javascript
  function checkUnique(arr) {
    var hash = {}, result = [];
    for (var i = 0, l = arr.length; i < l; ++i) {
      if (!hash.hasOwnProperty(arr[i])) {   //it works with objects! in FF, at least
        hash[arr[i]] = true;
        result.push(arr[i]);
      }
    }
    return result;
  }

  //from this stackexchange question: http://stackoverflow.com/questions/14227981/count-how-many-strings-in-an-array-have-duplicates-in-the-same-array
  function getCounts(arr) {
    var i = arr.length, // var to loop over
      obj = {}; // obj to store results
    while (i) obj[arr[--i]] = (obj[arr[i]] || 0) + 1; // count occurrences
    return obj;
  }

  // get specific from everything
  function getCount(word, arr) {
    return getCounts(arr)[word] || 0;
  }


  var svg;


  for (let gantt_i = 0; gantt_i < categories.length; gantt_i++) {

    svg = d3.select(".svg")
      //.selectAll("svg")
      .append("div")
        .attr("class", `gantt${gantt_i}`)
        // .attr("class", "ganttt-div")
        // .style("border", "1px solid black")
        .style("box-shadow", "rgba(0, 0, 0, 0.35) 0px 5px 15px")   // box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        .style("margin", "10px")
        .style("margin-bottom","20px")
        .style("border-radius", "7px")
        .style("padding", "20px")
        .append("svg")
          .attr("width", w)
          .attr("height", h)
          .attr("class", `svg${gantt_i}`);


    let sequentialData = data.filter(d => d["SageCRMid"] === categories[gantt_i])


    makeGant(sequentialData, w, h, categories[gantt_i], gantt_i);
    // h = h + 20;

  }

  

})