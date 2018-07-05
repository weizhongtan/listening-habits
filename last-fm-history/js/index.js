var
  $listTemplate = $('li#list-template'),
  $mustacheTemplate = $('template.mustache-template').html(),
  values = [],
  options = {
    valueNames: ['date', 'artist'],
    item: 'list-template'
  },
  weekList = new List('list-wrapper', options, values),
  $usernameInput = $('input.username'),
  requestData = {
    "format": "json",
    "api_key": "ca27df5941261314df2fd28280609521"
  };

weekList.clear();

$('button').click(function() {
  getWeekChartList();
});

$usernameInput.on('keydown', function(event) {
  if (event.which == 13) {
    getWeekCharList();
  }
})

function getWeekChartList() {
  requestData.user = $usernameInput.val();
  requestData.method = "user.getWeeklyChartList";
  $.ajax({
    dataType: "json",
    url: 'http://ws.audioscrobbler.com/2.0/',
    data: requestData,
    success: function(data) {
      console.log(data);
      $.each(data.weeklychartlist.chart, function(key, val) {
        getWeeklyChart(val.from, val.to);
      });
    },
    error: console.log("Error: couldn't get all charts (this is ok)")
  });
}

function getWeeklyChart(from, to) {
  requestData.from = from;
  requestData.to = to;
  requestData.method = "user.getWeeklyArtistChart";
  $.ajax({
    dataType: "json",
    url: 'http://ws.audioscrobbler.com/2.0/',
    data: requestData,
    success: function(json) {
      if (json.weeklyartistchart.artist[0]) {
        renderItem(json.weeklyartistchart.artist, json.weeklyartistchart.artist[0].playcount, from);
      }
    }
  });
}

function renderItem(artists, playcount, from) {
  requestData.method = "artist.getInfo";
  requestData.artist = artists[0].name;
  $.ajax({
    dataType: "json",
    url: 'http://ws.audioscrobbler.com/2.0/',
    data: requestData,
    success: function(stuff) {
      var weekObj = {
        artist: stuff.artist.name,
        url: stuff.artist.url,
        playcount: playcount,
        genre: stuff.artist.tags.tag[0].name,
        date: new Date(from * 1000),
        displayDate: moment.unix(from).format("Do MMM YYYY"),
        colourMonth: moment.unix(from).format("MMM").toLowerCase(),
        colourYear: "y" + moment.unix(from).format("YYYY").toLowerCase(),
        imgUrl: stuff.artist.image[2]["#text"]
      };
      $listTemplate.html(Mustache.render($mustacheTemplate, weekObj))
      weekList.add(weekObj);
      weekList.sort('date', {
        order: "desc"
      });
    }
  });
}