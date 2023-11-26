from flask import Flask, jsonify, request
import base64
from AES import encrypt, decrypt
from DES import encrypt_message, decrypt_message
import time

app = Flask(__name__)

import psutil
import os
import time

# Get the process ID
pid = os.getpid()

# Function to get process CPU usage
def get_process_cpu_usage(pid):
    try:
        process = psutil.Process(pid)
        cpu_percent = process.cpu_percent(interval=1)
        return cpu_percent
    except psutil.NoSuchProcess as e:
        print(f"Error: {e}")
        return None

# Get process CPU usage over a period of time (e.g., 5 seconds)

@app.route('/api/encryptmessage', methods=['POST'])
def encrypt_data():
    total_time = 5
    start_time = time.time()
    data = request.get_json()
    encrypted_message = ''
    #print(data)
    # Process data as needed
    if data.get('type') == '3DES':
        encrypted_message = encrypt_message(data.get('key'), data.get('text'))
    else:
        encrypted_message = encrypt(data.get('key'), data.get('text'))
        encrypted_message = base64.b64encode(encrypted_message).decode("utf-8")

    result = {'message': encrypted_message}
    while time.time() - start_time < total_time:
        cpu_usage = get_process_cpu_usage(pid)
        if cpu_usage is not None:
            print(f"Process CPU Usage: {cpu_usage}%")
    time.sleep(1)
    # print(result)
    return jsonify(result)

@app.route('/api/decryptmessage', methods=['POST'])
def decrypt_data():
    total_time = 5
    start_time = time.time()
    data = request.get_json()
    decrypted_message = ''
    #print(data)
    # Process data as needed
    if data.get('type') == '3DES':
        decrypted_message = decrypt_message(data.get('key'), data.get('text'))
    else:
        decrypt_text = base64.b64decode(data.get('text').encode('utf-8'))
        print(decrypt_text)
        decrypted_message = decrypt(data.get('key'), decrypt_text)
        decrypted_message = decrypted_message.decode("utf-8")
        print(decrypted_message)

    result = {'message': decrypted_message}
    while time.time() - start_time < total_time:
        cpu_usage = get_process_cpu_usage(pid)
        if cpu_usage is not None:
            print(f"Process CPU Usage: {cpu_usage}%")
    time.sleep(1)
    return jsonify(result)

if __name__ == '__main__':
    # Set Referrer-Policy to 'strict-origin-when-cross-origin'
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0  # Disable caching for development
    app.config['SESSION_COOKIE_SECURE'] = False  # Allow session cookie over non-HTTPS
    app.config['SESSION_COOKIE_HTTPONLY'] = False  # Allow JavaScript to access the session cookie
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'  # Allow cross-origin session cookie

    # Enable CORS for all routes
    @app.after_request
    def add_cors_headers(response):
        response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        response.headers['Access-Control-Allow-Methods'] = 'OPTIONS, HEAD, GET, POST, PUT, DELETE'
        return response

    app.run(host='localhost', port=5000, debug=True)
