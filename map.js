mapboxgl.accessToken = 'pk.eyJ1IjoiampqaWlhMTIzIiwiYSI6ImNpbDQ0Z2s1OTN1N3R1eWtzNTVrd29lMDIifQ.gSWjNbBSpIFzDXU2X5YCiQ'
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/jjjiia123/cj5cgt8sl03uc2snzmbkc7n4r',
    center: [-71.089601,42.361491],
    zoom:19,  
    maxZoom:20,
   // minZoom:19.5,
})

mapDraw();
    
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
      svg.append("circle").attr("cx",point[0]).attr("cy",point[1]).attr("r",10).attr("opacity",.5)
      
    }
  
    
    for(var m in mtrees){
      var lat = mtrees[m][1]
      var lng = mtrees[m][0]
      var point = projectPoint(lng, lat)
      var r = Math.random()*20+20
      svg.append("circle").attr("cx",point[0]).attr("cy",point[1]).attr("r",r).attr("opacity",1).attr("fill","#FB5151")
    }
    for(var l in ltrees){
      var lat = ltrees[l][1]
      var lng = ltrees[l][0]
      var point = projectPoint(lng, lat)
      var r = Math.random()*20+40
      svg.append("circle").attr("cx",point[0]).attr("cy",point[1]).attr("r",r).attr("opacity",1).attr("fill","#FB5151")
    }
    for(var s in strees){
      var lat = strees[s][1]
      var lng = strees[s][0]
      var point = projectPoint(lng, lat)
      var r = Math.random()*5+10
      svg.append("circle").attr("cx",point[0]).attr("cy",point[1]).attr("r",r).attr("opacity",1).attr("fill","#FB5151")
    }
//    map.on('click', function (e) {
//      //console.log(e.lngLat)
//   //   console.log(e.point)
//      latLngsPub .push([e.lngLat.lng, e.lngLat.lat])
//      console.log([e.lngLat.lng, e.lngLat.lat])
//      var point = projectPoint(e.lngLat.lng, e.lngLat.lat)
//      svg.append("circle").attr("cx",point[0]).attr("cy",point[1]).attr("r",20).attr("fill","green").attr("opacity",.5)
//    });
    
  }
