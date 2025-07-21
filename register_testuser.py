import requests

url = 'https://anothergenback.onrender.com/auth/users/'
data = {
    'email': 'testuser2@example.com',
    'password': 'TestPassword123',
    'name': 'Test2',
    'surname': 'User2',
    'is_teacher': True
}
headers = {'Content-Type': 'application/json'}

response = requests.post(url, json=data, headers=headers)

print('Status code:', response.status_code)
print('Response:', response.text) 