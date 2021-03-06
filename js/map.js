
  // Welcome the user after they click the start button
  document.getElementById("start").onclick = function()
  {
    var utterText = "Welcome to vCity! Try saying Popular places, or show me waterfalls" ;
    var utterThis = new SpeechSynthesisUtterance(utterText);
    utterThis.pitch = 1.5;
    utterThis.rate = 1.2;
    synth.speak(utterThis);
  }

  document.getElementById("help").onclick = function()
  {
    var utterText = "Try saying, reset, or, clear map, to reset your screen or position." ;
    var utterThis = new SpeechSynthesisUtterance(utterText);
    utterThis.pitch = 1.5;
    utterThis.rate = 1.2;
    synth.speak(utterThis);
    home();
  }

  document.getElementById("details").onclick = function()
  {
    if (synth.speaking){
      synth.cancel();
      document.getElementById("details").textContent = "Read details";
    }
    else{
      var utterText = info;
      var utterThis = new SpeechSynthesisUtterance(utterText);

      utterThis.pitch = 1.5;
      utterThis.rate = 1.2;
      synth.speak(utterThis);
      if (synth.speaking){
        document.getElementById("details").textContent = "STOP";
      }

      // listens for when it is done reading
      utterThis.addEventListener('end', function(event){
        document.getElementById("details").textContent = "Read details";
      });
    }
  }

  // var read = false;
  var synth = window.speechSynthesis;

  var topic = "";

  // number of results (default)
  var limit = 7;
  var showMoreLimit = 10;

  var titles = [];
  var details = [];
  var info ="";

  function home(){
    document.getElementById("message").style.display = "block";
    document.getElementById("results").style.display = "none";
    document.getElementById("showDetails").style.display = "none";
  }

  function getTitles(){
    document.getElementById("message").style.display = "none";
    document.getElementById("results").style.display = "block";
    document.getElementById("showDetails").style.display = "block";
    document.getElementById("topic").textContent = topic.toLocaleUpperCase();
    for(i=0; i < limit; i++){
      var id = "title" + i.toString();
      document.getElementById(id).textContent = (i+1).toString() + ". " + titles[i];
    }

    for(i=limit; i < showMoreLimit; i++){
      var id = "title" + i.toString();
      document.getElementById(id).textContent = "";
    }
  }
  
  function getMoreTitles(){
    for(i=limit; i < showMoreLimit; i++){
      var id = "title" + i.toString();
      document.getElementById(id).textContent = (i+1).toString() + ". " + titles[i];
    }
  }

  function clear(){
    titles = [];
    details = [];
    document.getElementById("output").innerHTML = "";
    for (i = map.entities.getLength() - 1; i >= 0; i--) {
      var pushpin = map.entities.get(i);
      if (pushpin instanceof Microsoft.Maps.Pushpin) {
        map.entities.removeAt(i);
      }
    }
  }

  if (annyang) {

    // Commands are defined as keys and values in an object, the key is the 
    // text for the command, and the value is callback function (i.e. event 
    // handler) to call for the command
    var commands = {

      // If "information about X" is uttered, we show on the page "Here is some
      // information about X".  
      // "information about *place" :
      // function(place) 
      // {
      //   document.getElementById("output").innerHTML = 
      //     "Here is some information about " + place;
      // },

      "home":
      function(){
        home();
      },

      "details about *num" :
      function(num){
        info = titles[num-1] + " - " + details[num-1];
        document.getElementById("output").innerHTML = info;
      },

      // If "show firestations" or "show libraries" are uttered, the map will 
      // be populated with pushpins for firestations or libraries
      //
      // We use the firestations.js and libraries.js data above to do so, note 
      // that we know how to access the data structure be examining the data 
      // structure... so we can see for example that firestations.features 
      // contains an array of objects with firestation data, and we can see 
      // that firestations.features[i].properties contains latitude, longitude
      // and name data.  
      //
      // You could use a tool like this to help you visualize the data:
      //    http://jsonviewer.stack.hu/
      //
      "reset":
      function(){
        clear();
        loadmap();
        home();
      },

      "show more":
      function(){
        if (topic.includes("popular")){
          for (i = limit; i < showMoreLimit; i++) 
          {
            // add a pushpin to the map for each firestation
            titles.push(popular.features[i].properties.TITLE);
            details.push(popular.features[i].properties.DESCRIPTION);
            map.entities.push(
              new Microsoft.Maps.Pushpin(
                new Microsoft.Maps.Location(
                  // use the latitude & longitude data for the pushpin position
                  popular.features[i].properties.LATITUDE,
                  popular.features[i].properties.LONGITUDE
                ),
                // use the firestation name for the label 
                {title: (i+1).toString()}
              ));
          }
          getMoreTitles(); 
        }

        else if(topic.includes("art")){
          for (i = limit; i < showMoreLimit; i++) 
          {
            // add a pushpin to the map for each firestation
            titles.push(art.features[i].properties.NAME);
            details.push(art.features[i].properties.ADDRESS);
            map.entities.push(
              new Microsoft.Maps.Pushpin(
                new Microsoft.Maps.Location(
                  // use the latitude & longitude data for the pushpin position
                  art.features[i].properties.LATITUDE,
                  art.features[i].properties.LONGITUDE
                ),
                // use the firestation name for the label 
                {title: (i+1).toString()}
              ));
          }
          getMoreTitles(); 
        }

        else if( topic.includes("libraries")){
            // loop through the array of libraries in the libraries.js data
            for (i = limit; i < showMoreLimit; i++) 
            {
              // add a pushpin to the map for each library
              titles.push(libraries.features[i].properties.NAME);
              details.push(libraries.features[i].properties.ADDRESS);
              map.entities.push(
                new Microsoft.Maps.Pushpin(
                  new Microsoft.Maps.Location(
                    // use the latitude & longitude data for the pushpin position
                    libraries.features[i].properties.LATITUDE,
                    libraries.features[i].properties.LONGITUDE
                  ),
                  // use the library name for the label 
                  {title: (i+1).toString()}
                ));
            }
            getMoreTitles(); 
        }

        else if( topic.includes("waterfalls")){
          // loop through the array of libraries in the libraries.js data
          for (i = limit; i < showMoreLimit; i++) 
          {
            // add a pushpin to the map for each library
            titles.push(waterfalls.features[i].properties.NAME);
            details.push(waterfalls.features[i].properties.ALTERNATE_NAME);
            map.entities.push(
              new Microsoft.Maps.Pushpin(
                new Microsoft.Maps.Location(
                  // use the latitude & longitude data for the pushpin position
                  waterfalls.features[i].properties.LATITUDE,
                  waterfalls.features[i].properties.LONGITUDE
                ),
                // use the library name for the label 
                {title: (i+1).toString()}
              ));
          }
          getMoreTitles(); 
      }
      },

      "popular *places":
      function(){
        clear();
        topic = "popular";
        for (i = 0; i < limit; i++) 
          {
            titles.push(popular.features[i].properties.TITLE);
            details.push(popular.features[i].properties.DESCRIPTION);
            // add a pushpin to the map for each firestation
            map.entities.push(
              new Microsoft.Maps.Pushpin(
                new Microsoft.Maps.Location(
                  // use the latitude & longitude data for the pushpin position
                  popular.features[i].properties.LATITUDE,
                  popular.features[i].properties.LONGITUDE
                ),
                // use the firestation name for the label 
                {title: (i+1).toString()}
              ));
          } 
        getTitles();
      },

      "show *type": 
      function(type)
      {
        clear();
        loadmap();
        // if type includes "fire" we assume the user wants to see firestations
        if (type.includes("art"))
        {
          topic = "art";
          // loop through the array of firestations in the firestations.js data
          for (i = 0; i < limit; i++) 
          {
            titles.push(art.features[i].properties.NAME);
            details.push(art.features[i].properties.ADDRESS);
            // add a pushpin to the map for each firestation
            map.entities.push(
              new Microsoft.Maps.Pushpin(
                new Microsoft.Maps.Location(
                  // use the latitude & longitude data for the pushpin position
                  art.features[i].properties.LATITUDE,
                  art.features[i].properties.LONGITUDE
                ),
                // use the firestation name for the label 
                {title: (i+1).toString()}
              ));
          }
          getTitles();
        }
        // if type includes "libraries" we assume user wants to see libraries
        else if (type.includes("libraries"))
        {
          topic = "libraries";
          // loop through the array of libraries in the libraries.js data
          for (i = 0; i < limit; i++) 
          {
            titles.push(libraries.features[i].properties.NAME);
            details.push(libraries.features[i].properties.ADDRESS);
            // add a pushpin to the map for each library
            map.entities.push(
              new Microsoft.Maps.Pushpin(
                new Microsoft.Maps.Location(
                  // use the latitude & longitude data for the pushpin position
                  libraries.features[i].properties.LATITUDE,
                  libraries.features[i].properties.LONGITUDE
                ),
                // use the library name for the label 
                {title: (i+1).toString()}
              ));
          }
          getTitles();
        } 
        
        else if (type.includes("waterfalls"))
        {
          topic ="waterfalls";
          // loop through the array of libraries in the libraries.js data
          for (i = 0; i < limit; i++) 
          {
            titles.push(waterfalls.features[i].properties.NAME);
            details.push(waterfalls.features[i].properties.ALTERNATE_NAME);
            // add a pushpin to the map for each library
            map.entities.push(
              new Microsoft.Maps.Pushpin(
                new Microsoft.Maps.Location(
                  // use the latitude & longitude data for the pushpin position
                  waterfalls.features[i].properties.LATITUDE,
                  waterfalls.features[i].properties.LONGITUDE
                ),
                // use the library name for the label 
                {title: (i+1).toString()}
              ));
          }
          getTitles();
        }
      },

      // If "clear map" is uttered all pushpins are removed from the map
      "clear map" :
      function()
      {
        // Code to remove all pushpins is taken directly from the API docs:
        // https://www.bing.com/api/maps/sdkrelease/mapcontrol/isdk/deletepushpins
        for (i = map.entities.getLength() - 1; i >= 0; i--) {
          var pushpin = map.entities.get(i);
          if (pushpin instanceof Microsoft.Maps.Pushpin) {
            map.entities.removeAt(i);
          }
        }
      },

      // Any other utterance will be caught by this case, and we use the 
      // Bing Maps geolocation service to find a latitude and longitude 
      // position based on the utterance:
      //  https://www.bing.com/api/maps/sdkrelease/mapcontrol/isdk/searchbyaddress#JS
      // We then place a pushpin on the map at that location.
      //
      // So if we say "Dundas, Ontario" or "Toronto, Ontario" it will 
      // attempt to find the location and put a pushpin on the map there
      "*catchall" :
      function(catchall) 
      {
        var requestOptions = {
          bounds: map.getBounds(),
          where: catchall,
          callback: function (answer, userData) {
              map.setView({ bounds: answer.results[0].bestView });
              map.entities.push(
                new Microsoft.Maps.Pushpin(
                  answer.results[0].location,
                  {title: catchall}
                )
              );
          }
        };
        searchManager.geocode(requestOptions);

      }
    };
  
    // Add our commands to annyang
    annyang.addCommands(commands);
  
    // Start listening. You can call this here, or attach this call to an event, button, etc.
    annyang.start({ autoRestart: true, continuous: true });
  }


  // Loads the map, called after Bing map library finishes loading
  function loadmap()
  {
    // Create a map centered on Hamilton, Ontario
    map = new Microsoft.Maps.Map(document.getElementById("myMap"), 
      {
        center: new Microsoft.Maps.Location(43.2557, -79.8711),
        // we could set additional options when we create the map...
        // mapTypeId: Microsoft.Maps.MapTypeId.aerial,
        // zoom: 12        
      });

    // Load the search manager that allows us to search for locations 
    // (lat and long positions) based on an address, e.g. Toronto, Ontario
    Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
      searchManager = new Microsoft.Maps.Search.SearchManager(map);
    });
  }