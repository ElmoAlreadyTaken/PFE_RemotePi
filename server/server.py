from flask import Flask, request, send_from_directory, Response, jsonify, redirect
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint
import subprocess
import os
import shutil
import enum
import json
import random
import datetime

########## SWAGGER DOC ##########
SWAGGER_URL = '/doc'  # URL for exposing Swagger UI (without trailing '/')
API_URL = '/swagger.yaml'  # URL to access swagger.yaml file
TEMPLATE_PATH = 'template.ino' # Path to the template file

# Call factory function to create our blueprint
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={  # Swagger UI config overrides
        'app_name': "RemotePi API"
    }
)

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

# Register blueprint at URL
# (URL must match the one given to factory function above)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

# Serve Swagger YAML file
@app.route('/swagger.yaml')
def swagger_yaml():
    return send_from_directory('.', 'server.yml')
#################################

#### Custom JSON encoder for Robot class ####
class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Robot):
            return obj.json()
        return json.JSONEncoder.default(self, obj)

#app.json_encoder = CustomJSONEncoder
    
########## ROBOT CLASS ##########
class Robot:
    """Robot class
    """
    BOARDS = enum.Enum('Boards', ['Esp32' , 'Rpbpi', 'Arduino']) # Enumeration of the compatible boards for the robot
    STATUS = enum.Enum('Status', ['Free' , 'Reserved', 'Busy']) # Enumeration of the possible status of a robot

    def __init__(self, id, status, board, ip=None):
        self.id = id
        self.status = status
        self.board = board
        self.ip = ip
        self.filename = None

    def __repr__(self):
        return f'<Robot {self.id} ({self.board}) : {self.status} - {self.ip}>'

    def __str__(self):
        return f'<Robot {self.id} ({self.board}) : {self.status} - {self.ip}>'
    
    def json(self):
        return {'id': self.id, 'status': self.status.name, 'board': self.board.name, 'ip': self.ip}
    
    def get_id(self):
        return self.id
    
    def get_ip(self):
        return self.ip
    
    def get_status(self):
        return self.status
    
    def get_board(self):
        return self.board
    
    def get_filename(self):
        return self.filename
    
    def set_filename(self, filename):
        self.filename = filename
    
    def reserve(self):
        """Reserve the robot, only if it is free
        """
        if self.status == Robot.STATUS.Free:
            self.status = Robot.STATUS.Reserved
            return True
        else:
            print(f"[!] Can't reserve Robot <{self.id}>. Robot is not free !")
            return False
    
    def free(self):
        """Free the robot, only if it is reserved or busy
        """
        if self.status == Robot.STATUS.Reserved or self.status == Robot.STATUS.Busy:
            self.status = Robot.STATUS.Free
            return True
        else:
            return False
    
    def matches(self, filter: dict[str, str]) -> bool:
        """Check if the robot matches the filter
        """
        for key, value in filter.items():
            if key == 'board':
                if self.board != value:
                    return False
            elif key == 'status':
                if self.status != value:
                    return False
            else:
                print(f"[!] Invalid filter key <{key}>")
                return False
        return True
    
############################

########## RobotsManager CLASS ##########
class RobotsManager:
    def __init__(self, robotsList: list[Robot]):
        self.robots = robotsList
    
    def __repr__(self):
        return f"<Robots :\n" + "\n\t -".join(self.robots)
    
    def __str__(self):
        return f"<Robots :\n" + "\n\t -".join(self.robots)
    
    def json(self):
        return [robot.json() for robot in self.robots]
    
    def get_robots(self) -> list[Robot]:
        return self.robots
    
    def get_robot(self, id: int) -> Robot:
        try:
            id = int(id)
        except ValueError:
            print(f"[!] Invalid robot ID <{id}>")
            return Response(f'Invalid robot ID <{id}>', 400)

        return self.robots[id]
    
    def reserve(self, id: int) -> bool:
        res = self.get_robot(id).reserve()
        if res:
            return {'message': f'Robot <{id}> reserved successfully'}
        else:
            return Response(f'Robot <{id}> not found or already in use', 400)
    
    def free(self, id: int) -> bool:
        return self.get_robot(id).free()
    
    def get_status(self, id: int) -> bool:
        return self.get_robot(id).get_status()
    
    def get_board(self, id: int) -> bool:
        return self.get_robot(id).get_board()
    
    def get_matching_robots(self, filter:dict[str, str] = None) -> list[Robot]:
        return [robot.json() for robot in self.robots if robot.matches(filter)]
    
    def get_free_robots(self, board=None):
        # Look for free robots
        filter = {'status': Robot.STATUS.Free}

        if board is not None:
            # Board type was checked in the get_free_robots() method
            filter['board'] = board
                
        return self.get_matching_robots(filter)
    
    ### Registering robots
    def get_next_id(self) -> int:
        return len(self.robots)
    
    def create(self, board_type: str, ip: str) -> Robot:
        """Create a new robot but does NOT register it to the RobotsManager.
        Used as a helper function for the register() method.
        You need to call register(robot) after to register the robot to the RobotsManager.
        """
        # Check if board type is valid
        if board_type is None:
            print(f"[!] Invalid board type <{board_type}>")
            return None
        
        id = self.get_next_id()
        status = Robot.STATUS.Free
        board = Robot.BOARDS[board_type]

        robot = Robot(id, status, board, ip)
        
        return robot
    
    def register(self, robot: Robot):
        """Register a robot to the RobotsManager
        """
        self.robots.append(robot)

    def unregister(self, id:int) -> bool:
        """Unregister a robot to the RobotsManager
        """
        for robot in self.robots:
            if robot.get_id() == id:
                # self.robots.remove(robot)
                robot.free()
                return True
        return False
        
############################

########### GIT ###########
LOG_BUNDLE = [] # List to store log messages waiting for the web interface to read them

def is_valid_file(filename):
    allowed_extensions = {'py', 'java', 'cpp', 'c', 'ino', 'bin'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

def init_hook(ip, filename, branch):
    if not os.path.exists('post-update.template'):
        print('[-] post-update.template not found !')
        return False
    if not os.path.exists('RemotePiServer/hooks'):
        print('[-] RemotePiServer/hooks not found !')
        return False
    
    # Add .bin if file does not end with it (support for .ino files)
    if not filename.endswith('.bin'):
        filename += '.bin'

    # Init the post-update hook with the robot's IP
    with open('post-update.template', 'r') as f:
        hook_template = f.read()
    
    with open('RemotePiServer/hooks/post-update', 'w') as f:
        f.write(hook_template.format(esp_ip=ip, filename=filename, branch=branch))
    
    print('[+] `post-update` hook initialized with robot IP :', ip, ', filename :', filename, 'and branch :', branch)

    return True

@app.route('/upload', methods=['POST']) # Rename this route to /push
def upload_file():
    # Check if the post request has the file part
    if 'file' not in request.files:
        return Response('[-] Missing file argument', 400)

    file = request.files['file']

    print('Longueur du fichier : ', file)

    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file.filename == '':
        print('[-] No code file uploaded')
        return Response('No code file uploaded', 400)

    # Check if it's an allowed file type
    if not is_valid_file(file.filename):
        print('[-] Invalid file type')
        return Response('Invalid file type', 400)
    
    # Check if the file contains the template
    #template = get_template()
    #if template is None or len(template) == 0 or len(template.split('\n')) == 0:
        #print('[-] Template file not found !')
        #return Response('Template file not found !', 400)
    
    #fileContent = file.read().decode('utf-8')
    
    #print('[.] File content :', fileContent[50:])

    # Check if every line in the template is present in the file content
    #includesTemplate = all(line.strip() in fileContent for line in template.split('\n'))
    #if not includesTemplate:
        #print('[-] File does not contain the template !')
        #return Response('File does not contain the template !', 400)
    
    # Check if robot ID is present
    if request.form.get('robotId', None) is None:
        print("[-] Missing 'robotId' key in form data")
        return Response("Missing 'robotId' key in form data", 400)
    
    # Check if given robot ID is valid (int only)
    robotId = request.form['robotId']
    if not robotId.isdigit():
        print(f'[-] Invalid robotId : {robotId}')
        return Response('Invalid robotId !', 400)
    
    # Check if robot was registered with a valid IP
    robotIp = robotsManager.get_robot(robotId).get_ip()
    if robotIp is None:
        print(f'[-] Robot <{robotId}> was not registered with a valid IP')
        return Response(f'Robot <{robotId}> was not registered with a valid IP', 400)
    
    # Generate branch from robotId
    branch = f"Robot-{robotId}"

    print('[+] Branch is :', branch)
    # If all checks are successful, save the file to disk
    filename = file.filename
    file.save(filename)

    if not os.path.exists('./post-update.template'):
        print('[-] post-update.template not found !')
        return Response('post-update.template not found !', 400)
    
    if not os.path.exists('./clean.sh'):
        print('[-] clean.sh not found !')
        return Response('clean.sh not found !', 400)
    
        #shutil.rmtree('./LocalPiServer', ignore_errors=True)
    subprocess.run(['./clean.sh'], check=True)

    print('[.] Ran clean.sh successfully !')
    
    # Init hook template with robot IP, filename, and branch
    res = init_hook(robotIp, filename, branch)
    if not res:
        print('[-] Error initializing the post-update hook')
        return Response('Error initializing the post-update hook', 400)
    
    # Git clone the 'remote' repo to 'LocalPiServer'
    subprocess.run(['git', 'clone', './RemotePiServer', 'LocalPiServer'], check=True)
    
    # Init git config variables, needed to commit
    subprocess.run(['git', '-C', './LocalPiServer', 'config', 'user.name', 'RemotePi'], check=True)
    subprocess.run(['git', '-C', './LocalPiServer', 'config', 'user.email', 'remotepi@dev.com'], check=True)
    
    # Git checkout dev branch (replace with robot1/2/3/etc. branch later)
    subprocess.run(['git', '-C', './LocalPiServer', 'checkout', '-b', branch], check=True)

    ### COMPILATION LOGIC ###

    # If its a .ino file, compile it
    if filename.endswith('.ino'):
        # Create a directory with the same name as the file (without extension)
        sketch_folder = os.path.splitext(filename)[0]
        os.makedirs(os.path.join(sketch_folder), exist_ok=True)
        
        # Copy the file to the sketch folder
        file_path = os.path.join(sketch_folder, filename)
        shutil.copy(filename, file_path)

        # Create compiledCode directory inside it to store compilation files
        # compile_folder_path = os.path.join(sketch_folder, 'compiledCode')
        #os.makedirs(compile_folder_path, exist_ok=True)

        # Save current working directory path
        cwd = os.getcwd()

        # Change current working directory to the sketch folder
        # Needed to compile the .ino file correctly
        os.chdir(sketch_folder)

        compile_folder_path = os.path.join(sketch_folder, 'compiledCode')

        # Compile the .ino file
        compile_command = ['arduino-cli', 'compile', '--fqbn', 'esp8266:esp8266:nodemcu', '--build-path', 'compiledCode']
        compile_result = subprocess.run(compile_command, capture_output=True, text=True)
        
        # Change the working directory back to the folder containing this script
        os.chdir(cwd)

        # Check if compilation was a success
        if compile_result.returncode == 0:
            print("[+] Compilation successful !")
        else:
            print(f"[-] Compilation failed: {compile_result.stderr}")
            # Remove the sketch folder
            shutil.rmtree(sketch_folder, ignore_errors=True)
            # Return error to web interface
            return Response(f'[-] Compilation failed: {compile_result.stderr}', 400)
        
        # Update the filename for the `git add` command
        filename = filename + '.bin' # Update the filename for the `git add` command
        
        # Finally, copy the .bin file to the LocalPiServer git folder
        compiled_file_path = os.path.join(compile_folder_path, filename)
        copy_dst_path = os.path.join('.', 'LocalPiServer', filename)

        print(f'[.] Copying .bin file from <{compiled_file_path}> to <{copy_dst_path}>')

        shutil.copy(compiled_file_path, copy_dst_path)

        print(f'[.] Removing compilation files from <{sketch_folder}>')

        # And remove the sketch folder
        shutil.rmtree(sketch_folder, ignore_errors=True)
        
    #########################
    
    else:
        # Simply move the file to the local repo
        os.rename(filename, f'./LocalPiServer/{filename}')

    # Git add & commit on the local repo
    subprocess.run(['git', '-C', './LocalPiServer', 'add', filename], check=True)
    subprocess.run(['git', '-C', './LocalPiServer', 'commit', '-m', f'[+] Added {filename}'], check=True)
    
    # Git push to the 'remote' (final) repo
    subprocess.run(['git', '-C', './LocalPiServer', 'push', 'origin', branch, '--set-upstream', '--force'], check=True)

    # Set robot filename to the uploaded file
    robot = robotsManager.get_robot(robotId)
    robot.set_filename(filename)

    return {'message': 'File uploaded and committed successfully'}

@app.route('/run', methods=['POST']) # Rename to /upload
def run_file():
    """This uploads a specific code to a specific robot
    """
    j = request.json

    robotId = j.get('robotId', None)
    if robotId is None:
        return Response("Missing parameter 'robotId'", 400)
    
    robot = RobotsManager.get_robot(robotId)
    if robot is None:
        return Response(f'Could not find any robot with ID : {robotId}', 400)
    
    robotIp = robot.get_ip()
    filename = robot.get_filename()
    branch = f'Robot-{robotId}'

    # Checkout the remote repo on the chosen branch
    subprocess.run(['git', '-C', './RemotePiServer', 'checkout', branch], check=True)

    # On va dire qu'on connaît l'IP du robot (sinon c'est ciao)
    subprocess.run(['curl', '-F', f'image=@{filename}', f'http://{robotIp}/update'], check=True)

    print("[+] Published code to ESP")

############################

########## ROBOTS ##########
def get_template():
    if not os.path.exists(TEMPLATE_PATH):
        return None
    
    with open(TEMPLATE_PATH, 'r') as f:
        template = f.read()
    return template

@app.route('/')
def redirect_doc():
    return redirect('/doc')

@app.route('/template', methods=['GET'])
def template():
    """Retrieve the template file for the Arduino code.
    Return the content of the template file as a JSON {'template': str}
    """
    template = get_template()
    if template is None:
        return Response('Template file not found !', 400)
    
    return {'template': template}

@app.route('/register', methods=['POST'])
def register_robot():
    """Create and register a new robot
    """
    # Check ip parameters are presents
    j = request.json
    if 'ip' not in j or 'board' not in j or 'reserved' not in j:
        print('[-] Missing parameter "ip" or "board" or "reserved"')
        return Response('Missing parameter "ip" or "board" or "reserved"', 400)
    
    # Get board type from JSON body
    board = request.json['board']
    ip = request.json['ip']
    reserved = request.json['reserved']

    # Create the robot from the given board type
    robot = robotsManager.create(board, ip)
    if robot is None:
        print(f'[-] Error creating robot. Please check the board type : {board}')
        return Response('Error creating robot. Please check the board type', 400)
    
    # Register the robot to the RobotsManager
    robotsManager.register(robot)

    # Mark the robot as reserved
    if reserved:
        res = robot.reserve()
        if res == False:
            print(f'[-] Error reserving robot <{robot.id}>')
            return Response(f'Error reserving robot <{robot.id}>', 400)

    return robot.json()

@app.route('/unregister', methods=['POST'])
def unregister_robot():
    """Unregister an existing robot
    """
    # Get robot ID from JSON body
    id = request.json['id']

    # Unregister the robot
    res = robotsManager.unregister(id)
    if res:
        return {'message': f'Robot <{id}> unregistered successfully'}
    else:
        return Response(f'Robot <{id}> not found', 400)

@app.route('/robots', methods=['GET'])
def get_robots():
    """Returns a list of all robots that are currently known to the Raspberry Pi
    """
    return robotsManager.json()

@app.route('/robots/<robot_id>', methods=['GET'])
def get_robot(robot_id):
    """Returns the information of a robot given its ID
    """
    return robotsManager.get_robot(robot_id).json()

@app.route('/robots/<robot_id>/status', methods=['GET'])
def get_robot_status(robot_id):
    """Returns the status of a robot given its ID
    """
    res = robotsManager.get_status(robot_id)
    if res is None:
        return Response(f'Robot <{robot_id}> not found', 400)
    return res

@app.route('/robots/free', strict_slashes=False, methods=['GET'])
def get_free_robots():
    """Get a list of all free Robots.
    If a board type is specified as a query parameter, only return the free robots of that type of board
    """
    args = request.args
    board = args.get('board', None)

    if board is None:
        return robotsManager.get_free_robots()
    
    # Check if board type is valid
    elif board not in [b.name for b in Robot.BOARDS]:
        return Response(f'Invalid board type : {board}', 400)
    
    return robotsManager.get_free_robots(Robot.BOARDS[board])

@app.route('/free/<robot_id>', methods=['POST'])
def free_robot(robot_id):
    """Free a robot given its ID
    """
    res = robotsManager.free(robot_id)
    if res:
        return {'message': f'Robot <{robot_id}> freed successfully'}
    else:
        return Response(f'Robot <{robot_id}> was either not found, or already free', 400)

############################

########## CAMERA ##########
@app.route('/camera', methods=['POST'])
def camera():
    j = request.json
    print('[.] Received JSON :', j)
    command = j.get('command', None)

    print('[.] Command :', command)

    # Check if command parameter is present
    if command is None:
        return Response("Missing parameter 'command'", 400)

    # Start the camera using mediamtx
    if command == 'start':
        # Start the camera using mediamtx
        try:
            subprocess.Popen(['./mediamtx'], cwd='./camera') # Assuming 'mediamtx' is the command to start the camera
            return {"message": "Camera started successfully"}
        except Exception as e:
            print('[!!] Error starting camera :')
            print(e)
            return Response(str(e), 500)
    # Stop the mediamtx process
    elif command == 'stop':
        # Stop the mediamtx process
        try:
            subprocess.call(['pkill', '-f', 'mediamtx'])  # Kill the process by name
            return {"message": "Camera stopped successfully"}
        except Exception as e:
            print('[!!] Error stopping camera :')
            print(e)
            return Response(str(e), 500)
    else:
        return Response("Invalid command. Must be 'start' or 'stop'", 400)
    
############################

########## LOGS ##########
@app.route('/log', methods=['POST','GET'])
def log():
    if request.method == 'POST':
        # Extract json data from the request
        try:
            log_message = request.json
        except:
            print("[-] Invalid JSON format")
            return Response('Invalid JSON format', 400)
        
        # Add the time to the log message
        date = datetime.datetime.now().strftime("%H:%M:%S.%f")[:-4]
        log_message['time'] = date

        LOG_BUNDLE.append(log_message)
        print("[+] Received JSON log :", log_message)

        return jsonify({"message":"Logs successfully posted!"})
    elif request.method == 'GET':
        print("[+] Web Interface is reading logs!")
        response = LOG_BUNDLE.copy()
        LOG_BUNDLE.clear() # Clear the log bundle after sending it to the web interface
        print("[+] Logs sent to web interface : ", response)
        return jsonify(response)
    else:
        print("[-] Invalid request method : ", request.method)
        return Response('Invalid request method', 400)
############################

##### INIT ROBOTS LIST #####
N = 6
robots = [Robot(id, random.choice(list(Robot.STATUS)), random.choice(list(Robot.BOARDS))) for id in range(N)]
robotsManager = RobotsManager(robots)

if __name__ == '__main__':
    app.run('0.0.0.0', debug=True, port=5000, use_reloader=False)