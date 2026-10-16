from support import build_support, UNCLEAR_MESSAGE, EMOTION_MESSAGES


def fake_result(emotion="fear", clear=True, topics=(), safety=None):
    """A pretend analyze() result, so we can test build_support alone."""
    return {"emotion": {"emotion": emotion, "clear": clear}, "topics": topics, "safety": safety}


def test_clear_emotion_gets_its_message():
    assert build_support(fake_result("fear"))["message"] == EMOTION_MESSAGES["fear"]


def test_unclear_emotion_asks_the_student():
    assert build_support(fake_result(clear=False))["message"] == UNCLEAR_MESSAGE


def test_one_tip_per_topic():
    assert len(build_support(fake_result(topics=["sleep", "academic"]))["tips"]) == 2


def test_safety_guidance():
    assert build_support(fake_result())["safety"] is None
    assert "112" in build_support(fake_result(safety="crisis"))["safety"]["text"]
    assert "112" in build_support(fake_result(safety="urgent_body"))["safety"]["text"]


def test_every_emotion_has_a_message():
    for emotion in ["anger", "disgust", "fear", "joy", "neutral", "sadness", "surprise"]:
        assert emotion in EMOTION_MESSAGES