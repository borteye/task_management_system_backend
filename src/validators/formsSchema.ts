import * as yup from "yup";

export const TaskFormSchema = yup.object().shape({
  title: yup.string().max(40).required("Task title is required"),
  description: yup.string().max(200).required("Description To is required"),
  assigned_to: yup.string().required("Assigned To is required"),
  stage: yup.string().required("Task Stage is required"),
  priority_level: yup.string().required("Priority Level is required"),
  due_date: yup.string().required("Due Date is required"),
});

export const MarkAsCompleted = yup.object().shape({
  stage: yup.string().required("Task Stage is required"),
  task_id: yup.number().required("Task Id is required"),
});
