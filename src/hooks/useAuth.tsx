import * as React from 'react'
import cookie from 'js-cookie'
import fetch from 'isomorphic-unfetch'
import debug from 'debug'

const d = debug('useAuth')
const err = d.extend('error')

export const ErrorCodes = {
  Unauthorized: 401,
  NotActivated: 424,
  NotFound: 404,
  BadRequest: 400,
  EmailAlreadyInUse: 409,
  AlreadyActivated: 416,
  InternalError: 500,
  InvalidToken: 403,
}

export class AuthError extends Error {
  protected _code: number
  protected _message: string

  public get code {
    return this._code
  }

  public get message {
    return this._message
  }

  constructor(code: number, message: string) {
    super(message)
    this._message = message
    this._code = code
  }
}

export interface AuthUser {
  _id: string
  name: string
  email: string
  password: string
}

export interface AuthProps {
  user?: AuthUser
  loading: boolean
  token?: string

  createUserWithEmailAndPassword(
    email: string,
    password: string,
    name: string,
    avatarUrl?: string
  ): Promise<any>

  signInWithEmailAndPassword(
    email: string,
    password: string,
    staySignedIn?: boolean
  ): Promise<any>

  requestPasswordReset(email: string): Promise<any>

  resetPassword(resetToken: string, password: string): Promise<any>

  activate(code: string): Promise<any>

  resendActivationLink(email: string): Promise<any>

  logout(): Promise<any>
}

const throwAddProviderError = () => {
  throw new Error('Please wrap the DOM tree with the AuthContextProvider')
}

const AuthContext = React.createContext<AuthProps>({
  loading: false,
  createUserWithEmailAndPassword: throwAddProviderError,
  signInWithEmailAndPassword: throwAddProviderError,
  requestPasswordReset: throwAddProviderError,
  resetPassword: throwAddProviderError,
  activate: throwAddProviderError,
  resendActivationLink: throwAddProviderError,
  logout: throwAddProviderError,
})

export const useAuth = (): AuthProps => React.useContext<AuthProps>(AuthContext)

const getUserByToken = (token: string): Promise<AuthUser> =>
  fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/profile`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((result) => {
      if (result.ok) {
        return result.json()
      }
      throw new AuthError(result.status, result.statusText)
    })
    .then((json) => json as AuthUser)

export const AuthContextConsumer = AuthContext.Consumer

export const AuthContextProvider = (props: {
  children: React.ReactNode
  authUrl: string
}): JSX.Element => {
  const {children, authUrl} = props

  const [token, setToken] = React.useState<string>()
  const [user, setUser] = React.useState<AuthUser>()
  const [loading, setLoading] = React.useState<boolean>(true)

  const createUserWithEmailAndPassword = React.useCallback(
    (email: string, password: string, name: string, avatarUrl?: string): Promise<void> =>
      // setLoading(true);
      fetch(`${authUrl}/signup`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          name,
          avatarUrl: avatarUrl || '',
        }),
      }).then((res) => {
        if (!res.ok) {
          throw new AuthError(res.status, res.statusText)
        }
        return undefined
      }),
    [authUrl]
  )

  const signInWithEmailAndPassword = React.useCallback(
    (email: string, password: string, staySignedIn?: boolean) => {
      setLoading(true)
      return fetch(`${authUrl}/login`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then((res) => {
          if (res.ok) return res.json()
          throw new AuthError(res.status, res.statusText)
        })
        .then(async (resToken) => {
          const resUser = await getUserByToken(resToken)
          setUser(resUser)
          setToken(resToken)
          cookie.set('token', resToken, {expires: staySignedIn ? 7 : 1})
          return undefined
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [authUrl]
  )

  const requestPasswordReset = React.useCallback(
    (email: string) =>
      fetch(`${authUrl}/forgot`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          email,
        }),
      })
        .then((res) => {
          if (!res.ok) throw new AuthError(res.status, res.statusText)
          return undefined
        }),
    [authUrl]
  )

  const resetPassword = React.useCallback(
    (resetToken: string, password: string) =>
      fetch(`${authUrl}/reset`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          token: resetToken,
          password,
        }),
      }).then((res) => {
        if (!res.ok) {
          throw new AuthError(res.status, res.statusText)
        }
        return undefined
      }),
    [authUrl]
  )

  const activate = React.useCallback(
    (code: string): Promise<void> =>
      fetch(`${authUrl}/activate`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          code,
        }),
      }).then((res) => {
        if (!res.ok) throw new AuthError(res.status, res.statusText)
        return undefined
      }),
    [authUrl]
  )

  const resendActivationLink = React.useCallback(
    (email: string): Promise<void> =>
      fetch(`${authUrl}/reactivate`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          email,
        }),
      }).then((res) => {
        if (!res.ok) throw new AuthError(res.status, res.statusText)
        return undefined
      }),
    [authUrl]
  )

  const logout = React.useCallback(() => {
    setLoading(true)
    return fetch(`${authUrl}/logout`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      method: 'POST',
    })
      .then((res) => {
        if (res.ok) {
          cookie.remove('token')
          setToken(undefined)
          setUser(undefined)
          return undefined
        }
        throw new AuthError(res.status, res.statusText)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [authUrl, token])

  React.useEffect(() => {
    // First get cookie
    const resToken = cookie.get('token')
    if (resToken) {
      // Try to use the token to login
      getUserByToken(resToken)
        .then((resUser) => {
          setUser(resUser)
          setToken(resToken)
          return undefined
        })
        .finally(() => {
          setLoading(false)
        })
        .catch((resError) => {
          err(resError)
          setUser(undefined)
          setToken(undefined)
          cookie.remove('token')
        })
    } else {
      setUser(undefined)
      setLoading(false)
    }
    return () => {
      setToken(undefined)
      setUser(undefined)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        requestPasswordReset,
        resetPassword,
        logout,
        user,
        loading,
        token,
        activate,
        resendActivationLink,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const withAuth = (ComposedComponent: any) => {
  const DecoratedComponent = () => (
    <AuthContext.Consumer>
      {(auth: AuthProps) => (
        <ComposedComponent user={auth.user} loading={auth.loading} token={auth.token}/>
      )}
    </AuthContext.Consumer>
  )
  return DecoratedComponent
}
