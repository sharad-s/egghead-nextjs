/*
id	ID	Yes
name	String	Yes
email	String	Yes
catalog	[Item]	No
collection	[Item]	No
background	Background	No
links	[Link]	No
*/


const userSchema = {
    "$schema": "http://json-schema.org/draft-06/schema#",
    "$ref": "#/definitions/User",
    "definitions": {
        "User": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "ethereumPublicKey": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "email": {
                    "type": "string"
                },
                "background": {
                    "$ref": "#/definitions/Background"
                }
            },
            "required": [
                "background",
                "email",
                "ethereumPublicKey",
                "name"
            ],
            "title": "User"
        },
        "Background": {
            "type": "object",
            "additionalProperties": false,
            "properties": {
                "id": {
                    "type": "string"
                },
                "type": {
                    "type": "string"
                },
                "source": {
                    "type": "string"
                }
            },
            "required": [
                "id",
                "source",
                "type"
            ],
            "title": "Background"
        }
    }
}