import csv
from emotion import encoder, model

texts = []
labels = []
for row in csv.DictReader(open("ai/data/emotions_dev.csv", encoding="utf-8")):
    texts.append(row["text"])
    labels.append(row["label"])

numbers = encoder.encode(texts, show_progress_bar=True)
all_chances = model.predict_proba(numbers)

for threshold in [0.3, 0.4, 0.5, 0.6, 0.7]:
    clear = 0
    clear_correct = 0

    for i in range(len(texts)):
        chances = all_chances[i]
        top_chances = chances.max()
        guess = model.classes_[chances.argmax()]

        if top_chances >= threshold:
            clear = clear + 1
            if guess == labels[i]:
                clear_correct = clear_correct + 1

    print("threshold", threshold,
        "| clear:", round(clear / len(texts) * 100), "%",
        "| accuracy when clear:", round(clear_correct / clear, 2))