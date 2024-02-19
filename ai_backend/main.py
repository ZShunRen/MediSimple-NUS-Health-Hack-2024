
from openai import OpenAI
import csv
import os
import sys
from dotenv import load_dotenv
from pathlib import Path
# set path back to current path (due to change by main_flask.py which calls main.py)

from ocr_azure import ocr_azure
from cleanText import foo

#should resolve to ai_backend
###### 
# Obtain text from image using Azure API with ocr_azure.py
######
# FOR TESTING: image_url = "https://i.imgur.com/0YqHuBs.png"
###### 
# Cleanup PII from text with Azure API using cleanup.py
######
def fileToText(image_url):
  raw_text = ocr_azure(image_url)
  clean_text = foo(raw_text)
  return [clean_text, raw_text]

###### 
# CHATGPT IMPLEMENTATION
# To obtain keywords and it's definitions
######
def textToGPT(text):
  # retrieve keys from .env file
  load_dotenv()
  #ADD YOUR OPENAI_API  KEY HERE, WE RECOMMEND SAVING IT AS IN YOUR ENV
  OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
  print("STARTING CHATGPT API CALL")
  client = OpenAI(api_key = OPENAI_API_KEY)
  completion = client.chat.completions.create(
    model="gpt-4",
    messages=[
      {"role": "system", "content": 
      """
      You are a medical professional. Your job is to identify medical keywords and phrases that has meaning or nuances that may not be understood by a non-medical professional. This is often due to the use of medical jargon or oft-misunderstood medical terms. 
      Therefore, you are to identify such terms and provide a description in vocabulary understood by consumers who are non-medical professionals. The description should be succinct and also capture the context of the report.
      The description will later be used in a web-based application, in which patients can hover over medical terms to read a description that is understandable by them. Do not reuse the same word when explaining terms.

      The key-phrase should not exceed 70 characters in length.

      The output we require is in the form: 'first keyphrase'~'description of first keyphrase'~'second keyphrase2'~'description of second keyphrase' which will then be written to a csv file.
      """},

      {"role": "user", "content": text}
    ],
    seed=1337 # to fix the seed to get a semi-deterministic output
  )
  print('SUCCESSFULLY OBTAINED CHATGPT OUTPUT.')

  chatgpt_output = completion.choices[0].message.content
  print(chatgpt_output) 

  ###### 
  # Sets the relative file path so that it can find keywords.csv
  ######
  

  ###### 
  # Write ChatGPT output to keywords.csv
  ######
  curr_dir = Path(__file__).parent.parent
  print(f"{curr_dir}/frontend/src/control")
  curr_dir=f"{curr_dir}/frontend/src/control"
  with open(f'{curr_dir}/keywords.csv', 'w+') as csv_file:
      writer = csv.writer(csv_file, quoting=csv.QUOTE_ALL)
      writer.writerow([chatgpt_output])
  print("WROTE OUTPUT TO keywords.csv")
  print("=====END OF OPERATION (main.py)=====")

