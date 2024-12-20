

## First Setup

You need to have python 3.11 installed

### Navigate to the backend service
```
cd ./services/backend
```

### Create a virtual environment
[Dokumentation](https://docs.python.org/3/library/venv.html)

```
python -m venv venv
```
### activate a virtual environment
bash/zsh:   `source ./venv/bin/activate`\
fish:       `source ./venv/bin/activate.fish`\
csh/tcsh:   `source ./venv/bin/activate.csh`\
pwsh:       `./venv/bin/Activate.ps1`\

cmd:        `.\venv\Scripts\activate.bat`\
PowerShell: `.\venv\Scripts\Activate.ps1`\

### Install python dependicies

```
pip install -r requirements.txt
```

### Set up the Environment Variables

copy the the values from the .env.template in to a .env file in the same directory

### Only start the db

Make sure you ran the main docker compose file first

`docker compose -f "docker-compose-db.yaml" up -d`


### First migration

Depending on in which directory you are you can run on of the follwoing commands
```
python manage.py migrate

python services/backend/manage.py migrate
```

### Run server

```
python manage.py runserver

python services/backend/manage.py runserver
```