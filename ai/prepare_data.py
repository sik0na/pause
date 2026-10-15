import csv




GROUPS = {
    "joy":      ["joy", "amusement", "approval", "excitement", "gratitude", "love",
                 "optimism", "relief", "pride", "admiration", "desire", "caring"],
    "sadness":  ["sadness", "disappointment", "embarrassment", "grief", "remorse"],
    "anger":    ["anger", "annoyance", "disapproval"],
    "fear":     ["fear", "nervousness"],
    "surprise": ["surprise", "realization", "confusion", "curiosity"],
    "disgust":  ["disgust"],
    "neutral":  ["neutral"],
}


def main_emotion(small):
    for main in GROUPS:
        if small in GROUPS[main]:
            return main


names = open("ai/data/goemotions/emotions.txt", encoding="utf-8").read().split()

for part in ["train", "dev", "test"]:
    lines = open("ai/data/goemotions/" + part + ".tsv", encoding = "utf-8").readlines()
    kept = []
    skipped = 0

    for line in lines:
        parts = line.split("\t")
        text = parts[0]
        numbers = parts[1].split(",")

        mains = []
        for n in numbers:
            mains.append(main_emotion(names[int(n)]))

        if len(set(mains)) == 1:
            kept.append([text, mains[0]])
        else:
            skipped = skipped + 1

    with open('ai/data/emotions_' + part + ".csv", "w", newline = "", encoding = "utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["text", "label"])
        writer.writerows(kept)
        print(part, "kept:", len(kept), "skipped(mixed):", skipped) 