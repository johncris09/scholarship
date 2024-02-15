# scholarship
Upgraded system from  [Oroqscholarship](https://oroquietacity.net/oroqscholarship/#/login).
- Previous repo [Oroqscholarship](https://github.com/johncris09/oroqscholarship)
 
## Huge Update

- Switch database approach from [denormalization](https://en.wikipedia.org/wiki/Denormalization)  to [normalization](https://en.wikipedia.org/wiki/Database_normalization)
- In registration, remove unnecessary fields
- Create identifier to distinguish a particular entity within a system or context.

```
# identifier

C2-2425-AB-013024

C             # C - College, S - Senior High - T - Tvet 
2             # 1 - 1st Semester, 2 - 2nd Semester
-
2425          # School Year ex. 2024-2025
-
A             # First Name abbreviation
B             # Last Name abbreviation
-
013024        # Birth Date
```

## Requirements
- [Nodejs](https://nodejs.org/en)
- [XAMPP](https://www.apachefriends.org/) (windows) or LAMPP (linux)


## Quick Start
- Clone the repo: `https://github.com/johncris09/scholarship.git`


#### <i>Prerequisites</i>

##### Before you begin,
- move package.json/package.json to project/package.json
- rename api/application/config/database_development.php to database.php 
- rename api/application/config/config_development.php to config.php
- change the ```$config['base_url'] = '' ```
- in client/.env_development, fill in the following
```
# .env
REACT_APP_DEVELOPER=DEVELOPER_NAME
REACT_APP_IS_DEVELOPMENT=false
REACT_APP_BASEURL_DEVELOPMENT=BACKEND_FOLDER
REACT_APP_BASEURL_PRODUCTION=BACKEND_FOLDER_IN_WEBSITE
REACT_APP_USERNAME=API_USERNAME
REACT_APP_PASSWORD=API_PASSWORD
REACT_APP_DATE_UPDATED=DATE_UPDATED
REACT_APP_STATUS_APPROVED_KEY=SECKRET_KEY
REACT_APP_MINUTES_NO_ACTIVITY=MINUTES
```
```

# api/application/config/rest.php
$config['rest_valid_logins'] = [username => password];

# .env
  REACT_APP_USERNAME must same as  $config['rest_valid_logins'][username]
  REACT_APP_USERNAME must same as  $config['rest_valid_logins'][password]
```



## Folder Structure
```
├── project
│   ├── node_modules
│   ├── scholarship
│   │   ├── api
│   │   ├── client
│   ├── package.json
```

### Installation

``` bash
# navigate to project folder
$ npm install
$ npm update
```

### Basic usage

``` bash
# navigate to scholarship folder
$ npm start
```

#### Build 

```bash
# navigate to scholarship folder
# build for production with minification
$ npm run build
```

