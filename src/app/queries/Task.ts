const MY_TASKS = "SELECT * FROM tasks WHERE user_id = $1 OR assigned_to = $1";


export { MY_TASKS }