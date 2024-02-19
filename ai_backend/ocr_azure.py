#########################
# Uses Azure's API for image-based OCR
# SETUP GUIDE: https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/quickstarts-sdk/client-library?tabs=windows%2Cvisual-studio&pivots=programming-language-python
#########################

from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from azure.cognitiveservices.vision.computervision.models import OperationStatusCodes
from azure.cognitiveservices.vision.computervision.models import VisualFeatureTypes
from msrest.authentication import CognitiveServicesCredentials

from array import array
import os
from PIL import Image
import sys
import time
import os
from dotenv import load_dotenv

# retrieve keys from .env file
load_dotenv()
#AZURE OCR API KEYS GO HERE
AZURE_OCR_API_KEY = os.getenv('AZURE_OCR_API_KEY')
AZURE_OCR_ENDPOINT = os.getenv('AZURE_OCR_ENDPOINT')

'''
Authenticate
Authenticates your credentials and creates a client.
'''
subscription_key = AZURE_OCR_API_KEY
endpoint = AZURE_OCR_ENDPOINT

computervision_client = ComputerVisionClient(endpoint, CognitiveServicesCredentials(subscription_key))
'''
END - Authenticate
'''

def ocr_azure(image_url):
    '''
    OCR: Read File using the Read API, extract text - remote
    This example will extract text in an image, then print results, line by line.
    This API call can also extract handwriting style text (not shown).
    '''
    print("===== Read File - remote =====")
    # Get an image with text
    read_image_url = image_url

    # Call API with URL and raw response (allows you to get the operation location)
    read_response = computervision_client.read(read_image_url,  raw=True)

    # Get the operation location (URL with an ID at the end) from the response
    read_operation_location = read_response.headers["Operation-Location"]
    # Grab the ID from the URL
    operation_id = read_operation_location.split("/")[-1]

    # Call the "GET" API and wait for it to retrieve the results 
    while True:
        read_result = computervision_client.get_read_result(operation_id)
        if read_result.status not in ['notStarted', 'running']:
            break
        time.sleep(1)

    final_text = ''
    previous_bound = 0
    # Print the detected text, line by line
    if read_result.status == OperationStatusCodes.succeeded:
        for text_result in read_result.analyze_result.read_results:
            for line in text_result.lines:
                print(line.text)
                print(line.bounding_box)
                # print(line.bounding_box[1], line.bounding_box[7], previous_bound)
                if line.bounding_box[1] - previous_bound > 10: # note the hardcoded paragraphing size
                    final_text += '\n' + line.text + '\n' # to 'paragraph' the text
                else:
                    final_text += line.text + '\n'
                previous_bound = line.bounding_box[7]
    print(
    '''
    END - Read File - remote
    '''
    )

    print(final_text)
    return final_text

