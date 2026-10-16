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

def build_support(result):
    emotion = result["emotion"]
    if emotion["clear"]:
        message = EMOTION_MESSAGES[emotion["emotion"]]
    else:
        message = UNCLEAR_MESSAGE

    tips = []
    for topic in result["topics"]:
        tips.append(TOPIC_TIPS[topic])

    safety = None
    if result["safety"] is not None:
        safety = SAFETY[result["safety"]]
    return {"safety": safety, "message": message, "tips": tips}