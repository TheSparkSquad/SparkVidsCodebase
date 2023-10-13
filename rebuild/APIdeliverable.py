from flask import Flask, jsonify, request
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
import logging
from logging.handlers import RotatingFileHandler

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # This will allow all origins. Adjust this in a production environment.

@app.route('/', methods=['GET', 'POST'])
def index():
    app.logger.info('Index route accessed')
    transcript = ""
    if request.method == 'POST':
        video_id = request.form['video_id']
        response = get_video_transcript(video_id)
        transcript = format_transcript(response)
    return jsonify({"transcript": transcript})

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
        line = f"{section['start']} - {section['start'] + section['duration']} | {section['text']}"
        formatted.append(line)

    return "\n".join(formatted)

if __name__ == "__main__":
    # Set up logging to a file
    logging.basicConfig(filename='server.log', level=logging.DEBUG)
    
    # Optionally, set up logging to also print to the console
    console = logging.StreamHandler()
    console.setLevel(logging.DEBUG)
    formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
    console.setFormatter(formatter)
    logging.getLogger('').addHandler(console)

    app.run(debug=True)
