from safety import check_safety


def test_crisis_in_three_languages():
    assert check_safety("Sometimes I want to die") == "crisis"
    assert check_safety("Öngyilkos gondolataim vannak") == "crisis"
    assert check_safety("Амиа хорломоор санагдаж байна") == "crisis"


def test_urgent_body_symptoms():
    assert check_safety("I have chest pain and I'm scared") == "urgent_body"
    assert check_safety("Nem kapok levegőt") == "urgent_body"
    assert check_safety("Цээж өвдөөд байна") == "urgent_body"


def test_capital_letters_and_curly_apostrophes():
    assert check_safety("I WANT TO DIE") == "crisis"
    assert check_safety("I can’t breathe") == "urgent_body"


def test_normal_sentences_are_safe():
    assert check_safety("I failed my exam") is None
    assert check_safety("I'm so tired today") is None
    assert check_safety("Hiányzik a családom") is None
