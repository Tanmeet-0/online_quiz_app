# Online Quiz Application

A quiz website where you can attempt various quizzes, switch between questions, view your score and view the questions you got correct and incorrect.

Made using Django and SQLite for the backend, and React, React-Router and Typescript for the frontend.

# Requirements

-   Python version 3.12.4 or higher from [https://www.python.org/downloads/](https://www.python.org/downloads/)
-   Node.js version 22.20.0 or higher from [https://nodejs.org/en/download](https://nodejs.org/en/download)

Make sure both Python and Node.js are added to your operating system's PATH.

# Installing The Application

Either download or clone the repository and go into the project's directory

```bash
git clone https://github.com/Tanmeet-0/online_quiz_app.git
cd online_quiz_app
```

## Automatic Setup

If you are using Bash shell you can automatically setup both frontend and backend by running the setup script:

```bash
./application_setup.sh
```

## Manual Setup

If you are not using Bash shell or the setup script does not work, you can follow these instructions to setup the project :

1. Go into the django backend directory

    ```bash
    cd django_backend
    ```

2. Create a python virtual environment

    ```bash
    python -m venv virtual_env
    ```

3. Activate the python virtual environment

    - If you are using Bash Shell

        ```bash
        source virtual_env/Scripts/activate
        ```

    - If you are using Windows Command Prompt
        ```bat
        virtual_env/Scripts/activate.bat
        ```

4. Install all the required Python libraries in the virtual environment

    ```bash
    pip install -r requirements.txt
    ```

5. Create the SQLite database

    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```

6. Load the sample quizzes into the database

    ```bash
    python manage.py load_sample_quizzes sample_quizzes.json
    ```

7. Deactivate the virtual environment

    ```bash
    deactivate
    ```

8. Go into the react frontend directory

    ```bash
    cd ..
    cd react_frontend
    ```

9. Install all the required node dependencies
    ```bash
    npm install
    ```

# Running The Application

## Automatically Starting Servers

If you are using Bash shell you can automatically start the servers using a bash script :

```bash
./start_dev_servers.sh
```

## Manually Starting Servers

If you are not using Bash shell or the bash script does not work, you can follow these instructions to start the servers :

1. In a new terminal, go into the django backend directory

    ```bash
    cd django_backend
    ```

2. Activate the python virtual environment

    - If you are using Bash Shell

        ```bash
        source virtual_env/Scripts/activate
        ```

    - If you are using Windows Command Prompt
        ```bat
        virtual_env/Scripts/activate.bat
        ```

3. Start the backend server

    ```bash
    python manage.py runserver
    ```

4. In another new terminal, go into the react backend directory

    ```bash
    cd react_frontend
    ```

5. Start the frontend server
    ```bash
    npm run dev
    ```

---

After starting the servers, Visit [http://localhost:5173](http://localhost:5173) to view the application.

# Design Choices I Made

1. The quiz only supports Multiple Choice Questions.

2. The quizzes can be replayed any number of times.

3. No user friendly way to create new quizzes. Currently new quizzes can be made using either the Django admin site, the `load_sample_quizzes` command of manage.py or by manually modifying the database.

4. Decided to remove csrf protection from the django api because the django api only receives cross site requests and a cross site request cannot provide csrf protection.
