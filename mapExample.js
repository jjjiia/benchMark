    mapDraw();
    
    
function mapDraw(){    
    //mapboxgs トークン
mapboxgl.accessToken = 'pk.eyJ1IjoiampqaWlhMTIzIiwiYSI6ImNpbDQ0Z2s1OTN1N3R1eWtzNTVrd29lMDIifQ.gSWjNbBSpIFzDXU2X5YCiQ'
        
    //Setup mapbox-gl map
    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/jjjiia123/cj5cgt8sl03uc2snzmbkc7n4r',
        center: [-71.089601,42.361491],
        zoom: 17,  
    })
    
    map.addControl(new mapboxgl.Navigation());
    
    // svg要素をアペンドする
    var container = map.getCanvasContainer()
    var svg = d3.select(container).append("svg").attr("width",500).attr("height",500)

 
        svg.append("circle").attr("cx",120).attr("cy",40).attr("r",10).attr("opacity",.5)
    
	function projectPoint(lon, lat) {
        var point = map.project(new mapboxgl.LngLat(lon, lat));
		this.stream.point(point.x, point.y);
	}
     
    
}