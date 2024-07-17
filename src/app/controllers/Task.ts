import { Request, Response } from "express";
import pool from "../../config/Database";
import * as queries from "../queries/Task";
import { TaskFormSchema, MarkAsCompleted } from "../../validators/formsSchema";

const getMyTasks = async (req: Request, res: Response) => {
  try {
    const { id, username } = req.params;

    const myTasksQuery = await pool.query(queries.MY_TASKS, [id]);
    const assignedToQuery = await pool.query(queries.ASSIGNED_TO, [username]);

    if (myTasksQuery.rows.length === 0 && assignedToQuery.rows.length === 0) {
      return res.json([]);
    }

    const myTasks = myTasksQuery.rows;
    const assignedTo = assignedToQuery.rows;

    const tasks = [...myTasks, ...assignedTo];

    res.status(200).json({
      success: true,
      tasks: tasks,
    });
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      errorMessage: error.message,
    });
  }
};

const addTask = async (req: Request, res: Response) => {
  try {
    const {
      title,
      user_id,
      assigned_to,
      stage,
      priority_level,
      due_date,
      description,
      assigned_by,
    } = req.body;

    await TaskFormSchema.validate({
      title,
      assigned_to,
      stage,
      priority_level,
      due_date,
      description,
    });

    await pool.query(queries.ADD_TASK, [
      title,
      user_id,
      assigned_to,
      stage,
      priority_level,
      due_date,
      assigned_by,
      description,
    ]);
    res.status(200).json({
      success: true,
      message: "Task added successfully",
    });
  } catch (error: any) {
    console.error("Error adding tasks:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      errorMessage: error.message,
    });
  }
};

const markAsCompleted = async (req: Request, res: Response) => {
  try {
    const { task_id, stage } = req.body;
    await MarkAsCompleted.validate({ stage, task_id });
    await pool.query(queries.MARK_AS_COMPLETED, [stage, task_id]);
    res.status(200).json({
      success: true,
      message: "Task marked as completed successfully",
    });
  } catch (error: any) {
    console.error("Error marking task as completed:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      errorMessage: error.message,
    });
  }
};

const deleteTask = async (req: Request, res: Response) => {
  try {
    const { task_id } = req.params;
    console.log("task_id: ", task_id);

    await pool.query(queries.DELETE_TASK, [task_id]);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error: any) {
    console.error("Error marking task as completed:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      errorMessage: error.message,
    });
  }
};

const editTask = async (req: Request, res: Response) => {
  try {
    const {
      title,
      assigned_to,
      stage,
      priority_level,
      due_date,
      description,
      task_id,
    } = req.body;

    console.log(
      title,
      assigned_to,
      stage,
      priority_level,
      due_date,
      description,
      task_id
    );
    await TaskFormSchema.validate({
      title,
      assigned_to,
      stage,
      priority_level,
      due_date,
      description,
    });

    await pool.query(queries.EDIT_TASK, [
      title,
      assigned_to,
      stage,
      priority_level,
      due_date,
      description,
      task_id,
    ]);

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
    });
  } catch (error: any) {
    console.error("Error marking task as completed:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      errorMessage: error.message,
    });
  }
};

export { getMyTasks, addTask, markAsCompleted, deleteTask, editTask };
