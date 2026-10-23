import database


def test_create_user_and_log_in():
    assert database.create_user("anna", "sunflower123") is not None
    assert database.check_login("anna", "sunflower123") is not None


def test_wrong_password_or_unknown_user():
    database.create_user("anna", "sunflower123")
    assert database.check_login("anna", "wrong-password") is None
    assert database.check_login("ben", "sunflower123") is None


def test_username_must_be_unique():
    database.create_user("anna", "sunflower123")
    assert database.create_user("anna", "another123") is None


def test_password_is_not_saved_as_plain_text():
    database.create_user("anna", "sunflower123")
    row = database.get_connection().execute("SELECT password_hash FROM users").fetchone()
    assert row["password_hash"] != "sunflower123"