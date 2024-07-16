import { Request, Response } from "express";
import pool from "../../config/Database";
import * as queries from "../queries/Task";

const getMyTasks = async (req: Request, res: Response) => {
    const { id, username } = req.params;

    const tasks = await pool.query(queries.MY_TASKS, [id, username]
    );
}

export { getMyTasks }