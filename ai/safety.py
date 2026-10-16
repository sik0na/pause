CRISIS = [
    # English
    "kill myself", "suicide", "suicidal", "end my life", "want to die",
    "self harm", "self-harm", "hurt myself", "cut myself",
    # Hungarian
    "öngyilkos", "meg akarok halni", "megölöm magam", "bántani akarom magam",
    # Mongolian
    "амиа хорло", "үхмээр", "өөрийгөө алмаар", "өөрийгөө гэмтээ",
]

URGENT_BODY = [
    # English
    "can't breathe", "cannot breathe", "chest pain", "passed out", "fainted",
    # Hungarian
    "nem kapok levegőt", "mellkasi fájdalom", "fáj a mellkasom", "elájultam",
    # Mongolian
    "амьсгалж чадахгүй", "цээж өвд", "ухаан алдсан",
]

def check_safety(text):
    small = text.lower().replace("’", "'")

    for words in CRISIS:
        if words in small:
            return "crisis"

    for words in URGENT_BODY:
        if words in small:
            return "urgent_body"
    return None

if __name__ == "__main__":
    for sentence in ["I want to die", "Nem kapok levegőt", "Амиа хорломоор байна", "I failed my exam"]:
        print(sentence, "->", check_safety(sentence))