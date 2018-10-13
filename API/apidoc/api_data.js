define({ "api": [
  {
    "type": "get",
    "url": "/subforum/:id",
    "title": "Get Sub-forum information",
    "group": "Forum",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Sub-forum id</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "userid",
            "description": "<p>userid</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"userid\":\"2\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "id",
            "description": "<p>Sub-forum id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "title",
            "description": "<p>Sub-forum title</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "description",
            "description": "<p>Sub-forum description</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "child",
            "description": "<p>Sub-forum child</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "user_following_state",
            "description": "<p>Is User follow this sub-forum</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "followers",
            "description": "<p>Number of user follow this sub-forum</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>Sub-forum title</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "   HTTP/1.1 200 OK\n\t \t{\n\t\t\tid: 2,\n\t\t\ttitle: \"CAR \",\n\t\t\tdescription: \"Car forum\",\n\t\t\tchild: \"3,4,5\",\n\t\t\tuser_following_state: false,\n\t\t\tfollowers: \"2\",\n\t\t\ttype: 0\n\t\t}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Sub forum not found",
          "content": "HTTP/1.1 404 Not Found",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://ride-hub.herokuapp.com/api/subforum/:id"
      }
    ],
    "version": "0.0.0",
    "filename": "task-api/index.js",
    "groupTitle": "Forum",
    "name": "GetSubforumId"
  },
  {
    "type": "get",
    "url": "/subforum/root",
    "title": "Get List of Subforums",
    "group": "Forum",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "userid",
            "description": "<p>userid</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"userid\":\"2\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "subforums",
            "description": "<p>Sub-forum list</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "subforums.id",
            "description": "<p>Sub-forum id</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "subforums.title",
            "description": "<p>Sub-forum title</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "subforums.description",
            "description": "<p>Sub-forum description</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "subforum.child",
            "description": "<p>Sub-forum child</p>"
          },
          {
            "group": "Success 200",
            "type": "Boolean",
            "optional": false,
            "field": "subforums.user_following_state",
            "description": "<p>Is User follow this sub-forum</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "subforums.followers",
            "description": "<p>Number of user follow this sub-forum</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "subforums.type",
            "description": "<p>Sub-forum title</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "   HTTP/1.1 200 OK\n   {\n     \"subforums\":[\n\t \t\t{\n\t\t\t\tid: 2,\n\t\t\t\ttitle: \"CAR \",\n\t\t\t\tdescription: \"Car forum\",\n\t\t\t\tchild: \"3,4,5\",\n\t\t\t\tuser_following_state: false,\n\t\t\t\tfollowers: \"2\",\n\t\t\t\ttype: 0\n\t\t\t},\n\t\t\t{\n\t\t\t\tid: 6,\n\t\t\t\ttitle: \"MOTOCYCLE \",\n\t\t\t\tdescription: \"Motocycle forum\",\n\t\t\t\tchild: \"7,8,9\",\n\t\t\t\tuser_following_state: false,\n\t\t\t\tfollowers: \"0\",\n\t\t\t\ttype: 0\n\t\t\t},\n\t\t\t{\n\t\t\t\tid: 10,\n\t\t\t\ttitle: \"BICYCLE \",\n\t\t\t\tdescription: \"Bicycle forum\",\n\t\t\t\tchild: null,\n\t\t\t\tuser_following_state: false,\n\t\t\t\tfollowers: \"0\",\n\t\t\t\ttype: 1\n\t\t\t}\n\t\t]\n   }",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "List error",
          "content": "HTTP/1.1 500 Internal Server Error",
          "type": "json"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://ride-hub.herokuapp.com/api/subforum/root"
      }
    ],
    "version": "0.0.0",
    "filename": "task-api/index.js",
    "groupTitle": "Forum",
    "name": "GetSubforumRoot"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "task-api/doc/main.js",
    "group": "G__ride_hubtest_task_api_doc_main_js",
    "groupTitle": "G__ride_hubtest_task_api_doc_main_js",
    "name": ""
  },
  {
    "type": "get",
    "url": "/user/getUserById/:id/summary",
    "title": "Get User information summary",
    "group": "User",
    "version": "0.0.0",
    "filename": "task-api/index.js",
    "groupTitle": "User",
    "name": "GetUserGetuserbyidIdSummary"
  },
  {
    "type": "post",
    "url": "/checkUserLogin",
    "title": "Check USER login",
    "group": "User",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>User Password</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Input",
          "content": "{\n  \"username\": \"admin\",\n  \"password\": \"123456\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "status",
            "description": "<p>Authentication status</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status.type",
            "description": "<p>Authentication type</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status.message",
            "description": "<p>Authentication message</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "status.code",
            "description": "<p>Authentication code</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "status.error",
            "description": "<p>is Error?</p>"
          },
          {
            "group": "Success 200",
            "type": "Object[]",
            "optional": false,
            "field": "data",
            "description": "<p>Return data</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "data.status",
            "description": "<p>Authentication status</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.user",
            "description": "<p>User information</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.user.id",
            "description": "<p>Userid</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.user.username",
            "description": "<p>username</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.user.role",
            "description": "<p>User role</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "data.session_token",
            "description": "<p>Session token</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\":{\n        \"type\": \"success\",\n        \"message\": \"Success\",\n        \"code\": 200,\n        \"error\": false\n  },\n  \"data\":[\n      {\n          \"status\": \"Authenticated\",\n          \"user\":{\n              \"id\":\"1\",\n              \"username\":\"admin\",\n              \"role\":\"Admin\"\n          },\n          \"session_token\": \"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\"\n      }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Authentication Failed",
          "content": "HTTP/1.1 401 UNAUTHORIZED\n{\n      \"status\":{\n        \"type\": Unauthorized,\n        \"message\": \"Authentication Failed: Invalid user credentials\",\n        \"code\": 401,\n        \"error\":true\n      }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "task-api/index.js",
    "groupTitle": "User",
    "name": "PostCheckuserlogin"
  }
] });