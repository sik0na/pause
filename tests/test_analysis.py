from analysis import analyze, clean_text

EMOTIONS = ["anger", "disgust", "fear", "joy", "neutral", "sadness", "surprise"]


def test_clean_text():
    assert clean_text("  hello    world  ") == "hello world"
    assert clean_text("look at https://example.com now") == "look at now"
    assert len(clean_text("a" * 5000)) == 1000


def test_empty_text_gives_an_error():
    assert "error" in analyze("    ")


def test_full_analysis():
    result = analyze("I can't sleep because of my exam tomorrow")
    assert result["safety"] is None
    assert "sleep" in result["topics"]
    assert result["emotion"]["emotion"] in EMOTIONS


def test_safety_comes_through():
    assert analyze("I want to die")["safety"] == "crisis"


def test_works_in_mongolian():
    assert "physical" in analyze("Миний толгой өвдөж байна")["topics"]