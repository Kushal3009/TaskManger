import React, { useState, useEffect } from "react";
import "./task.css"; // Make sure to import your CSS file

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editTask, setEditTask] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true); // Set loading to true when fetching tasks
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      handleError("Missing authentication token");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/task/getTask", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authToken,
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Unauthorized access. Please check your authentication token."
          );
        }
        throw new Error("Failed to fetch tasks");
      }
      const result = await response.json();
      setTasks(result);
      setError(null); // Clear any previous error
    } catch (error) {
      handleError(error.message);
    } finally {
      setLoading(false); // Set loading to false when tasks are fetched
    }
  };

  const handleError = (message) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 1500);
  };

  const handleAddTask = async () => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetch("http://localhost:3000/api/task/addTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authToken: authToken,
        },
        body: JSON.stringify({ task: newTask }),
      });
      if (!response.ok) {
        throw new Error("Failed to add task");
      }
      const result = await response.json();
      setTasks([...tasks, result]);
      setNewTask("");
      setError(null); // Clear any previous error
    } catch (error) {
      handleError(error.message);
    }
  };

  const handleDeleteTask = async (id) => {
    const authToken = localStorage.getItem("authToken");
    try {
      await fetch(`http://localhost:3000/api/task/deleteTask/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authToken: authToken,
        },
      });
      setTasks(tasks.filter((task) => task._id !== id));
      setError(null); // Clear any previous error
    } catch (error) {
      handleError(error.message);
    }
  };

  const handleSaveEditTask = async (id) => {
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        `http://localhost:3000/api/task/updateTask/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authToken: authToken,
          },
          body: JSON.stringify({ task: editTaskText }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      const result = await response.json();
      setTasks(tasks.map((task) => (task._id === id ? result : task)));
      setEditTask(null);
      setEditTaskText("");
      setError(null); // Clear any previous error
    } catch (error) {
      handleError(error.message);
    }
  };

  if (loading) {
    return <div className="text-center text-lg">Loading tasks...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Task Manager</h1>
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New Task"
          className="border p-2 mr-2 rounded w-full max-w-xs"
        />
        <button
          onClick={handleAddTask}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        >
          Add Task
        </button>
      </div>
      {error && <div className="text-center text-red-500">{error}</div>}
      {tasks.length === 0 ? (
        <div className="text-center text-gray-500">No Task Right Now</div>
      ) : (
        <div className="flex justify-center items-center container max-h-[70vh] overflow-scroll hide-scrollbar">
          <ul className="list-disc list-inside space-y-4 w-1/4">
            {tasks.map((task) => (
              <li
                key={task._id}
                className="p-4 bg-white shadow rounded flex justify-between items-center"
              >
                {editTask === task._id ? (
                  <div className="flex-grow flex items-center">
                    <input
                      type="text"
                      value={editTaskText}
                      onChange={(e) => setEditTaskText(e.target.value)}
                      className="border p-2 rounded flex-grow"
                    />
                    <button
                      onClick={() => handleSaveEditTask(task._id)}
                      className="bg-green-500 text-white p-2 rounded hover:bg-green-700 ml-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditTask(null);
                        setEditTaskText("");
                      }}
                      className="bg-gray-500 text-white p-2 rounded hover:bg-gray-700 ml-2"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="flex-grow">{task.task}</span>
                    <div className="space-x-2">
                      <button
                        onClick={() => {
                          setEditTask(task._id);
                          setEditTaskText(task.task);
                        }}
                        className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
