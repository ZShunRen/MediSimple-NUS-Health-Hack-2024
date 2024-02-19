from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import datetime
import glob
from google.cloud import storage
import sys
from pathlib import Path

# get path to find ai_backend/main.py
script_dir = Path(__file__).parent
GOOGLE_CLOUD_KEY = f'{script_dir}/googleKey.json'
UPLOAD_FOLDER = 'uploads'
UPLOAD_FOLDER_PATH = f'{script_dir}/uploads'
ai_path = f"{script_dir.parent.parent.parent}/ai_backend"
sys.path.append(str(ai_path))

from main import fileToText, textToGPT

app= Flask(__name__)
CORS(app)
#modify accord  ingly
BUCKET_NAME = "health_hack_trial_reports"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok= True)
#for privacy reasons remove this but as an added feature
@app.route('/upload', methods = ['POST'])
def upload_image():
    #return("Hello, it's my flask API")
    if 'image' not in request.files:
        return jsonify({'error': 'No file part', "code": 400})
    file = request.files['image']
    # If the file is empty or no file was received
    if file.filename == '':
        return jsonify({'error' : "No file received", "code": 400})
    if file:
        _clear_uploads(UPLOAD_FOLDER_PATH)
        #optionally add file validation, but already added in the upload jsx
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(f"{script_dir}/{filepath}")
        print(filepath)
        OCR_image(UPLOAD_FOLDER_PATH)
        return jsonify({'message': 'File received successfully',"code":200})

def _clear_uploads(upload_folder_path):
    #working
    for file in glob.glob(f"{upload_folder_path}/*.png"):
        os.remove(file)

def _upload_file_cloud(bucket, upload_folder_path ,source_file_name, destination_blob_name):
    storage_client = storage.Client.from_service_account_json(GOOGLE_CLOUD_KEY)
    bucket = storage_client.bucket(BUCKET_NAME)
    blob = bucket.blob(destination_blob_name)
    blob.upload_from_filename(f"{upload_folder_path}/{source_file_name}")
    url = blob.generate_signed_url(
        version="v4",
        # This URL is valid for 15 minutes
        expiration=datetime.timedelta(minutes=15),
        # Allow PUT requests using this URL.
        method="GET"
        #content_type="application/octet-stream",
    )
    return url
    #CHANGE ACCORDINGLY

def OCR_image(upload_folder_path):
#will auto assume that the uploads folder is always deleted after every successful upload
    file_list = glob.glob(f"{upload_folder_path}/*.png")
    if file_list:
        #this is passed as an argument to a function which will generate the nginx rock instance 
        if (len(file_list) != 1):
            return jsonify({'error': 'Previous files not cleared', 'code' : 400})
        elif (len(file_list) == 1):
            #not sure if will work
            #pass this to the function
            file_name = file_list[0].split("\\")[-1]
            outputText = fileToText(_upload_file_cloud(BUCKET_NAME, 
                                                       upload_folder_path, 
                                                       file_name, file_name))
            #save this output to a txt file that that can read by line, segment with p
            with open(f"{UPLOAD_FOLDER_PATH}/output.txt", 'w+') as f:
                f.write(outputText[1])
            highlight_words(outputText[0])
def highlight_words(input_text):
    textToGPT(input_text)
    #generates the keywords csv
    
    
if __name__ == '__main__':
    app.run(debug=True)