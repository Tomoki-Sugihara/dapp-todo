import { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { useAuth } from 'src/hooks/useAuth'
import { useWeb3 } from 'src/hooks/useWeb3'
import { loadingState } from 'src/state/config'

export type Res = [string, string, string, boolean]
export interface Task {
  id: string
  address: string
  content: string
  isCompleted: boolean
}

export const useTasks = () => {
  const { contract, address } = useWeb3()
  const [isLoading, setLoading] = useRecoilState(loadingState)
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [myTasks, setMyTasks] = useState<Task[]>([])

  const fetchTasks = useCallback(async () => {
    if (!contract) return
    const taskIds: string[] = await contract?.methods.getTaskIds().call()
    const newTasks = await Promise.all(
      taskIds
        .filter((e) => e !== '0')
        .map(async (taskId) => {
          const res: Res = await contract.methods.getTask(taskId).call()
          const [id, address, content, isCompleted] = res
          return { id, address, content, isCompleted }
        }),
    )
    const newMyTasks = newTasks.filter((task: Task) => task.address === address)

    setTasks(newTasks)
    setMyTasks(newMyTasks)
  }, [contract, address])

  const writeTask = <T extends (...args: any[]) => Promise<void>>(callback: T) => {
    const func = async (...args: Parameters<T>) => {
      if (!user) return alert('ログインしてください')

      setLoading(true)
      try {
        await callback(...args)

        await fetchTasks()
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    return func
  }

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return {
    tasks,
    myTasks,
    fetchTasks,
    writeTask,
    isLoading,
  }
}
