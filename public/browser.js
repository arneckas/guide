require([
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/Search",
], function(Map, MapView, Search) {

  var map = new Map({
    basemap: "topo-vector"
  });
  
  var view = new MapView({
    container: "mapsas",
    map: map,
    center: [25.284, 54.635],
    zoom: 10
  });
  var search = new Search({
    view: view
  });

document.addEventListener('click' , function(e){
    //delete
    if (e.target.classList.contains('delete-me')){
        if(confirm('Are you sure?'))
        {
            axios.post('/delete-item', {id: e.target.getAttribute('data-id')}).then(function(){
                e.target.parentElement.parentElement.remove()
        }).catch(function(){
              console.log("lllll")
          })
        }
    }
    if (e.target.classList.contains('show-me')){
      let temp = e.target.getAttribute('data-title');
      search.search(temp).then(function(resolvedVal){
      }, function(error){
      });
    }
});

function itemTemplate(item){
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
      <button data-id= '${item._id}' class="show-me btn btn-secondary btn-sm mr-1" data-title='${item.text}'>View</button>
      <button data-id= '${item._id}'class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>`
}

//initial page 
ourHTML = items.map(function(item){
  return itemTemplate(item)
}).join('')
document.getElementById('item-list').insertAdjacentHTML('beforeend', ourHTML)

//create
let createField = document.getElementById('create-field')
document.getElementById('create-form').addEventListener('submit',function(e){
    e.preventDefault()
    axios.post('/create-item', {text:createField.value}).then(function(response){
        document.getElementById('item-list').insertAdjacentHTML('beforeend', itemTemplate(response.data))
        createField.value=""
        createField.focus()
    }).catch(function(){
      console.log("lllll")
  })
})
                   
                      
                      
                      //*** Add div element to show coordates ***//
                      var coordsWidget = document.createElement("div");
                      coordsWidget.id = "coordsWidget";
                      coordsWidget.className = "esri-widget esri-component";
                      coordsWidget.style.padding = "7px 15px 5px";
                      view.ui.add(coordsWidget, "bottom-right");
                
                      //*** Update lat, lon, zoom and scale ***//
                      function showCoordinates(pt) {
                        var coords = "Latitude/Longtitude " + pt.latitude.toFixed(3) + " " + pt.longitude.toFixed(3) + 
                            " | Scale 1:" + Math.round(view.scale * 1) / 1 +
                            " | Zoom " + view.zoom;
                        coordsWidget.innerHTML = coords;
                      }
                      
                      //*** Add event and show center coordinates after the view is finished moving e.g. zoom, pan ***//
                      view.watch(["stationary"], function() {
                        showCoordinates(view.center);
                      });
                
                      //*** Add event to show mouse coordinates on click and move ***//
                      view.on(["pointer-down","pointer-move"], function(evt) {
                        showCoordinates(view.toMap({ x: evt.x, y: evt.y }));
                      });
                      
                
                      
                    });


