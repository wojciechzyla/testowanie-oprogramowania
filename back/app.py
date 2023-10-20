from flask import Flask, request
from pymongo import MongoClient
from dotenv import load_dotenv
from flask_cors import cross_origin
load_dotenv()
app = Flask(__name__)

MONGO_URI = "mongodb://localhost:27017/"
mongo_client = MongoClient(MONGO_URI)
db = mongo_client.testowanie
lists = db.lists


@app.route('/list/names/', methods=["GET"])
@cross_origin()
def get_lists_names():
    result = list(lists.find({}))
    formatted = []
    for i, el in enumerate(result):
        formatted.append({
            "listID": i,
            "title": el["title"],
            "shoppingDate": el["shoppingDate"]
        })
    return formatted, 200


@app.route('/list/add/', methods=["POST"])
@cross_origin()
def add_list():
    new_group = request.json
    new_group["items"] = []
    lists.insert_one(new_group)
    return "success", 200


@app.route('/list/delete/<list_id>', methods=["DELETE"])
@cross_origin()
def delete_list(list_id):
    result = list(lists.find({}))
    mongo_id = result[int(list_id)]["_id"]
    lists.delete_one({"_id": mongo_id})
    return "success", 200


@app.route('/list/<list_id>/', methods=["GET"])
@cross_origin()
def get_list(list_id):
    lista = list(lists.find({}, {"_id": False}))[int(list_id)]
    return lista, 200


@app.route('/list/<list_id>/items/', methods=["GET"])
@cross_origin()
def get_list_items(list_id):
    lista = list(lists.find({}))[int(list_id)]
    return lista["items"], 200


@app.route('/list/<list_id>/item/add/', methods=["POST"])
@cross_origin()
def add_list_item(list_id):
    new_item = request.json
    print(new_item)
    lista = list(lists.find({}))[int(list_id)]
    lista["items"].append(new_item)
    lists.update_one({"_id": lista["_id"]}, {"$set": {"items": lista["items"]}})
    return "success", 200


@app.route('/list/<list_id>/item/delete/<item_id>/', methods=["DELETE"])
@cross_origin()
def delete_list_item(list_id, item_id):
    lista = list(lists.find({}))[int(list_id)]
    lista["items"].pop(int(item_id))
    lists.update_one({"_id": lista["_id"]}, {"$set": {"items": lista["items"]}})
    return "success", 200


@app.route('/list/<list_id>/item/update/<item_id>/', methods=["POST"])
@cross_origin()
def update_list_item(list_id, item_id):
    new_item = request.json
    lista = list(lists.find({}))[int(list_id)]
    lista["items"][int(item_id)] = new_item
    lists.update_one({"_id": lista["_id"]}, {"$set": {"items": lista["items"]}})
    return "success", 200


if __name__ == '__main__':
    app.run()