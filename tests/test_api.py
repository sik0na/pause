from app import app

client = app.test_client()

def test_home_page():
    response = client.get("/")
    assert response.status_code == 200

def test_analyze_gives_back_json():
    response = client.post("/api/analyze", json = {"text": "I miss my family so much"})
    assert response.status_code == 200
    data = response.get_json()
    assert data["emotion"]["emotion"] == "sadness"
    assert "home" in data["topics"]
    assert data["support"]["message"] != ""

def test_empty_text_is_an_error():
    response = client.post("/api/analyze", json={"text": " "})
    assert response.status_code == 400
    assert "error" in response.get_json()

def test_no_json_at_all_is_an_error():
    assert client.post("/api/analyze").status_code == 400