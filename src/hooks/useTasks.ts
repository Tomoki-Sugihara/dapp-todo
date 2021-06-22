import { useCallback, useEffect, useState } from 'react'

import { useWeb3 } from './useWeb3'

export interface Task {
  0: string
  1: string
  2: boolean
}
// export interface Task {
//   id: string
//   content: string
//   completed: boolean
// }

export const useTasks = () => {
  const { contract } = useWeb3()
  const [tasks, setTasks] = useState<Task[]>([])

  const fetchTasks = useCallback(async () => {
    if (!contract) return
    const taskIds: string[] = await contract?.methods.getTaskIds().call()
    // console.log('taskIds', taskIds)
    const newTasks = await Promise.all(
      taskIds
        .filter((e) => e !== '0')
        .map((id) => {
          const task: Promise<Task> = contract?.methods.getTask(id).call()
          return task
        }),
    )
    // console.log('tasks', newTasks)
    setTasks(newTasks)
  }, [contract])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return {
    tasks,
    fetchTasks,
  }
}
