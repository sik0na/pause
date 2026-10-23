from app import app

def logged_in_client():
    client = app.test_client()
    client.post("/api/signup", json={"username": "anna", "password": "sunflower123"})
    return client
def test_home_page():
    assert app.test_client().get("/").status_code == 200

def test_analyze_needs_login():
    response = app.test_client().post("/api/analyze", json={"text": "hello"})
    assert response.status_code == 401

def test_analyze_gives_back_json():
    client = logged_in_client()
    response = client.post("/api/analyze", json={"text": "I miss my family so much"})
    assert response.status_code == 200
    data = response.get_json()
    assert data["emotion"]["emotion"] == "sadness"
    assert "home" in data["topics"]

def test_empty_text_is_an_error():
    client = logged_in_client()
    assert  client.post("/api/analyze", json={"text": " "}).status_code == 400
    assert client.post("/api/analyze").status_code == 400

other = app.test_client()

def test_signup_checks():
    client = app.test_client()
    assert client.post("/api/signup", json={"username": "ai", "password": "sunflower123"}).status_code == 400
    assert client.post("/api/signup", json={"username": "anna", "password": "short"}).status_code == 400
    assert client.post("/api/signup", json={"username": "anna", "password": "sunflower123"}).status_code == 200
    assert other.post("/api/signup", json={"username": "anna", "password": "sunflower123"}).status_code == 400

def test_login_and_logout():
    client = logged_in_client()
    assert client.get("/api/me").get_json() == {"logged_in": True, "username": "anna"}
    client.post("/api/logout")

    assert client.get("/api/me").get_json()["logged_in"] is False
    assert client.post("/api/login", json={"username": "anna", "password":"wrong-password"}).status_code == 401
    assert client.post("/api/login", json={"username":"anna", "password": "sunflower123"}).status_code == 200
    assert client.get("/api/me").get_json()["logged_in"] is True
    
