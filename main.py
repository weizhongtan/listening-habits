import pygal
import requests
import json

api_key = 'ca27df5941261314df2fd28280609521'
url = 'http://ws.audioscrobbler.com/2.0/'

params = {
    'method': 'chart.getTopArtists',
    'api_key': api_key,
    'format': 'json'
}

# ['name', 'playcount', 'listeners', 'mbid', 'url', 'streamable', 'image']

resp = requests.get(url=url, params=params)
json_data = resp.text # Check the JSON Response Content documentation below
data_dict = json.loads(json_data)
artists = data_dict['artists']['artist']

artist_names = map(lambda x: x['name'], artists)
artist_playcounts = map(lambda x: int(x['playcount']), artists)

for n in artist_playcounts:
    print(n)

bar_chart = pygal.HorizontalBar()
bar_chart.title = 'The best bar chart'
for artist in artists:
    bar_chart.add(artist['name'], int(artist['playcount']))

bar_chart.render_to_file('bar_chart.svg')
