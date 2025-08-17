import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("WATSONX_API_KEY")
PROJECT_ID = os.getenv("WATSONX_PROJECT_ID")
WATSONX_URL = "https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29"
MODEL_ID = "ibm/granite-13b-chat-v2"  # can also use ibm/granite-8b-japan or others


def get_iam_token():
    response = requests.post(
        "https://iam.cloud.ibm.com/identity/token",
        data={
            "apikey": API_KEY,
            "grant_type": "urn:ibm:params:oauth:grant-type:apikey"
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )

    if response.status_code != 200:
        raise Exception(f"IAM token error: {response.status_code}, {response.text}")

    data = response.json()
    return data.get("access_token")



def get_prediction(crowd_count, time_period, event_status):
    token = get_iam_token()

    prompt = f"""
    You are a crowd safety AI. Classify the situation into one of four categories:
    1. Good to go / Well managed / Low crowd
    2. Moderate crowd but no danger
    3. Overcrowd / Attention needed / More officers needed
    4. Stampede / Red alert / Medical services needed

    Input:
    - Crowd count: {crowd_count}
    - Time period: {time_period}
    - Event status: {event_status}

    Output only the category text (do not explain).
    """

    payload = {
        "input": prompt,
        "parameters": {
            "decoding_method": "greedy",
            "max_new_tokens": 50
        },
        "model_id": MODEL_ID,
        "project_id": PROJECT_ID
    }

    response = requests.post(
        WATSONX_URL,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        },
        json=payload
    )

    try:
        return response.json()["results"][0]["generated_text"].strip()
    except Exception:
        return f"Error: {response.text}"
