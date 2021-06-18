import React, { createContext, useCallback, useContext, useState } from 'react'

interface IContext {
    levels: {
        [uuid: string]: ArrayBuffer
    }
    registerLevel: (uuid: string, buffer: ArrayBuffer) => void
}

const Context = createContext<IContext>({
    levels: {},
    registerLevel: () => {
        throw new Error('Please wrap your DOM tree with the LevelProvider')
    },
})

const LevelProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const [levels, setLevels] = useState<{
        [uuid: string]: ArrayBuffer
    }>({})
    const registerLevel = useCallback((uuid: string, buffer: ArrayBuffer) => {
        setLevels((prev) => ({
            ...prev,
            [uuid]: buffer,
        }))
    }, [])
    return (
        <Context.Provider
            value={{
                levels,
                registerLevel,
            }}
        >
            {children}
        </Context.Provider>
    )
}

const useLevel = (): IContext => useContext(Context)

export { LevelProvider }
export default useLevel
