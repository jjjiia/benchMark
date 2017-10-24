mapboxgl.accessToken = 'pk.eyJ1IjoiampqaWlhMTIzIiwiYSI6ImNpbDQ0Z2s1OTN1N3R1eWtzNTVrd29lMDIifQ.gSWjNbBSpIFzDXU2X5YCiQ'
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/jjjiia123/cj5cgt8sl03uc2snzmbkc7n4r',
    center: [-71.08955,42.36153],
    zoom:20,  
    //maxZoom:20,
   // minZoom:19.5,
    interactive: false
    
})
var days = ["20170728","20170802","20170803","20170804","20170806"]
mapDraw();
function ripple(id){
    function projectPoint(lon, lat) {
        var point = map.project(new mapboxgl.LngLat(lon, lat));
    	return [point.x, point.y];
    }
      var lat = benches[id][0]
      var lng = benches[id][1]
      var point = projectPoint(lng, lat)
    var svg = d3.select("#map svg")
      svg.append("circle")
        .attr("opacity",1)
        .attr("cx",point[0]).attr("cy",point[1])
        .attr("r",12)//.attr("opacity",.5)
        .attr("stroke","#FB5151").attr("fill","none")
        .attr("stroke-width",2).attr("class",id)
        .transition()
        .duration(1000)
        .attr("r",40)
        .attr("opacity",0)
      svg.append("circle")
        .attr("opacity",1)
        .attr("cx",point[0]).attr("cy",point[1])
        .attr("r",12)//.attr("opacity",.5)
        .attr("stroke","#FB5151").attr("fill","none")
        .attr("stroke-width",2).attr("class",id)
        .transition()
        .delay(500)
        .duration(1000)
        .attr("r",40)
        .attr("opacity",0)
}

function drawCharts(day){
    
}

function mapDraw(){    
   // map.addControl(new mapboxgl.Navigation());
    var container = map.getCanvasContainer()
    var svg = d3.select(container).append("svg")
    function projectPoint(lon, lat) {
        var point = map.project(new mapboxgl.LngLat(lon, lat));
    	return [point.x, point.y];
    }
    
    for(var b in benches){
      var lat = benches[b][0]
      var lng = benches[b][1]
      var point = projectPoint(lng, lat)
      svg.append("circle")
        .attr("cx",point[0]).attr("cy",point[1])
        .attr("r",12)//.attr("opacity",.5)
        .attr("stroke","#FB5151").attr("fill","#fff").attr("fill-opacity",0)
        .attr("stroke-width",2).attr("class",b)
        .on("mouseover",function(){
            var id = d3.select(this).attr("class")
            ripple(id)
            d3.select(this).style("cursor", "pointer"); 
            
        })
      svg.append("text").text(b.replace("_","")).attr("y",point[1]+4).attr("x",point[0]).attr("class",b)
        .attr("text-anchor","middle").attr("fill","#FB5151").on("mouseover",function(){
            var id = d3.select(this).attr("class")
            ripple(id)
            d3.select(this).style("cursor", "pointer"); 
            
        })
    }
    
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
