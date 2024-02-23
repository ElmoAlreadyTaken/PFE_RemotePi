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

def test_unregister_robot(client):
    data = {"id": 0}
    response = client.post('/unregister', json=data)
    assert response.status_code == 200

def test_get_robots(client):
    response = client.get('/robots')
    assert response.status_code == 200

def test_get_robot(client):
    robot_id = '0'
    response = client.get(f'/robots/{robot_id}')
    assert response.status_code == 200

def test_get_free_robots(client):
    response = client.get('/robots/free')
    assert response.status_code == 200

def test_free_robot(client):
    # Register a new reserved robot
    data = {
        "ip": "192.168.1.13",
        "board": "Esp32",
        "reserved": True
    }
    res = client.post('/register', json=data).get_json()
    robot_id = res['id']

    response = client.post(f'/free/{robot_id}')
    assert response.status_code == 200

def test_camera_start_stop(client):
    start_data = {"command": "start"}
    response = client.post('/camera', json=start_data)
    assert response.status_code == 200

    stop_data = {"command": "stop"}
    response = client.post('/camera', json=stop_data)
    assert response.status_code == 200

def test_log_post_get(client):
    post_data = {"message": "Test log message"}
    response = client.post('/log', json=post_data)
    assert response.status_code == 200

    response = client.get('/log')
    assert response.status_code == 200
    assert "Test log message" in response.get_data(as_text=True)