import os
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity


data = pd.read_csv(os.path.join(os.getcwd(), 'dataset.csv'))
print(data)

#remove rows with no track name
data=data.dropna(subset=['track_name'])

#selecting the attributes
df=data[data.columns[5:20]]
df['track_genre']=data['track_genre']
df['time_signature']=data['time_signature']
df['duration_ms']=data['duration_ms']
df['track_name']=data['track_name']
df['track_id']=data['track_id']

#Normalization
x=df[df.drop(columns=['track_name','track_genre', 'track_id']).columns].values
scaler = MinMaxScaler().fit(x)
X_scaled = scaler.transform(x)
df[df.drop(columns=['track_name','track_genre', 'track_id']).columns]=X_scaled



#function to recommend other songs
def make_matrix_correlation(song):
    data=pd.DataFrame()
    df.drop_duplicates(inplace=True)
    track_id=song
    print('The song closest to your search is :',track_id)
    track_genre=df[df['track_id']==track_id]['track_genre'].values[0]
    data=df[df['track_genre']==track_genre]
    track_attr=data[data['track_id']==track_id].drop(columns=['track_genre','track_name','track_id', 'duration_ms', 'explicit',  'mode', 'liveness']).values
    if len(track_attr)>1:
        track_attr=track_attr[1]
    data.drop(columns=['track_genre','track_name', 'duration_ms', 'explicit',   'mode', 'liveness'],inplace=True)
    track_attr = track_attr.flatten() 
    data.fillna(data.drop('track_id', axis=1).mean())
    data['sim'] = cosine_similarity(data.drop('track_id', axis = 1).values, track_attr.reshape(1, -1))[:,0]
    top_10 = data.sort_values('sim',ascending = False).head(10)['track_id'].values
    return top_10.tolist()



mood_songs = {
    "evil" : "2HZLXBOnaSRhXStMLrq9fD",
    "sad": "7eJMfftS33KTjuF7lTsMCx",
    "sleep" : "07UDTaRYJAsIhUZTyZSUzM",
    "lit" : "39LLxExYz6ewLAcYrzQQyP",
    "robot": "0g5EKLgdKvNlln7TNqBByK",
    "dance": "3nqQXoyQOWXiESFLlDF1hG",
    "club" : "2vXKRlJBXyOcvZYTdNeckS",
    "classical" : "4TujvPqDwwcewGVv1TgLLI",
    "study" : "6qbe2xJVwt7wwpeocsrVvc"
}

prev_song = {
"sleep" : "",
"club":  "",
"dance": "",
"robot": "",
"evil" :"",
"study":"",
"sad": "",
"lit": "",
"classical": ""
}

def setPrevSong(mood, id):
    prev_song[mood] = id


#function to select a song from predetermined songs
def getSong(mood):
    if prev_song.get(mood) != "":
        return prev_song.get(mood)
    return  mood_songs.get(mood)
    