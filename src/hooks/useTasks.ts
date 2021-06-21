import { useCallback, useEffect, useState } from 'react'

import { useWeb3 } from './useWeb3'

export type Res = [string, string, string, boolean]
export interface Task {
  id: string
  address: string
  content: string
  isCompleted: boolean
}

export const useTasks = () => {
  const { contract, account } = useWeb3()
  const [tasks, setTasks] = useState<Task[]>([])
  const [myTasks, setMyTasks] = useState<Task[]>([])

  const fetchTasks = useCallback(async () => {
    if (!contract) return

    const taskIds: string[] = await contract.methods.getTaskIds().call()

    const newTasks = await Promise.all(
      taskIds
        .filter((e) => e !== '0')
        .map(async (taskId) => {
          const res: Res = await contract.methods.getTask(taskId).call()
          const [id, address, content, isCompleted] = res
          return { id, address, content, isCompleted }
        }),
    )
    const newMyTasks = newTasks.filter((task: Task) => task.address === account)

    setTasks(newTasks)
    setMyTasks(newMyTasks)
  }, [contract, account])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return {
    tasks,
    myTasks,
    fetchTasks,
  }
}
