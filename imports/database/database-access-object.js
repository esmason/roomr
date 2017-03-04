export class DatabaseAccessObject {
    constructor(collection) {
        this._collection = collection;
    }

    find(queryObject) {
        return this._collection.find(queryObject);
    }

    findOne(queryObject) {
        return this._collection.findOne(queryObject);
    }

    insert(object) {
        this._collection.schema.validate(object);
        this._collection.insert(object);
    }

    update(id, object) {
        let isValid = true;
        object.keys().forEach(function (key) {
            isValid &= this._collection.schema.newContext().validateOne(object, key);
        });

        if (!isValid) {
            throw new Error("Update object did not pass validation");
        }

        this._collection.update(id, {
            $set: object
        });
    }

    remove() {
        this._collection.remove({});
    }
}