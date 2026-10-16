import joblib
from emotion import encoder, analyze_emotion
from safety import check_safety
from support import build_support

topic_model = joblib.load("ai/topic_model.joblib")
TOPIC_THRESHOLD = 0.3


def clean_text(text):
    words = []
    for word in text.split():
        if not word.startswith("http"):
            words.append(word)
    clean = " ".join(words)
    return clean[:1000]

def find_topics(text):
    chances = topic_model.predict_proba(encoder.encode([text]))[0]
    topics = []

    for i in range(len(topic_model.classes_)):
        name = str(topic_model.classes_[i])
        if name != "other" and chances[i] >= TOPIC_THRESHOLD:
            topics.append(name)
    return topics

def analyze(text):
    text = clean_text(text)
    if text == "":
        return {"error": "Please write a few words."}

    result =  {
        "text": text,
        "safety": check_safety(text),        # "crisis", "urgent_body" or None
        "emotion": analyze_emotion(text),    # emotion, confidence, clear, top3
        "topics": find_topics(text),         # ["sleep", "academic"]
    }
    result["support"] = build_support(result)
    return result

if __name__ == "__main__":
    for sentence in ["I can't sleep because of my exam tomorrow",
                     "Hiányzik a családom és egyedül vagyok",
                     "Миний толгой өвдөж байна",
                     "I want to die",
                     "   "]:
        print(repr(sentence))
        print("  ", analyze(sentence))