import { useReducer, createContext } from 'react'

import CommandBuilder from './command-builder/CommandBuilder'
import Cache from './cache/Cache'
import cacheReducer, { INITIAL_CACHE } from './reducers/cacheReducer'
import commandReducer, { INITIAL_COMMAND } from './reducers/commandReducer'
import sendCommand from './api/sendCommand'

export const CommandContext = createContext({})

const RedisClone = () => {
  const [cache, dispatchCache] = useReducer(cacheReducer, INITIAL_CACHE)
  const [command, dispatchCommand] = useReducer(commandReducer, INITIAL_COMMAND)

  const onChangeCommand = (updates) => dispatchCommand({ ...command, ...updates })

  const onRunCommand = async () => {
    try {
      await sendCommand(command)
      dispatchCache(command)
      dispatchCommand(INITIAL_COMMAND)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <CommandContext.Provider value={command}>
        <CommandBuilder onChangeCommand={onChangeCommand} onRunCommand={onRunCommand} />
      </CommandContext.Provider>

      <Cache cache={cache} onNewCommand={(command, props) => dispatchCommand({ type: command, ...props })} />
    </>
  )
}

export default RedisClone