{
    "$schema": "http://json-schema.org/draft-06/schema#",
    "$ref": "#/definitions/User",
    "definitions": {
        "User": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "id": {
                    "type": "string"
                },
                "audiusId": {
                    "type": "string"
                },
                "catalogTextile": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "catalogAudius": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "collectionTextile": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "collectionAudius": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "links": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            },
            "required": [
                "audiusId",
                "catalogAudius",
                "catalogTextile",
                "collectionAudius",
                "collectionTextile",
                "id",
                "links"
            ],
            "title": "User"
        }
    }
}
