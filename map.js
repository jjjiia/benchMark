mapboxgl.accessToken = 'pk.eyJ1IjoiampqaWlhMTIzIiwiYSI6ImNpbDQ0Z2s1OTN1N3R1eWtzNTVrd29lMDIifQ.gSWjNbBSpIFzDXU2X5YCiQ'
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/jjjiia123/cj5cgt8sl03uc2snzmbkc7n4r',
    center: [-71.08944,42.36153],
    zoom:21,  
    //maxZoom:20,
//    minZoom:18,
    interactive: false
    
})

d3.select("#chart").append("div").style("width","44px").html("play").attr("class","playButton")
    .style("background-color","#FB5151")
    .style("color","#fff")
    .style("border-radius","5px")
    .style("padding","5px")
    .style("margin","10px")
    .style("text-align","center")

    .style("cursor", "pointer"); 

d3.select("#chart").append("div").style("width","44px").html("stop").attr("class","stopButton")
    .style("background-color","#FB5151")
    .style("color","#fff")
    .style("border-radius","5px")
    .style("padding","5px")
    .style("margin","10px")
    .style("text-align","center")
    .style("cursor", "pointer")
    .style("display","none"); 

var days = ["20170728","20170802","20170803","20170804","20170806"]
var weatherCondition = {"20170728":"partlyCloudy","20170802":"rain","20170803":"partlyCloudy","20170804":"clear","20170806":"partlyCloudy"}
var weatherDegrees = {"20170728":74,"20170802":75,"20170803":75,"20170804":61,"20170806":71}
var day1 = "20170728"
var config = {
    timer:null,
    index:null,
    start:null,
    day:day1
}
setupQueue(day1)

for(var d in days){
    var day = days[d]
    var iconLink = "<img src=\""+weatherCondition[day]+".png\" alt=\""+weatherCondition[day]+" width=\"80\">"
    d3.select("#days").append("div").html(day+"<br/>"+weatherDegrees[day]+" &#176 F<br/>"+ iconLink)
        .attr("class","_"+day).style("width","100px").style("height","100px").style("display","inline-block")
        .style("text-align","center")
        .style("border-left","1px solid #FB5151")
        .style("border-right","1px solid #FB5151")
        .style("padding","2px").attr("class","_"+day)
        .style("cursor", "pointer")
        .on("click",function(){
            d3.select(".stopButton").style("display","none")
            d3.select(".playButton").style("display","block")
            d3.selectAll("#days div").style("background-color","#fff")//.style("background-color","#FB5151").style("color","#fff")
            d3.select(this).style("background-color","#f9c7c7")
            var currentDay = d3.select(this).attr("class").replace("_","")
            d3.select(".day_svg").remove()
            d3.select(".playBar").attr("x",70)
            config.day = currentDay
            config.index = null
            clearInterval(config.timer)
            
            setupQueue(currentDay)
        })
   // .style("border-top","1px solid #FB5151")
    //setupQueue(day)
}
//d3.select("._"+day1).style("font-family","gothamM")

function setupQueue(day){
    var benches = [1,2,3,4,5,6]
    var folder = "data/"+day+"/"
    var files = []
    for(var i in benches){
        var path = folder+day+"-"+benches[i]+"-cohesion.csv"
        files.push(path)
    }
    
 //   var hereFile = "data/tract_geojson_withData/"+pub.tract+".json"
    var q = d3.queue();  
 //   var neighbors = (pub.tract+","+pub.neighbors).split(",")
    for(var j in files){
        q=q.defer(d3.csv, files[j])
    }
    q.await(loadData);
}
function loadData(error){
    if(error) { console.log(error); }
    var data = {}
    
    for (var i = 1; i < arguments.length; i++) {
        data[i]=arguments[i]
         //  console.log(arguments[i])
      }
      setupChart(data)
      return data
}
function convertToSeconds(timeStamp){
  //  console.log(timeStamp)
    var tl = timeStamp.split(":")
    return parseInt(tl[0])*60*60+parseInt(tl[1])*60+parseInt(tl[2])
}

function setupChart(data){
//    console.log(data)
    var barWidth = 10
    var width = 500
    var height = barWidth*2*6
    var margin = 20
    var svg = d3.select("#chart").append("div").attr("class",day+" day_svg").append("svg").attr("width",width).attr("height",height)
    var minMax = getMaxMin(data)
    var tScale = d3.scaleLinear().domain([minMax[0],minMax[1]]).range([3,width])
    var xAxis = d3.axisBottom(tScale).ticks(8).tickSize(height)
        .tickFormat(function(d){
            var h = parseInt(d/60/60)
            var m = String(parseInt((d-h*60*60)/60))
            if(m.length==1){
                m = "0"+String(m)
            }
            var s = String(d-h*60*60-m*60)
            if(s.length==1){
                s = "0"+String(s)
            }
            return h+":"+m+":"+s
        })
    var axis = svg.append("g")
        .attr("transform","translate("+margin*4+","+0+")")   
        .attr("class","axis")
        .call(xAxis)    
    axis.select(".domain").remove()
    drawPlayBar(minMax)
    d3.select(".playButton").on("click",function(){
        playBar(data,minMax)
 //       console.log(config.start)
        d3.select(".playButton").style("display","none")
        d3.select(".stopButton").style("display","block")
    })
    d3.select(".stopButton").on("click",function(){
        clearInterval(config.timer)
        d3.select(".stopButton").style("display","none")
        d3.select(".playButton").style("display","block")
    })    
    for(var d in data){
        drawBenchChart(data[d],minMax,d)
    }   
}

function playBar(data,minMax,start){
    var formatted = formatByTime(data,minMax)

    var min = minMax[0]
    var max = minMax[1]
    if(config.index == null){
        config.index = min
    }else{
        config.index = config.start
    }

    config.timer = setInterval(function() {
     //   console.log(formatted[index])
        var tScale = d3.scaleLinear().domain([minMax[0],minMax[1]]).range([3,500])
        d3.select(".playBar").attr("x",tScale(config.start)+60)
        if(config.index>max){
            clearInterval(config.timer)
            config.start = min
            config.index = min
            d3.select(".playBar").attr("x",tScale(config.start)+70)
        d3.select(".stopButton").style("display","none")
        d3.select(".playButton").style("display","block")
        }
        var ids = formatted[config.start]
        for(var j in ids){
            ripple("_"+ids[j])
        }
       
        config.start=config.index
        config.start+=60
        config.index+=60
    },100)
    
    
    
}

function formatByTime(data,minMax){
    var formattedData = {}
    var interval = 60
    var width = 500
    var tScale = d3.scaleLinear().domain([minMax[0],minMax[1]]).range([3,width])
    
    for(var t = minMax[0]; t < minMax[1]; t+=interval){
        formattedData[t]=[]
        for(var i in data){
            var bench = data[i]
            var id = i
            for(var j in bench){
                if(j !="columns"){
                var entry = bench[j]
                var start = convertToSeconds(entry.start)
                var end = convertToSeconds(entry.end)
                    //console.log([t,end,start])
                if(t <= end+interval && t>=start-interval){
                    formattedData[t].push(i)
                }
            }
            }
        }
        //console.log(formattedData[t])
    }
    return formattedData
}
function drawPlayBar(minMax){
        var tScale = d3.scaleLinear().domain([minMax[0],minMax[1]]).range([3,500])
    
        d3.select("#chart svg").append("rect").attr("x",tScale(minMax[0])+80-10)
        .attr("y",0).attr("width",20).attr("height",120).attr("class","playBar").attr("fill","#FB5151")
        .attr("opacity",.2)
}
function getMaxMin(data){
    var min = 9999999999999999
    var max = 0
    for(var i in data){
        var dayData = data[i]
        if(dayData.length>1){
            for(var j in dayData){
                var benchData = dayData[j]
                if(benchData.start!=undefined && benchData.end!=undefined){
                    if(j!="columns"){
                        var startTime = convertToSeconds(benchData.start)
                        var endTime = convertToSeconds(benchData.end)
                        if(min > startTime){min = startTime}
                        if(max<endTime){max = endTime}
                    }
                }
            }
        }
    }
    return [min,max]
}

function  drawBenchChart(data,minMax,index){
    console.log(data)
    var colors =["#af9030","#e7902f","#d0864e","#d56d1f","#e4b36f","#d6bd34"]
    var barWidth = 10
    var width = 500
    var height = barWidth*2*7
    var tScale = d3.scaleLinear().domain([minMax[0],minMax[1]]).range([0,width])
    var svg = d3.select("#chart svg").append("g")
    var margin = 20
    var xAxis = d3.axisBottom(tScale).ticks(5).tickSize(margin*1.5)
    svg.append("text").text("bench "+index).attr("x",10).attr("y",barWidth*1.5*index+barWidth).attr("fill",colors[index-1])
    
    svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("height",barWidth)
    .attr("y",function(d,i){
        return barWidth*1.5*index
    })
    .attr("opacity",.5)
    .attr("class","_"+index)
    .attr("fill",colors[index-1])
    .attr("x",function(d,i){
        var startTime = convertToSeconds(d.start)
        return tScale(startTime)
    })
    .attr("width",function(d,i){
        var startTime = tScale(convertToSeconds(d.start))
        var endTime = tScale(convertToSeconds(d.end))
        var duration = endTime-startTime
        if(duration <3){duration = 3}
            return duration
    })
        .attr("transform","translate("+margin*4+","+0+")")   
    
}

mapDraw();

function ripple(id){
  //  console.log("ripple "+id)
    function projectPoint(lon, lat) {
        var point = map.project(new mapboxgl.LngLat(lon, lat));
    	return [point.x, point.y];
    }
      var lat = benches[id][0]
      var lng = benches[id][1]
      var point = projectPoint(lng, lat)
    var svg = d3.select("#map svg")
      svg.append("circle")
        .attr("opacity",.1)
        .attr("cx",point[0]).attr("cy",point[1])
        .attr("r",12)//.attr("opacity",.5)
        .attr("fill","#FB5151")//.attr("fill","none")
        //.attr("stroke-width",2)
        .attr("class",id)
        .transition()
        .duration(100)
        .attr("opacity",0)
        .duration(1500)
        .attr("r",100)
        .remove()

}

function mapDraw(){    
   // map.addControl(new mapboxgl.Navigation());
    var container = map.getCanvasContainer()
   console.log(container)
    var svg = d3.select(container).append("svg")
    function projectPoint(lon, lat) {
        var point = map.project(new mapboxgl.LngLat(lon, lat));
    	return [point.x, point.y];
    }
    d3.select(".mapboxgl-ctrl-bottom-right").remove()
	//var transform = d3.transform({point: projectPoint});
    
    
    //    map.on("viewreset", function(){
    //        console.log("moved")
    //        d3.selectAll("circle").attr("fill","red")
    //    })
    //    map.on("movestart", function(){
    //        console.log("moved")
    //        var benchList = d3.selectAll("circle")["_groups"][0]
    //        
    //        for(var k in benchList){
    //            var id = benchList[k].id
    //              var lat = benches[id][0]
    //              var lng = benches[id][1]
    //              var point = projectPoint(lng, lat)
    //            d3.selectAll("circle").transition().duration(10).attr("cx",point[0]).attr("cy",point[1])
    //        }
    //       
    //    })
    
    var places = svg.selectAll("circle")
        .data(Object.keys(benches))
        .enter()
        .append("circle")
          .attr("cy",function(d){
              var coords = benches[d]
              var point = projectPoint(coords[1],coords[0])
              return point[1]
          })
          .attr("cx",function(d){
              var coords = benches[d]
              var point = projectPoint(coords[1],coords[0])
              return point[0]
          })
          .attr("r",12)//.attr("opacity",.5)
          .attr("stroke","#FB5151").attr("fill","#fff").attr("fill-opacity",.5)
          .attr("stroke-width",2)
          .attr("class",function(d){return d})
          .on("mouseover",function(){
              var id = d3.select(this).attr("class")
              ripple(id)
              d3.select(this).style("cursor", "pointer"); 
          })
    svg.selectAll("text")
        .data(Object.keys(benches))
        .enter()
        .append("text")
          .attr("y",function(d){
              var coords = benches[d]
              var point = projectPoint(coords[1],coords[0])
              return point[1]+4
          })
          .attr("x",function(d){
              var coords = benches[d]
              var point = projectPoint(coords[1],coords[0])
              return point[0]
          })
          .attr("text-anchor","middle")
          .text(function(d){
              return d.replace("_","")
          })
          .attr("class",function(d){return d})
          .attr("fill","#FB5151")
          .on("mouseover",function(){
              var id = d3.select(this).attr("class")
           //   ripple(id)
              d3.select(this).style("cursor", "pointer"); 
          })  
          
      	var transform = d3.geoTransform({point: projectPoint});
          //var circles = d3.svg.projection(transform)
          
          function update() {
                 d3.selectAll("circle")
                    .data(Object.keys(benches))
                    .enter()
                    .attr("cy",function(d){
                      var coords = benches[d]
                      var point = projectPoint(coords[1],coords[0])
                      console,log(d)
                      return point[1]+4
                    })
                    .attr("cx",function(d){
                      var coords = benches[d]
                      var point = projectPoint(coords[1],coords[0])
                      return point[0]
                    })
              }
              map.on("viewreset", update)
              map.on("movestart", function(){
          		svg.classed("hidden", true);
          	});	
              map.on("rotate", function(){
          		svg.classed("hidden", true);
          	});	
              map.on("moveend", function(){
          		update()
          		svg.classed("hidden", false);
          	})
    
              //初期レンダリング
      //        update()
    
    //    for(var m in mtrees){
    //      var lat = mtrees[m][1]
    //      var lng = mtrees[m][0]
    //      var point = projectPoint(lng, lat)
    //      var r = Math.random()*5+10
    //      svg.append("circle").attr("cx",point[0]).attr("cy",point[1]).attr("r",r).attr("opacity",1).attr("fill","#FB5151")
    //    }
    //    for(var l in ltrees){
    //      var lat = ltrees[l][1]
    //      var lng = ltrees[l][0]
    //      var point = projectPoint(lng, lat)
    //      var r = Math.random()*2+12
    //      svg.append("circle").attr("cx",point[0]).attr("cy",point[1]).attr("r",r).attr("opacity",1).attr("fill","#FB5151")
    //    }
    //    for(var s in strees){
    //      var lat = strees[s][1]
    //      var lng = strees[s][0]
    //      var point = projectPoint(lng, lat)
    //      var r = Math.random()*8+10
    //      svg.append("circle").attr("cx",point[0]).attr("cy",point[1]).attr("r",r).attr("opacity",1).attr("fill","#FB5151")
    //    }
    
    //THIS IS FOR PLACING TREES
    //    map.on('click', function (e) {
    //      //console.log(e.lngLat)
    //   //   console.log(e.point)
    //      latLngsPub .push([e.lngLat.lng, e.lngLat.lat])
    //      console.log([e.lngLat.lng, e.lngLat.lat])
    //      var point = projectPoint(e.lngLat.lng, e.lngLat.lat)
    //      svg.append("circle").attr("cx",point[0]).attr("cy",point[1]).attr("r",20).attr("fill","green").attr("opacity",.5)
    //    });
    
}
