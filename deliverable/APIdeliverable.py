from flask import Flask, render_template, request
from youtube_transcript_api import YouTubeTranscriptApi

#link to api
#https://www.geeksforgeeks.org/python-downloading-captions-from-youtube/#


app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    transcript = ""
    if request.method == 'POST':
        video_id = request.form['video_id']
        response = get_video_transcript(video_id)
        transcript = format_transcript(response)
    return render_template('index.html', transcript=transcript)

def get_video_transcript(video_id):
    try:
        srt = YouTubeTranscriptApi.get_transcript(video_id)
        return srt
    except Exception as e:
        return str(e)

def format_transcript(transcript):
    """Formats the raw transcript data into a readable string."""
    if isinstance(transcript, str):  # if the input is an error string
        return transcript

    formatted = []
    for section in transcript:
        line = f"Time: {section['start']} - {section['start'] + section['duration']}, Text: {section['text']}"
        formatted.append(line)

    return "\n".join(formatted)

if __name__ == "__main__":
    app.run(debug=True)


