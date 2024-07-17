const MY_TASKS = "SELECT * FROM tasks WHERE user_id = $1 ";
const ASSIGNED_TO = "SELECT * FROM tasks WHERE assigned_to = $1";
const ADD_TASK =
  "INSERT INTO tasks(title, user_id, assigned_to, stage, priority_level, due_date, assigned_by, description) VALUES($1, $2, $3, $4, $5, $6, $7, $8)";
const MARK_AS_COMPLETED = "UPDATE tasks SET stage = $1 WHERE task_id = $2";
const DELETE_TASK = "DELETE FROM tasks WHERE task_id = $1";
const EDIT_TASK =
  "UPDATE tasks SET title = $1, assigned_to = $2, stage = $3, priority_level = $4, due_date = $5, description = $6 WHERE task_id = $7";

export {
  MY_TASKS,
  ASSIGNED_TO,
  ADD_TASK,
  MARK_AS_COMPLETED,
  DELETE_TASK,
  EDIT_TASK,
};
