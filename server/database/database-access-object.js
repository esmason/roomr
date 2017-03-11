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
        const updateContext = this._collection.schema.namedContext("updateContext");

        let isValid = true;
        object.keys().forEach(function (key) {
            isValid &= updateContext.validateOne(object, key);
        });

        if (!isValid) {
            throw new Error("Update object did not pass validation: " + updateContext.invalidKeys());
        }

        this._collection.update(id, {
            $set: object
        });
    }

    remove(queryObject) {
        this._collection.remove(queryObject);
    }
}