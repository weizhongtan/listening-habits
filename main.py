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

resp = requests.get(url=url, params=params)
data = resp.json() # Check the JSON Response Content documentation below
things = map(lambda x: json.loads(x), data.get('artists'))

for ch in things:
    print(ch)

bar_chart = pygal.Bar()
# bar_chart.add('test' )
# Save the svg to a file
# bar_chart.render_to_file('bar_chart.svg')
