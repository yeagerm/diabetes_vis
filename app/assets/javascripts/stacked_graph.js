var StackedGraphs= function(selector, width, height) {

  this.width = width || 120
  this.height = height || 60

  this.margin = {
    top: 10,
    right: 40,
    bottom: 10,
    left: 10
  }

  this.container = d3.select(selector)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height)

  this.y = d3.scale.linear()
      .domain([0, 1])
      .range([this.height - this.margin.bottom, this.margin.top])

  this.types = ["month", "week", "day"]

  this.x = d3.scale.ordinal()
      .domain(this.types)
      .rangePoints([this.margin.left, this.width - this.margin.right])

  this.ranges = ["low", "optimal", "high"]
}

StackedGraphs.prototype.update = function(data) {
  var that = this

  this.types.forEach(function(type) {
    this.ranges.forEach(function(range) {
      var selection = d3.select(".stack." + type + "." + range)
      var value = data[type][range]

      var start;
      if (range === "low")
        start = value
      else if (range === "optimal")
        start = value + data[type]["low"]
      else if (range === "high")
        start = value + data[type]["optimal"] + data[type]["low"]


      selection
        .transition()
        .duration(1000)
        .attr("x", 0)
        .attr("y", this.y(start))
        .attr("height", this.y(start - value) - this.y(start))
        .attr("width", (this.width - this.margin.left - this.margin.right) / 3)


    }.bind(this))
  }.bind(this))
}

StackedGraphs.prototype.render = function(data) {
  var that = this

  this.types.forEach(function(type) {
    this.container
        .append("svg")
        .attr("x", this.x(type))
        .attr("y", this.margin.top)
        .attr("class", "stacked" + type + " stacked")
    this.ranges.forEach(function(range) {
      var start;
      if (range === "low")
        start = data[type][range]
      else if (range === "optimal")
        start = data[type][range] + data[type]["low"]
      else if (range === "high")
        start = data[type][range] + data[type]["optimal"] + data[type]["low"]

      this.renderStack(type, range, data[type][range], start)
    }.bind(this))
  }.bind(this))
}

StackedGraphs.prototype.renderStack = function(type, range, value, start) {
  this.container
      .select(".stacked" + type)
      .append("rect")
      .attr("class", "stack " + type + " " + range)
      .attr("x", 0)
      .attr("y", this.y(start))
      .attr("height", this.y(start - value) - this.y(start))
      .attr("width", (this.width - this.margin.left - this.margin.right) / 3)
}

StackedGraphs.prototype.loadData = function(date_obj, callback) {
  if (!callback) {
    callback = this.render.bind(this)
  }
  d3.json("get_month_glucose_ratios?date="+date_obj.getFullYear()+"-"+(date_obj.getMonth() + 1)+"-"+date_obj.getDate(), function(data) {

    callback(data)
    /*d3.selectAll(".figure .percent").text("%")

    d3.selectAll(".figure").each(function(d) {
      var element = d3.select(this)
      var range = element.attr("range")
      var type = element.attr("type")
      var from = parseInt(element.select(".number").text())
      if (!from)
        from = 0
      $(this).find(".number").countTo({
        from: from,
        to: Math.round(100 * data[type][range], 1),
        speed: 500,
      })
    })
    */
  });
};

