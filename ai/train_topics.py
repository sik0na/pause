import csv
import joblib 
from sentence_transformers import SentenceTransformer
from sklearn.linear_model import LogisticRegression

train_texts = []
train_topics = []

#1.load train dataset
for row in csv.DictReader(open("ai/data/topics_train.csv", encoding = "utf-8")):
    train_texts.append(row["text"])
    train_topics.append(row["topic"])
print("Training sentences:", len(train_texts))

#2. same encoder
encoder = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2", device="cpu")
model = LogisticRegression(max_iter = 1000)
model.fit(encoder.encode(train_texts), train_topics)

#3.text
for language in ["en", "hu", "mn"]:
    texts = []
    topics = []
    for row in csv.DictReader(open("ai/data/topics_test.csv", encoding="utf-8")):
        if row["language"] == language:
            texts.append(row["text"])
            topics.append(row["topic"])
    guesses = model.predict(encoder.encode(texts))
    correct = 0
    for i in range(len(texts)):
        if guesses[i] == topics[i]:
            correct = correct + 1
        else:
             print("   wrong:", texts[i], "| right:", topics[i], "| guess:", guesses[i])
    print(language, "accuracy:", round(correct / len(texts), 2))

#4. save
joblib.dump(model, "ai/topic_model.joblib")
print("Saved topic_model...")