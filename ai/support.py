# One message for each emotion (Model A)
EMOTION_MESSAGES = {
    "joy": "That's great to hear! Take a moment to notice what made today good.",
    "sadness": "I'm sorry you're feeling down. It's okay to feel sad. Be gentle with yourself today.",
    "anger": "It sounds like something really bothered you. Anger is a normal reaction. A short walk or a few slow breaths can help it settle.",
    "fear": "It sounds like you're worried. That makes sense when something matters to you. Try to focus on one small thing you can do today.",
    "surprise": "It sounds like something unexpected happened. Give yourself a moment to take it in.",
    "disgust": "It sounds like something really didn't feel right to you. It's okay to step away from it for a while.",
    "neutral": "Thanks for checking in. Noticing how you feel, even on ordinary days, is a good habit.",
}

UNCLEAR_MESSAGE = "Thanks for sharing. I'm not completely sure how you feel. Which of these fits best?"

TOPIC_TIPS = {
    "academic": "Break your work into small steps and start with the easiest one. Your university's study support can help you plan.",
    "sleep": "Try to go to bed at the same time every night, and put your phone away 30 minutes before sleeping.",
    "social": "Start small: send a message to one person today, or try one club or student event this week.",
    "physical": "Your body may be feeling the stress too. Drink water, eat something and rest. If it doesn't get better, please see a doctor.",
    "home": "Missing home is very common for international students. A call with your family or cooking a familiar meal can help.",
}

SAFETY = {
    "crisis": {
        "title": "You don't have to go through this alone",
        "text": "If you are thinking about hurting yourself, please reach out now. In an emergency, call 112. "
                "You can talk to someone at any time at the emotional support line 116 123, "
                "or contact your university's counselling service.",
    },
    "urgent_body": {
        "title": "Please get medical help",
        "text": "These symptoms can be serious. If they are strong or sudden, call 112 now. "
                "Otherwise, please see a doctor as soon as possible.",
    },
}

# ----- Hungarian -----
HU = {
    "emotions": {
        "joy": "Ezt jó hallani! Szánj egy percet arra, hogy észrevedd, mitől volt jó a mai nap.",
        "sadness": "Sajnálom, hogy rosszul érzed magad. Rendben van, ha szomorú vagy. Légy ma kedves magadhoz.",
        "anger": "Úgy tűnik, valami nagyon zavart. A düh természetes reakció. Egy rövid séta vagy néhány lassú lélegzet segíthet lecsillapodni.",
        "fear": "Úgy tűnik, aggódsz. Ez érthető, ha valami fontos neked. Próbálj egy apró dologra koncentrálni, amit ma megtehetsz.",
        "surprise": "Úgy tűnik, valami váratlan történt. Adj magadnak egy kis időt, hogy feldolgozd.",
        "disgust": "Úgy tűnik, valami nagyon nem tűnt helyesnek. Rendben van, ha egy időre eltávolodsz tőle.",
        "neutral": "Köszönöm, hogy megosztottad. Jó szokás figyelni az érzéseidre, még a hétköznapi napokon is.",
    },
    "unclear": "Köszönöm, hogy megosztottad. Nem vagyok egészen biztos benne, hogyan érzel. Melyik illik rád leginkább?",
    "tips": {
        "academic": "Bontsd kis lépésekre a feladatot, és a legkönnyebbel kezdd. Az egyetemed tanulástámogató szolgálata segíthet a tervezésben.",
        "sleep": "Próbálj minden este ugyanabban az időben lefeküdni, és lefekvés előtt 30 perccel tedd el a telefonodat.",
        "social": "Kezdd kicsiben: írj ma egy üzenetet valakinek, vagy próbálj ki egy klubot vagy diákprogramot ezen a héten.",
        "physical": "Lehet, hogy a tested is érzi a stresszt. Igyál vizet, egyél valamit és pihenj. Ha nem javul, kérlek, fordulj orvoshoz.",
        "home": "A honvágy nagyon gyakori a nemzetközi hallgatók körében. Egy hívás a családoddal vagy egy ismerős étel elkészítése segíthet.",
    },
    "safety": {
        "crisis": {
            "title": "Nem kell egyedül végigcsinálnod",
            "text": "Ha arra gondolsz, hogy bántanád magad, kérlek, kérj segítséget most. Vészhelyzetben hívd a 112-t. "
                    "Bármikor beszélhetsz valakivel a 116 123-as lelki elsősegély-vonalon, "
                    "vagy fordulj az egyetemed pszichológiai tanácsadásához.",
        },
        "urgent_body": {
            "title": "Kérlek, kérj orvosi segítséget",
            "text": "Ezek a tünetek komolyak lehetnek. Ha erősek vagy hirtelen jelentkeztek, hívd most a 112-t. "
                    "Egyébként kérlek, minél hamarabb fordulj orvoshoz.",
        },
    },
}

# ----- Mongolian -----
MN = {
    "emotions": {
        "joy": "Сонсоход их сайхан байна! Өнөөдрийг юу сайхан болгосныг анзаарч үзээрэй.",
        "sadness": "Таны сэтгэл гутарсанд харамсаж байна. Гунигтай байх нь зүгээр. Өнөөдөр өөртөө зөөлөн хандаарай.",
        "anger": "Ямар нэг зүйл таныг их бухимдуулсан бололтой. Уурлах нь хэвийн. Богино алхалт эсвэл хэдэн удаа аажуухан амьсгалах нь тайвшрахад тусална.",
        "fear": "Та санаа зовж байгаа бололтой. Танд чухал зүйл байхад ингэх нь ойлгомжтой. Өнөөдөр хийж чадах нэг жижиг зүйлдээ анхаараарай.",
        "surprise": "Гэнэтийн зүйл тохиолдсон бололтой. Үүнийг хүлээж авахад өөртөө хугацаа өгөөрэй.",
        "disgust": "Ямар нэг зүйл танд огт таалагдаагүй бололтой. Түүнээс хэсэг хугацаанд холдох нь зүгээр.",
        "neutral": "Хуваалцсанд баярлалаа. Энгийн өдрүүдэд ч мэдрэмжээ анзаарах нь сайн дадал юм.",
    },
    "unclear": "Хуваалцсанд баярлалаа. Таны мэдрэмжийг сайн ойлгож чадсангүй. Аль нь хамгийн тохирох вэ?",
    "tips": {
        "academic": "Ажлаа жижиг алхмуудад хувааж, хамгийн хялбараас нь эхлээрэй. Их сургуулийн тань суралцахуйн дэмжлэгийн алба төлөвлөхөд тусалж чадна.",
        "sleep": "Орой бүр нэг цагт унтаж, унтахаасаа 30 минутын өмнө утсаа холдуулж үзээрэй.",
        "social": "Жижиг зүйлээс эхлээрэй: өнөөдөр нэг хүнд мессеж бичих, эсвэл энэ долоо хоногт нэг клуб, оюутны арга хэмжээнд оролцож үзээрэй.",
        "physical": "Таны бие ч гэсэн стрессийг мэдэрч байж магадгүй. Ус ууж, хооллож, амраарай. Хэрэв сайжрахгүй бол эмчид хандана уу.",
        "home": "Гэрээ санах нь гадаад оюутнуудад маш түгээмэл. Гэр бүлтэйгээ ярих эсвэл танил хоол хийх нь тусалж магадгүй.",
    },
    "safety": {
        "crisis": {
            "title": "Та үүнийг ганцаараа даван туулах шаардлагагүй",
            "text": "Хэрэв та өөрийгөө гэмтээх тухай бодож байвал яг одоо тусламж хүсээрэй. Яаралтай үед 112 руу залгаарай. "
                    "116 123 сэтгэл зүйн тусламжийн утсаар хэзээ ч ярилцах боломжтой, "
                    "эсвэл их сургуулийнхаа сэтгэл зүйн зөвлөгөөний албанд хандаарай.",
        },
        "urgent_body": {
            "title": "Эмнэлгийн тусламж аваарай",
            "text": "Эдгээр шинж тэмдэг ноцтой байж болзошгүй. Хэрэв хүчтэй эсвэл гэнэт илэрсэн бол яг одоо 112 руу залгаарай. "
                    "Үгүй бол аль болох хурдан эмчид хандаарай.",
        },
    },
}

# All languages together. English uses the dictionaries above.
SUPPORT_TEXTS = {
    "en": {"emotions": EMOTION_MESSAGES, "unclear": UNCLEAR_MESSAGE, "tips": TOPIC_TIPS, "safety": SAFETY},
    "hu": HU,
    "mn": MN,
}

def build_support(result, lang="en"):
    texts = SUPPORT_TEXTS.get(lang, SUPPORT_TEXTS["en"])

    emotion = result["emotion"]
    if emotion["clear"]:
        message = texts["emotions"][emotion["emotion"]]
    else:
        message = texts["unclear"]

    tips = []
    for topic in result["topics"]:
        tips.append(texts["tips"][topic])

    safety = None
    if result["safety"] is not None:
        safety = texts["safety"][result["safety"]]
    
    choices = {}
    for name, chance in emotion.get("top3", []):
        choices[name] = texts["emotions"][name]

    return {"safety": safety, "message": message, "tips": tips, "choices": choices}