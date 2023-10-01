from youtube_transcript_api import YouTubeTranscriptApi

def get_video_transcript(video_id):
    try:
        srt = YouTubeTranscriptApi.get_transcript(video_id)
        return srt
    except Exception as e:
        return str(e)  # Return the error message for debugging purposes
