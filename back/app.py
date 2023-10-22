from flask import Flask, request, jsonify, url_for, send_from_directory
from pymongo import MongoClient
from dotenv import load_dotenv
from flask_cors import cross_origin
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
from bson.objectid import ObjectId
import json
from werkzeug.utils import secure_filename
import os
import shutil
load_dotenv()
app = Flask(__name__)

MONGO_URI = "mongodb://localhost:27017/"
app.config["JWT_SECRET_KEY"] = "sdkfn34t3veu$#erdg&$e"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024
UPLOAD_FOLDER = 'photos'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif'}  # Define allowed file extensions

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
jwt = JWTManager(app)
mongo_client = MongoClient(MONGO_URI)
db = mongo_client.testowanie
users = db.users


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.after_request
@cross_origin()
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response

@app.route('/token', methods=["POST"])
@cross_origin()
def create_token():
    login = request.json.get("login", None)
    password = request.json.get("password", None)
    user = list(users.find({"login": login, "password": password}))
    if not user:
        return {"msg": "Wrong email or password"}, 401

    access_token = create_access_token(identity=str(user[0]["_id"]))
    response = {"access_token":access_token}
    return response

@app.route("/logout", methods=["POST"])
@cross_origin()
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

@app.route('/register', methods=["POST"])
@cross_origin()
def register_user():
    login = request.json.get("login", None)
    password = request.json.get("password", None)
    user = list(users.find({"login": login, "password": password}))
    if user:
        return {"msg": "User with provided credentials exist"}, 401
    users.insert_one({"login": login, "password": password, "lists": []})
    return "success", 200


@app.route('/list/names/', methods=["GET"])
@cross_origin()
@jwt_required()
def get_lists_names():
    user_id = ObjectId(get_jwt_identity())
    user = list(users.find({"_id": user_id}))[0]
    formatted = []
    for i, el in enumerate(user["lists"]):
        formatted.append({
            "listID": i,
            "title": el["title"],
            "shoppingDate": el["shoppingDate"]
        })
    return {"data": formatted}, 200


@app.route('/list/add/', methods=["POST"])
@cross_origin()
@jwt_required()
def add_list():
    new_group = request.json
    new_group["items"] = []
    user_id = ObjectId(get_jwt_identity())
    user = list(users.find({"_id": user_id}))[0]
    user["lists"].append(new_group)
    users.update_one({"_id": user_id}, {"$set": {"lists": user["lists"]}})
    return "success", 200


@app.route('/list/delete/<list_id>', methods=["DELETE"])
@cross_origin()
@jwt_required()
def delete_list(list_id):
    user_id = ObjectId(get_jwt_identity())
    user = list(users.find({"_id": user_id}))[0]
    list_name = user["lists"][int(list_id)]["title"]
    user["lists"].pop(int(list_id))
    dir_path = os.path.join(app.config['UPLOAD_FOLDER'], str(user_id), list_name)
    if os.path.exists(dir_path):
        shutil.rmtree(dir_path, ignore_errors=True)
    users.update_one({"_id": user_id}, {"$set": {"lists": user["lists"]}})
    return "success", 200


@app.route('/list/<list_id>/', methods=["GET"])
@cross_origin()
@jwt_required()
def get_list(list_id):
    user_id = ObjectId(get_jwt_identity())
    user = list(users.find({"_id": user_id}))[0]
    result = user["lists"][int(list_id)]
    return {"data": result}, 200


@app.route('/list/<list_id>/items/', methods=["GET"])
@cross_origin()
@jwt_required()
def get_list_items(list_id):
    user_id = ObjectId(get_jwt_identity())
    user = list(users.find({"_id": user_id}))[0]
    items = user["lists"][int(list_id)]["items"]
    return {"data": items}, 200

@app.route('/uploads/<userid>/<listname>/<filename>')
def uploaded_file(userid, listname, filename):
    dir_path = os.path.join(app.config['UPLOAD_FOLDER'], userid, listname)
    return send_from_directory(dir_path, filename)


@app.route('/list/<list_id>/item/add/', methods=["POST"])
@cross_origin()
@jwt_required()
def add_list_item(list_id):
    user_id = ObjectId(get_jwt_identity())
    user = list(users.find({"_id": user_id}))[0]

    new_item = json.loads(request.form['data'])
    file = request.files.get('photo', None)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        list_name = user["lists"][int(list_id)]["title"]
        dir_path = os.path.join(app.config['UPLOAD_FOLDER'], str(user_id), list_name)
        if not os.path.exists(dir_path):
            os.makedirs(dir_path)
        file.save(os.path.join(dir_path, filename))
        new_item["file_name"] = filename
        new_item["image_url"] = url_for('uploaded_file', userid=str(user_id),
                                        listname=user["lists"][int(list_id)]["title"],
                                        filename=filename, _external=True)
    else:
        new_item["file_name"] = ""
        new_item["image_url"] = ""
    user["lists"][int(list_id)]["items"].append(new_item)
    users.update_one({"_id": user["_id"]}, {"$set": {"lists": user["lists"]}})
    return "success", 200


@app.route('/list/<list_id>/item/delete/<item_id>/', methods=["DELETE"])
@cross_origin()
@jwt_required()
def delete_list_item(list_id, item_id):
    user_id = ObjectId(get_jwt_identity())
    user = list(users.find({"_id": user_id}))[0]
    deleted_item = user["lists"][int(list_id)]["items"].pop(int(item_id))
    if deleted_item["file_name"]:
        list_name = user["lists"][int(list_id)]["title"]
        dir_path = os.path.join(app.config['UPLOAD_FOLDER'], str(user_id), list_name)
        if os.path.exists(dir_path):
            os.remove(os.path.join(dir_path, deleted_item["file_name"]))
    users.update_one({"_id": user["_id"]}, {"$set": {"lists": user["lists"]}})
    return "success", 200


@app.route('/list/<list_id>/item/bought/<item_id>/', methods=["POST"])
@cross_origin()
@jwt_required()
def bought_list_item(list_id, item_id):
    new_item = request.json
    user_id = ObjectId(get_jwt_identity())
    user = list(users.find({"_id": user_id}))[0]
    user["lists"][int(list_id)]["items"][int(item_id)] = new_item
    users.update_one({"_id": user["_id"]}, {"$set": {"lists": user["lists"]}})
    return "success", 200


@app.route('/list/<list_id>/item/update/<item_id>/', methods=["POST"])
@cross_origin()
@jwt_required()
def update_list_item(list_id, item_id):
    user_id = ObjectId(get_jwt_identity())
    user = list(users.find({"_id": user_id}))[0]
    old_item = user["lists"][int(list_id)]["items"][int(item_id)]
    if old_item["file_name"]:
        list_name = user["lists"][int(list_id)]["title"]
        dir_path = os.path.join(app.config['UPLOAD_FOLDER'], str(user_id), list_name)
        if os.path.exists(dir_path):
            os.remove(os.path.join(dir_path, old_item["file_name"]))
    new_item = json.loads(request.form['data'])
    file = request.files.get('photo', None)
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        list_name = user["lists"][int(list_id)]["title"]
        dir_path = os.path.join(app.config['UPLOAD_FOLDER'], str(user_id), list_name)
        if not os.path.exists(dir_path):
            os.makedirs(dir_path)
        file.save(os.path.join(dir_path, filename))
        new_item["file_name"] = filename
        new_item["image_url"] = url_for('uploaded_file', userid=str(user_id),
                                        listname=user["lists"][int(list_id)]["title"],
                                        filename=filename, _external=True)
    else:
        new_item["file_name"] = ""
        new_item["image_url"] = ""
    user["lists"][int(list_id)]["items"][int(item_id)] = new_item
    users.update_one({"_id": user["_id"]}, {"$set": {"lists": user["lists"]}})
    return "success", 200


if __name__ == '__main__':
    app.run()