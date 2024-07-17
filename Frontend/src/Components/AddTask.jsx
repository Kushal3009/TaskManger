import React, { useState } from 'react'

const AddTask = () => {
    const [task,setTask] = useState()
    const [tasks,setTasks] = useState()
    const handleSubmit = () => {
        
    }
  return (
    <div>
        <form onSubmit={handleSubmit}>
            <label htmlFor="task">Task</label>
            <input type="text" name="task" id="task" />
            <button type="submit">Add Task</button>
        </form>
    </div>
  )
}

export default AddTask
