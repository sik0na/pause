import joblib 
from sentence_transformers import SentenceTransformer

encoder = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2", device="cpu")
model = joblib.load("ai/emotion_model.joblib")
THRESHOLD = 0.5

def predict_emotion(text):
    numbers = encoder.encode([text])
    chances = model.predict_proba(numbers)[0]

    results = []
    for i in range(len(model.classes_)):
        results.append((str(model.classes_[i]), round(float(chances[i]), 2)))

    results.sort(key = lambda pair: pair[1], reverse=True)
    return results

def analyze_emotion(text):
    results = predict_emotion(text)
    top_name, top_chance = results[0]

    return {
        "emotion": top_name,
        "confidence": top_chance,
        "clear": top_chance >= THRESHOLD, 
        "top3": results[:3],
    }
if __name__ == "__main__":
    for sentence in ["I'm so worried about my exam tomorrow",
                     "Ma nagyon szomorú vagyok",
                     "ok",
                     "I don't know, today was weird"]:
        print(sentence)
        print("   top 3:", predict_emotion(sentence)[:3])
        print("  ", analyze_emotion(sentence))

