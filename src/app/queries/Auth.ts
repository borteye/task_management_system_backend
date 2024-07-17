const USER_SIGN_IN = "SELECT * FROM users WHERE email = $1 ";
const USER_SIGN_UP =
  "INSERT INTO users(username, email, password) VALUES($1, $2, $3)";
const CHECK_USERNAME_EXISTENCE = "SELECT * FROM users WHERE username = $1";
const CHECK_EMAIL_EXISTENCE = "SELECT * FROM users WHERE email = $1";
const CHECK_RESET_EMAIL_EXISTENCE =
  "SELECT * FROM verification_code WHERE user_email = $1";
const UPDATE_VERIFICATION_CODE =
  "UPDATE verification_code SET code = $1 WHERE user_email = $2";
const ADD_VERIFICATION_CODE =
  "INSERT INTO verification_code(code, user_email) VALUES($1, $2)";
const UPDATE_PASSWORD = "UPDATE users SET password = $1 WHERE email = $2";
const DELETE_VERIFICATION_CODE =
  "DELETE FROM verification_code WHERE user_email = $1";

const GET_USERS = "SELECT  username FROM users WHERE userid <> $1";

export {
  ADD_VERIFICATION_CODE,
  CHECK_EMAIL_EXISTENCE,
  CHECK_RESET_EMAIL_EXISTENCE,
  CHECK_USERNAME_EXISTENCE,
  DELETE_VERIFICATION_CODE,
  GET_USERS,
  UPDATE_PASSWORD,
  UPDATE_VERIFICATION_CODE,
  USER_SIGN_IN,
  USER_SIGN_UP,
};
