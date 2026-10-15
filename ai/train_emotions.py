import csv
from sentence_transformers import SentenceTransformer
from sklearn.linear_model import LogisticRegression

def load(path):
    texts = []
    labels = []

    for row in csv.DictReader(open(path, encoding="utf-8")):
        texts.append(row["text"])
        labels.append(row["label"])
    return texts, labels

#1.load data
train_texts, train_labels = load("ai/data/emotions_train.csv")
dev_texts, dev_labels = load("ai/data/emotions_dev.csv")
print("Train:", len(train_texts), "comments. Dev:", len(dev_texts), "comments.")

#2. turn all comments into numbers
encoder = SentenceTransformer("sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
print("Turning comments into numbers...")
train_number = encoder.encode(train_texts, show_progress_bar=True)
dev_numbers = encoder.encode(dev_texts, show_progress_bar=True)

#3. classifier learns numbers mean
print("Trainig...")
model = LogisticRegression(max_iter=1000, class_weight="balanced")
model.fit(train_number, train_labels)

#4. how many dev comments does it get?
predictions = model.predict(dev_numbers)
correct = 0
for i in range(len(dev_labels)):
    if predictions[i] == dev_labels[i]:
        correct = correct + 1
    print("Dev accuracy:", round(correct / len(dev_labels), 2))


#5. own sample
for sentence in ["I'm so worried about my exam tomorrow", "Ma nagyon szomorú vagyok", "Би их баяртай байна"]:
    print(sentence, "->", model.predict(encoder.encode([sentence]))[0])