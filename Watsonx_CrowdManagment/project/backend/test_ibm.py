import requests

API_KEY = "4AEZUInDJ7zlJ19PTMKRvuOWrXmvB9kg5VWS2ZqIddY7"

url = "https://iam.cloud.ibm.com/identity/token"
headers = {"Content-Type": "application/x-www-form-urlencoded"}
data = {
    "apikey": API_KEY,
    "grant_type": "urn:ibm:params:oauth:grant-type:apikey"
}

resp = requests.post(url, headers=headers, data=data)

print("Status:", resp.status_code)
print("Body:", resp.text)
