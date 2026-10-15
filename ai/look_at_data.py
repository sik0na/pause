file = open("ai/data/goemotions/emotions.txt")

names = file.read().split()

print(names)
print("Number of emotions:", len(names))

comments = open("ai/data/goemotions/train.tsv").readlines()
print("Number of comments:", len(comments))


for line in comments[:5]:
    parts = line.split("\t")
    text = parts[0]
    number = parts[1]
    print(text, "->", number)

for line in comments[:5]:
    parts = line.split("\t")
    text = parts[0]
    numbers = parts[1].split(",")
    for n in numbers:
        print(text, "->", names[int(n)])
count = {}

for line in comments:
    parts = line.split("\t")
    numbers = parts[1].split(",")
    for n in numbers:
        name = names[int(n)]
        if name in count:
            count[name] = count[name] + 1
        else:
            count[name] = 1
for name in names:
    print(name, count[name])