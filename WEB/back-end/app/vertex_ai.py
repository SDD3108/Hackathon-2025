# # lectures/ai_utils.py
# import os
# import json
# from google.oauth2 import service_account
# from google.cloud import storage
# from django.conf import settings
# from decouple import config


# credentials = service_account.Credentials.from_service_account_file(
#     config("VERTEX_SERVICE_ACCOUNT_FILE")
# )

# def upload_to_gcs(local_path, bucket_name, destination_blob_name):
#     storage_client = storage.Client(credentials=credentials)
#     bucket = storage_client.bucket(bucket_name)
#     blob = bucket.blob(destination_blob_name)
#     blob.upload_from_filename(local_path)
#     return f"gs://{bucket_name}/{destination_blob_name}"

# def analyze_lecture_video(gcs_uri):
#     from google.cloud import aiplatform
#     aiplatform.init(
#         project=config("VERTEX_PROJECT"),
#         location=config("VERTEX_LOCATION"),
#         credentials=credentials,
#     )

    # prompt = f"""
    #     Analyze this lecture video and provide:
    #     1. A suitable title for the lecture (max 100 characters)
    #     2. A complete transcription of the lecture
    #     3. Time points in the format: MM:SS Description
    #     Return the response in JSON format.
    #     Video path: {gcs_uri}
    # """

#     model = aiplatform.TextGenerationModel.from_pretrained("gemini-1.5-pro-preview-0409")
#     response = model.predict(prompt=prompt, temperature=0.4, max_output_tokens=2048)

#     return json.loads(response.text)