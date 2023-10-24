import os
import google_auth_oauthlib.flow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# Load client secrets from a local file (downloaded from GCP Console)
CLIENT_SECRETS_FILE = "oauthcredentials.json"
SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"]

def authenticate_with_oauth():
    """Authenticate using OAuth 2.0 and return the service."""
    flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(CLIENT_SECRETS_FILE, SCOPES)
    credentials = flow.run_local_server(port=0)
    return build('youtube', 'v3', credentials=credentials)

def get_caption_track_id(service, video_id, language="en"):
    """Get caption track ID for a given video and language."""
    request = service.captions().list(
        part="id,snippet",
        videoId=video_id
    )
    response = request.execute()
    
    for item in response.get("items", []):
        if item["snippet"]["language"] == language:
            return item["id"]
    return None

def download_caption(service, track_id, output_file="caption.srt"):
    """Download caption by track ID."""
    request = service.captions().download(
        id=track_id,
        tfmt="srt"
    )
    response = request.execute()
    
    with open(output_file, "wb") as file:
        file.write(response)

def main():
    service = authenticate_with_oauth()
    
    video_id = input("Enter the video ID: ")
    track_id = get_caption_track_id(service, video_id)
    if track_id:
        download_caption(service, track_id)
        print("Caption downloaded successfully!")
    else:
        print("Caption not found for the specified video and language.")

if __name__ == "__main__":
    main()
