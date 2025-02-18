import Task from "../models/task.models.js";

// Get user listing of data created by the user with his specified id... (this will display in the profile pages of user)
export const getUserTask = async (req, res, next) => {
    try {
        const myTask = await Task.find({ userRef: req.params.id });

        // Check if no tasks were found
        if (!myTask || myTask.length === 0) {
            const error = new Error("No task found for this user");
            error.status = 404;
            return next(error);
        }

        // If tasks exist, return them in the response
        res.status(200).json({
            success: true,
            message: "User tasks found successfully",
            data: myTask,
        });

    } catch (error) {
        next(error);
    }
};

// Create Sharing model in the database
export const createTaskManager = async (req, res, next) => {
    try {
      const task = await Task.create(req.body);
      res.status(201).json({
        success: true,
        data: task,
        message: "Create Sharing successfully",
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create sharing table",
      });
    }
  };

// Update the task 
export const updateTask = async (req, res, next) => {
    try {
      const taskupdated = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      return res.status(200).json(taskupdated);
    } catch (error) {
      next(error);
    }
  };