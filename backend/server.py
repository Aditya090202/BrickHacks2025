from typing import Union

from fastapi import FastAPI

from db.database import AtlasClient

app = FastAPI()

DB_NAME = 'brickhack-2025'

# The collections include: 
# - users
# - crash (nothing for now)
COLLECTION_NAME = 'users'

'''
To use database, include the following code:
    atlasclient = AtlasClient(DB_NAME)
    collection = atlasclient.get_collection(collection_name=COLLECTION_NAME )
    # here you can use the collection to find items
        # ex:
        #   collection.find()
        #   collection.find_one()
        #   collection.insert_one()
        #   collection.update_one()
        #   collection.delete_one()
'''

@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
    print("Server is running on port 8000")
