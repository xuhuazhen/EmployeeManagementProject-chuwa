# EMPLOYEE

## AUTH

### **Get /api/user/signup/:signupToken**

Check user signup token is valid or not

1.  Request Body

    None

2.  Response

- **200 OK** - If the token is valid.

  ```json
  {
    "isValid": true,
    "email": "signup@email.com"
  }
  ```

- **200 OK** - If the token invalid.

  ```json
  {
    "isValid": false,
  }
  ```

### **POST /api/user/signup**

User signup

1.  Request Body

    ```json
    {
    "username":"testuser1",
    "password":"Ankjnw@032",
    "email":"test@gmail.com",
    "signupToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZ21haWwuY29tIiwiaWF0IjoxNzA4NTcyODExLCJleHAiOjE3MDg1ODM2MTF9.-LWc3cK_WX1KTjEAzXs8YbN30gBHLpkfRTC4042somE"
    }
    ```

2.  Response

- **200 OK** - If the email is sent successfully.

  ```json
  {
    "status": "success",
    "data": {
        "user": {
            "username": "testuser2",
            "email": "test2@gmail.com",
            "role": "employee",
            "nextStep": "application-waiting", 
            "_id": "65dbd7d3f0492c933eb205e1",
            "emergencyContact": [],
            "application": {
                "status": "waiting"
            },
            "documents": []
        }
    }
  }
  ```

- **401 Unauthorized Error** - If email not match.

  ```json
  {
    "status": "fail",
    "message": "Email not same"
  }
  ```

- **409 Conflict Error** - If email already used to sign up.

  ```json
  {
    "status": "fail",
    "message": "User already signed up"
  }
  ```

- **409 Conflict Error** - If username already used.

  ```json
  {
    "status": "fail",
    "message": "Duplicate field value: \"mosojoey\". Please use another value!"
  }
  ```

- **400 Bad Request** - If username is not alphanumeric.

  ```json
  {
      "status": "fail",
      "message": "Username must be alphanumeric!"
  }
  ```

- **400 Bad Request** - If password does not meet requirement.

  - password: at least 8 length, at least 1 number, at least 1 uppercase, at least 1 lowercase, at least 1 special char

  ```json
  {
  "status": "fail",
  "message": "Password is too weak!"
  }
  ```

- **400 Bad Request** - If missing any field(username, password, email).

  ```json
  {
      "status": "fail",
      "message": "Missing required fields!"
  }
  ```

- **500 Internal Server Error** - If there is an issue sending the email.
  ```json
  {
    "status": "error",
    "message": "Failed to send email"
  }
  ```

### **GET /api/user/login**

Get user login status.

**Token will include userId, role and username**

1.  Request Body

    None

2.  Response

- **200 OK** - If user is logged in.

  ```json
  {
    "isLogin": true,
    "userId": "65d7c29000f7bde5d18df698",
    "role": "employee"
  }
  ```

  - **200 OK** - If user is not logged in.

  ```json
  {
    "isLogin": false,
  }
  ```

### **POST /api/user/login**

User login with email and password, if success, token will be return in both cookie and body

**Token will include userId, role and username**

1.  Request Body

    ```json
    {
    "password":"Ankjnw@032",
    "email":"test@gmail.com"
    }
    ```

2.  Response

- **200 OK** - If the email is sent successfully.

  ```json
  {
    "status": "success",
    "data": {
        "user": {
            "_id": "65d97cef342deb027e5fea05",
            "username": "testuser",
            "email": "testuser@example.com",
            "role": "employee",
            "nextStep": "ead-pending",
            "personalInfo": {
                "firstName": "John",
                "lastName": "Doe",
                "middleName": "Patrick",
                "preferredName": "John",
                "profilePicture": "https://example.com/profile.jpg",
                "ssn": "123-45-6789",
                "dateOfBirth": "1990-01-01T00:00:00.000Z",
                "gender": "Male"
            },
            "address": {
                "apt": "123",
                "streetName": "Main St",
                "city": "Anytown",
                "state": "NY",
                "zip": "12345"
            },
            "contactInfo": {
                "cellPhoneNumber": "123-456-7890",
                "workPhoneNumber": "123-456-7890"
            },
            "employment": {
                "visaTitle": "H1-B",
                "startDate": "2023-01-01T00:00:00.000Z",
                "endDate": "2025-01-01T00:00:00.000Z"
            },
            "reference": {
                "firstName": "Jane",
                "lastName": "Doe",
                "middleName": "Marie",
                "phone": "987-654-3210",
                "email": "jane.doe@example.com",
                "relationship": "Spouse"
            },
            "driveInfo": {
                "licenseNumber": "ABCD12345",
                "expireDate": "2025-01-01T00:00:00.000Z"
            },
            "carInfo": {
                "make": "toyota",
                "model": "camry",
                "color": "white"
            },
             "emergencyContact": [
            {
                "_id": "65dbea43f93710c59604692f",
                "firstName": "Emergency",
                "lastName": "Contact",
                "middleName": "",
                "phone": "999-999-9999",
                "email": "emergency.contact@example.com",
                "relationship": "Emergency"
            },
            {
                "_id": "65dbea43f93710c596046930",
                "firstName": "Emergency",
                "lastName": "Contact",
                "middleName": "",
                "phone": "999-999-9999",
                "email": "emergency.contact@example.com",
                "relationship": "Emergency"
            }
        ],
            "application": {
                "status": "waiting"
            },
             "documents": [
              {
                "_id": "65dbe8ed682ed12303f8eac2",
                "url": "https://josie-hr-project-bucket.s3.us-east-2.amazonaws.com/1708910828888",
                "title": "test.pdf",
                "tag": "driver-license",
              }
            ], 
        }
    }
  }
  ```

- **400 Bad Request** - If email has wrong format.

  ```json
  {
      "status": "fail",
      "message": "Email format is wrong!"
  }
  ```

- **401 Unauthorized** - If username or email not match.

  ```json
  {
    "status": "fail",
    "message": "Incorrect email or password"
  }
  ```

### **GET /api/user/logout**

User logout

1.  Request Body
    None

2.  Response

- **200 OK** - If the email is sent successfully.

  ```json
  {
    "status": "success"
  }
  ```

## PERSONAL INFO

### **GET /api/user/profile/:userId**

Get user profile, when stay logged in

1.  Request Body
    None

2.  Response

- **200 OK**

  ```json
  {
    "status": "success",
    "data": {
        "_id": "65dbe41d2aa92598fb067b50",
        "username": "testuser2",
        "email": "test2@gmail.com",
        "role": "employee",
        "nextStep": "application-pending", 
        "documents": [
            {
                "_id": "65dbe8ed682ed12303f8eac2",
                "url": "https://josie-hr-project-bucket.s3.us-east-2.amazonaws.com/1708910828888",
                "title": "test.pdf",
                "tag": "driver-license",
                "__v": 0
            }
        ],
        "emergencyContact": [
            {
                "_id": "65dbea43f93710c59604692f",
                "firstName": "Emergency",
                "lastName": "Contact",
                "middleName": "",
                "phone": "999-999-9999",
                "email": "emergency.contact@example.com",
                "relationship": "Emergency"
            },
            {
                "_id": "65dbea43f93710c596046930",
                "firstName": "Emergency",
                "lastName": "Contact",
                "middleName": "",
                "phone": "999-999-9999",
                "email": "emergency.contact@example.com",
                "relationship": "Emergency"
            }
        ],
        "application": {
            "status": "pending"
        },
        "address": {
            "streetName": "4444"
        }
    }
  }
  ```

### **PATCH /api/user/profile/:userId**

Update user profile, when stay logged in and application status is not pending, approved or not submit application

1.  Request Body

    ```json

    {"data": {
         "address": {
            "apt": "4444"
        },
        "emergencyContact": [
            {
                "firstName": "Emergency",
                "lastName": "Contact",
                "middleName": "",
                "phone": "999-999-9999",
                "email": "emergency.contact@example.com",
                "relationship": "Emergency"
            },
            {
                "firstName": "Emergency",
                "lastName": "Contact",
                "middleName": "",
                "phone": "999-999-9999",
                "email": "emergency.contact@example.com",
                "relationship": "Emergency"
            }
        ]
    }
    }
    ```

2.  Response

- **200 OK**

  ```json
  {
    "status": "success",
    "data": {
        "_id": "65d97cef342deb027e5fea05",
        "username": "testuser",
        "email": "testuser@example.com",
        "role": "employee",
        "nextStep": "ead-pending",
        "personalInfo": {
            "firstName": "John",
            "lastName": "Doe",
            "middleName": "Patrick",
            "preferredName": "John",
            "profilePicture": "https://example.com/profile.jpg",
            "ssn": "123-45-6789",
            "dateOfBirth": "1990-01-01T00:00:00.000Z",
            "gender": "Male"
        },
        "address": {
            "apt": "4444",
            "streetName": "Main St",
            "city": "Anytown",
            "state": "NY",
            "zip": "12345"
        },
        "contactInfo": {
            "cellPhoneNumber": "123-456-7890",
            "workPhoneNumber": "123-456-7890"
        },
        "employment": {
            "visaTitle": "H1-B",
            "startDate": "2023-01-01T00:00:00.000Z",
            "endDate": "2025-01-01T00:00:00.000Z"
        },
        "reference": {
            "firstName": "Jane",
            "lastName": "Doe",
            "middleName": "Marie",
            "phone": "987-654-3210",
            "email": "jane.doe@example.com",
            "relationship": "Spouse"
        },
        "driveInfo": {
            "licenseNumber": "ABCD12345",
            "expireDate": "2025-01-01T00:00:00.000Z"
        },
        "carInfo": {
            "make": "toyota",
            "model": "camry",
            "color": "white"
        },
        "emergencyContact": [
          {
            "_id": "65dbead2f93710c596046934",
            "firstName": "Emergency",
            "lastName": "Contact",
            "middleName": "",
            "phone": "999-999-9999",
            "email": "emergency.contact@example.com",
            "relationship": "Emergency"
          },
          {
            "_id": "65dbead2f93710c596046935",
            "firstName": "Emergency",
            "lastName": "Contact",
            "middleName": "",
            "phone": "999-999-9999",
            "email": "emergency.contact@example.com",
            "relationship": "Emergency"
          }
        ],
        "application": {
            "status": "waiting"
        },
        "documents": [
            {
              "url": "https://josie-hr-project-bucket.s3.us-east-2.amazonaws.com/1708886068515",
              "title": "test.pdf",
              "tag": "ead",
              "_id": "65dac77cb9db0e11c36b56d2"
            }
        ]
    }
  }
  ```

  - **403 Forbidden** - If application has not been approved.

  ```json
  {
    "status": "fail",
    "message": "Cannot edit info before application be approved"
  }
  ```

### **GET /api/user/nextstep**

Get next step of this user, if user is logged in

Next step can be anyone of below:

```
[
'application-waiting',
'application-pending',
'application-reject',
'ead-waiting',
'ead-pending',
'ead-reject',
'i20-waiting',
'i20-pending',
'i20-reject',
'i983-waiting',
'i983-pending',
'i983-reject',
'all-done',
];
```

1.  Request Body

    None

2.  Response

- **200 OK**

  ```json

  {
    "userId": "65d8ff8ab0b83f3c3da756ca",
    "nextStep": "ead-waiting"
  }

  ```

  - **200 OK** If nextStep include `-reject` will also provided feedback

  ```json

  {
    "userId": "65d8ff8ab0b83f3c3da756ca",
    "nextStep": "ead-reject",
    "feedback": "hr feedback"
  }

  ```

## APPLICATION 又叫ONBOARDING

### **POST /api/application/:userId**

User submit onboarding application. Cannot submit if application's status is not waiting.

1.  Request Body

```json
{
    "data": {
        "address": {
            "streetName": "4444"
        },
        "emergencyContact": [
            {
                "firstName": "Emergency",
                "lastName": "Contact",
                "middleName": "",
                "phone": "999-999-9999",
                "email": "emergency.contact@example.com",
                "relationship": "Emergency"
            },
            {
                "firstName": "Emergency",
                "lastName": "Contact",
                "middleName": "",
                "phone": "999-999-9999",
                "email": "emergency.contact@example.com",
                "relationship": "Emergency"
            }
        ]
        .....
    }
}
```

2.  Response

- **200 OK** - If the application post successfully.

```json
{
    "status": "success",
    "data": {
        "_id": "65d97cef342deb027e5fea07",
        "username": "applicationwaiting",
        "email": "applicationwaiting@example.com",
        "role": "employee",
        "nextStep": "application-reject",
        "emergencyContact": [
          {
            "_id": "65dbea43f93710c59604692f",
            "firstName": "Emergency",
            "lastName": "Contact",
            "middleName": "",
            "phone": "999-999-9999",
            "email": "emergency.contact@example.com",
            "relationship": "Emergency"
          },
          {
            "_id": "65dbea43f93710c596046930",
            "firstName": "Emergency",
            "lastName": "Contact",
            "middleName": "",
            "phone": "999-999-9999",
            "email": "emergency.contact@example.com",
            "relationship": "Emergency"
          }
        ],
        "application": {
            "status": "rejected",
            "feedback": "sfhklsjdss;"
        },
        "documents": [
            {
                "url": "https://josie-hr-project-bucket.s3.us-east-2.amazonaws.com/1708836661080",
                "title": "test.pdf",
                "tag": "driver-license",
                "_id": "65dac735b9db0e11c36b56cc"
            }
        ],
        "address": {
            "streetName": "4444",
            "apt": "4444"
        }
    }
}
```

- **409 Conflict** - If already submitted application.

```json
{
    "status": "fail",
    "message": "You have submitted an application, cannot submit duplicate application"
}
```

### **PATCH /api/application/:userId**

User resubmit rejected onboarding application. Cannot submit if application's status is pending'

1.  Request Body

```json
{
    "data": {
        "address": {
            "streetName": "4444"
        },
        "emergencyContact": [
            {
                "firstName": "Emergency",
                "lastName": "Contact",
                "middleName": "",
                "phone": "999-999-9999",
                "email": "emergency.contact@example.com",
                "relationship": "Emergency"
            },
            {
                "firstName": "Emergency",
                "lastName": "Contact",
                "middleName": "",
                "phone": "999-999-9999",
                "email": "emergency.contact@example.com",
                "relationship": "Emergency"
            }
        ]
        .....
    }
}
```

2.  Response

- **200 OK** - If the application resubmit successfully.

```json
{
  "status": "success",
  "data": {
      "_id": "65d974a04b5d15145383453f",
      "username": "applicationwaiting",
      "email": "applicationwaiting@example.com",
      "role": "employee",
      "nextStep": "application-pending",
      "emergencyContact": [
          {
            "_id": "65dbea43f93710c59604692f",
            "firstName": "Emergency",
            "lastName": "Contact",
            "middleName": "",
            "phone": "999-999-9999",
            "email": "emergency.contact@example.com",
            "relationship": "Emergency"
          },
          {
            "_id": "65dbea43f93710c596046930",
            "firstName": "Emergency",
            "lastName": "Contact",
            "middleName": "",
            "phone": "999-999-9999",
            "email": "emergency.contact@example.com",
            "relationship": "Emergency"
          }
        ],
      "application": {
          "status": "pending"
      },
      "documents": [],
      "address": {
          "apt": "4444",
          "streetName": "4444"
      }
  }
}
```

- **403 Forbidden** - If application is pending

```json
{
    "status": "fail",
    "message": "Application is pending, cannot edit application"
}
```

- **403 Forbidden** - If application is pending or approved

```json
{
    "status": "fail",
    "message": "Application is approved, cannot edit application"
}
```

- **404 Not Found** - If no application submitted

```json
{
    "status": "fail",
    "message": "No application found!"
}
```


---
## FILE 又叫 DOCUMENTS

### **POST /api/file/**

Upload a file, have to stay login

Tag should be anyone of these options: `['profile-picture','driver-license','opt-receipt','ead','i983','i20',]`

1.  Request Body `form-data`

```json
{
    "document": your file,
    "tag": "ead"
}
```

2.  Response

- **200 OK** - If the document is uploaded successfully.

```json
{
    "status": "success",
    "data": {
        "url": "https://josie-hr-project-bucket.s3.us-east-2.amazonaws.com/1708840348511",
        "title": "test.pdf",
        "tag": "ead",
        "nextStep": "ead-pending"
    }
}
```

# HR

## AUTH

### **POST /api/hr/signup**

Sends an email with a signup link to the specified email address.

1.  Request Body

```json
{
"email": "example@example.com",
"name": "firstname lastname"
}
```

2.  Response

- **200 OK** - If the email is sent successfully.

```json
{
  "status": "success",
  "message": "Email sent successfully"
}
```

- **500 Internal Server Error** - If there is an issue sending the email.

```json
{
  "status": "error",
  "message": "Failed to send email"
}
```

### **POST /api/hr/notify/:userId**

Sends an email to send user notify email based on user current status.

1.  Request Body

```json
    none
```

2.  Response

- **200 OK** - If the email is sent successfully.

```json
    {
    "status": "success",
    "message": "Your EAD Document has been approved, please login to your account to submit your i983 document."
    }
```

- **500 Internal Server Error** - If there is an issue sending the email.

```json
{
  "status": "error",
  "message": "Failed to send email"
}
```

---

## USER

### GET **api/user/profiles**

HR get all user info, restrict to hr role

1. Request Body
   None

2. Response

```json
{
    "status": "success",
    "data": [
        {
            "_id": "65dbdf501f245262cab78ae3",
            "username": "mosojoey",
            "email": "mosojoey@gmail.com",
            "role": "hr",
            "nextStep": "application-waiting",
            "personalInfo": {
                "preferredName": "hr"
            },
            "documents": [],
            "emergencyContact": [],
            "application": {
                "status": "waiting"
            }
        },
        {
            "_id": "65dbdf501f245262cab78ae5",
            "username": "testuser",
            "email": "testuser@example.com",
            "role": "employee",
            "nextStep": "application-waiting",
            "personalInfo": {
                "firstName": "John",
                "lastName": "Doe",
                "middleName": "Patrick",
                "preferredName": "John",
                "profilePicture": "https://example.com/profile.jpg",
                "ssn": "123-45-6789",
                "dateOfBirth": "1990-01-01T00:00:00.000Z",
                "gender": "Male"
            },
            "address": {
                "apt": "123",
                "streetName": "Main St",
                "city": "Anytown",
                "state": "NY",
                "zip": "12345"
            },
            "contactInfo": {
                "cellPhoneNumber": "123-456-7890",
                "workPhoneNumber": "123-456-7890"
            },
            "employment": {
                "visaTitle": "H1-B",
                "startDate": "2023-01-01T00:00:00.000Z",
                "endDate": "2025-01-01T00:00:00.000Z"
            },
            "reference": {
                "firstName": "Jane",
                "lastName": "Doe",
                "middleName": "Marie",
                "phone": "987-654-3210",
                "email": "jane.doe@example.com",
                "relationship": "Spouse",
                "_id": "65dbf80e9f621777bcba33e2"
            },
            "driveInfo": {
                "licenseNumber": "ABCD12345",
                "expireDate": "2025-01-01T00:00:00.000Z"
            },
            "carInfo": {
                "make": "toyota",
                "model": "camry",
                "color": "white"
            },
            "emergencyContact": [
                {
                    "_id": "65dbf80e9f621777bcba33e3",
                    "firstName": "Emergency",
                    "lastName": "Contact",
                    "middleName": "",
                    "phone": "999-999-9999",
                    "email": "emergency.contact@example.com",
                    "relationship": "Emergency"
                }
            ],
            "application": {
                "status": "waiting"
            },
            "documents": [
                "65dbe3ea2aa92598fb067b45"
            ]
        },
        {
            "_id": "65dbdf501f245262cab78aea",
            "username": "applicationreject",
            "email": "applicationreject@example.com",
            "role": "employee",
            "nextStep": "application-reject",
            "documents": [],
            "emergencyContact": [],
            "application": {
                "status": "waiting"
            }
        },
        {
            "_id": "65dbdf501f245262cab78ae8",
            "username": "applicationwaiting",
            "email": "applicationwaiting@example.com",
            "role": "employee",
            "nextStep": "application-waiting",
            "documents": [],
            "emergencyContact": [],
            "application": {
                "status": "waiting"
            }
        },
        {
            "_id": "65dbdf501f245262cab78aeb",
            "username": "eadwaiting",
            "email": "eadwaiting@example.com",
            "role": "employee",
            "nextStep": "ead-waiting",
            "documents": [],
            "emergencyContact": [],
            "application": {
                "status": "waiting"
            }
        },
        {
            "_id": "65dbdf501f245262cab78aec",
            "username": "eadpending",
            "email": "eadpending@example.com",
            "role": "employee",
            "nextStep": "ead-pending",
            "documents": [],
            "emergencyContact": [],
            "application": {
                "status": "waiting"
            }
        },
        {
            "_id": "65dbdf501f245262cab78aed",
            "username": "eadreject",
            "email": "eadreject@example.com",
            "role": "employee",
            "nextStep": "ead-reject",
            "documents": [],
            "emergencyContact": [],
            "application": {
                "status": "waiting"
            }
        },
        {
            "_id": "65dbdf501f245262cab78aee",
            "username": "i20waiting",
            "email": "i20waiting@example.com",
            "role": "employee",
            "nextStep": "i20-waiting",
            "documents": [],
            "emergencyContact": [],
            "application": {
                "status": "waiting"
            }
        },
        {
            "_id": "65dbdf501f245262cab78aef",
            "username": "i20pending",
            "email": "i20pending@example.com",
            "role": "employee",
            "nextStep": "i20-pending",
            "documents": [],
            "emergencyContact": [],
            "application": {
                "status": "waiting"
            }
        },
        {
            "_id": "65dbdf501f245262cab78af0",
            "username": "i20reject",
            "email": "i20reject@example.com",
            "role": "employee",
            "nextStep": "i20-reject",
            "documents": [],
            "emergencyContact": [],
            "application": {
                "status": "waiting"
            }
        },
        {
            "_id": "65dbdf501f245262cab78af1",
            "username": "i983waiting",
            "email": "i983waiting@example.com",
            "role": "employee",
            "nextStep": "i983-waiting",
            "documents": [],
            "emergencyContact": [],
            "application": {
                "status": "waiting"
            }
        },
        {
            "_id": "65dbdf501f245262cab78af2",
            "username": "i983pending",
            "email": "i983pending@example.com",
            "role": "employee",
            "nextStep": "i983-pending",
            "documents": [],
            "emergencyContact": [],
            "application": {
                "status": "waiting"
            }
        },
        {
            "_id": "65dbdf501f245262cab78af3",
            "username": "i983reject",
            "email": "i983reject@example.com",
            "role": "employee",
            "nextStep": "i983-reject",
            "documents": [],
            "emergencyContact": [],
            "application": {
                "status": "waiting"
            }
        },
        {
            "_id": "65dbdf501f245262cab78af4",
            "username": "alldone",
            "email": "alldone@example.com",
            "role": "employee",
            "nextStep": "all-done",
            "documents": [],
            "emergencyContact": [],
            "application": {
                "status": "waiting"
            }
        },
        {
            "_id": "65dbdf501f245262cab78ae9",
            "username": "applicationpending",
            "email": "applicationpending@example.com",
            "role": "employee",
            "nextStep": "application-pending",
            "documents": [],
            "emergencyContact": [],
            "application": {
                "status": "waiting"
            }
        },
        {
            "_id": "65dbe41d2aa92598fb067b50",
            "username": "testuser2",
            "email": "test2@gmail.com",
            "role": "employee",
            "nextStep": "i983-waiting",
            "emergencyContact": [
                {
                    "firstName": "Emergency",
                    "lastName": "Contact",
                    "middleName": "",
                    "phone": "999-999-9999",
                    "email": "emergency.contact@example.com",
                    "relationship": "Emergency",
                    "_id": "65dbebbdf93710c596046952"
                },
                {
                    "firstName": "Emergency",
                    "lastName": "Contact",
                    "middleName": "",
                    "phone": "999-999-9999",
                    "email": "emergency.contact@example.com",
                    "relationship": "Emergency",
                    "_id": "65dbebbdf93710c596046951"
                }
            ],
            "application": {
                "status": "approved"
            },
            "address": {
                "streetName": "4444",
                "apt": "4444"
            }
        }
    ]
}
```

- **403 Forbidden** If employee role try to modify
  ```json
  {
    "status": "fail",
    "message": "You do not have permission to perform this action"
  }
  ```

## APPLICATION 又叫ONBOARDING

### **PUT api/application/:userId**

HR change application status, restrict to hr role

1. Request Body

   **Action value can only be `approve` or `reject`**
   **If Action is reject, MUST have a feedback**

   ```json
    {
      "action": "reject",
      "feedback": "some feedback..."
    }
   ```

   ```json
    {
      "action": "approve"
    }
   ```

2. Response

- **200 OK**

  ```json

  {
    "nextStep": "application-reject",
    "applicationStatus": "rejected"
  }
  ```

  ```json

  {
    "nextStep": "ead-waiting",
    "applicationStatus": "approved"
  }
  ```

- **403 Forbidden** If employee role try to modify
  ```json
  {
    "status": "fail",
    "message": "You do not have permission to perform this action"
  }
  ```

## ## FILE 又叫 DOCUMENTS

### **GET api/file/:docID**

HR get document info, restrict to hr role

1. Request Body

   None

2. Response

- **200 OK** In this example, employee nextStep will change to `ead-reject`

  ```json

  {
    "status": "success",
    "data": {
        "_id": "65dff837d31997abcf6f99aa",
        "url": "https://josie-hr-project-bucket.s3.us-east-2.amazonaws.com/1709176887662",
        "title": "test.pdf",
        "tag": "driver-license"
        }
    }
  ```

### **PUT api/document/**

HR change document status, restrict to hr role

1. Request Body

   **Action value can only be `approve` or `reject`**
   **If Action is reject, MUST have a feedback**

   ```json
    {
    "userId": "65dbe41d2aa92598fb067b50",
    "docId": "65dbec04f93710c59604695d",
    "action": "reject",
    "feedback": "kdkahsahsaskl"
    }
   ```

   ```json
    {
    "userId": "65dbe41d2aa92598fb067b50",
    "docId": "65dbec04f93710c59604695d",
    "action": "approve"
    }
   ```

2. Response

- **200 OK** In this example, employee nextStep will change to `ead-reject`

  ```json

  {
    "status": "success",
    "data": {
        "doc": {
            "_id": "65dbec04f93710c59604695d",
            "url": "https://josie-hr-project-bucket.s3.us-east-2.amazonaws.com/1708911620410",
            "title": "test.pdf",
            "tag": "ead",
            "status": "rejected",
            "feedback": "kdkahsahsaskl"
        }
    }
  }
  ```

- **200 OK** In this example, employee nextStep will change to `i983-waiting`

  ```json

  {
    "status": "success",
    "data": {
        "doc": {
            "_id": "65dbec04f93710c59604695d",
            "url": "https://josie-hr-project-bucket.s3.us-east-2.amazonaws.com/1708911620410",
            "title": "test.pdf",
            "tag": "ead",
            "status": "approved",
            "feedback": "kdkahsahsaskl"
        }
    }
  }
  ```

- **403 Forbidden** If employee role try to modify
  ```json
  {
    "status": "fail",
    "message": "You do not have permission to perform this action"
  }
  ```

## TOKEN HISTORY

### **GET api/hr/tokenhistory**

 restrict to hr role

1. Request Body
   None

2. Response

```json

  {
    "status": "success",
    "data": [
        {
            "_id": "65e01c3de3eadb43ef31897e",
            "email": "test3@gmail.com",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QzQGdtYWlsLmNvbSIsImlhdCI6MTcwOTE4NjEwOCwiZXhwIjoxNzA5MTk2OTA4fQ.68X_KeZ4wOS2-aeUK1mc2oGLET98tg6-ks5_PV15l9s",
            "personName": "Josie Yan",
            "status": "pending"
        }
    ]
}

```

- **403 Forbidden** If employee role try to modify
  ```json
  {
    "status": "fail",
    "message": "You do not have permission to perform this action"
  }
  ```
