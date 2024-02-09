import pytest
from server.server import app as flask_app

@pytest.fixture
def app():
    yield flask_app

@pytest.fixture
def client(app):
    return app.test_client()

def test_swagger_yaml(client):
    response = client.get('/swagger.yaml')
    assert response.status_code == 200

def test_redirect_doc(client):
    response = client.get('/')
    assert response.status_code == 302  # Redirects to /doc

def test_template(client):
    response = client.get('/template')
    assert response.status_code == 200

def test_register_robot(client):
    data = {
        "ip": "192.168.1.2",
        "board": "Esp32",
        "reserved": False
    }
    response = client.post('/register', json=data)
    assert response.status_code == 200
    assert "Robot registered successfully" in response.get_data(as_text=True)

def test_unregister_robot(client):
    # Assuming there's a robot with ID 0 to unregister for this test
    # You might need to adjust this based on your setup
    data = {"id": 0}
    response = client.post('/unregister', json=data)
    assert response.status_code == 200

def test_get_robots(client):
    response = client.get('/robots')
    assert response.status_code == 200

def test_get_robot(client):
    # Assuming there's a robot with ID 0 to get for this test
    robot_id = '0'  # Adjust based on your setup
    response = client.get(f'/robots/{robot_id}')
    assert response.status_code == 200

def test_get_free_robots(client):
    response = client.get('/robots/free')
    assert response.status_code == 200

def test_free_robot(client):
    # Assuming there's a robot with ID 0 to free for this test
    robot_id = '0'  # Adjust based on your setup
    response = client.post(f'/free/{robot_id}')
    assert response.status_code == 200

def test_camera_start_stop(client):
    # Test starting the camera
    start_data = {"command": "start"}
    response = client.post('/camera', json=start_data)
    assert response.status_code == 200

    # Test stopping the camera
    stop_data = {"command": "stop"}
    response = client.post('/camera', json=stop_data)
    assert response.status_code == 200

def test_log_post_get(client):
    # Post a log message
    post_data = {"message": "Test log message"}
    response = client.post('/log', json=post_data)
    assert response.status_code == 200

    # Get log messages
    response = client.get('/log')
    assert response.status_code == 200
    assert "Test log message" in response.get_data(as_text=True)