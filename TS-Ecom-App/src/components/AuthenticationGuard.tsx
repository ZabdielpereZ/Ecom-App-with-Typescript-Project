import { withAuthenticationRequired } from '@auth0/auth0-react'
import React, { ComponentType } from 'react'

interface AuthenticationProps {
    childComponent: ComponentType<object>
}


const AuthenticationGuard = ({childComponent}: AuthenticationProps) => {

    // ProtectedComponent - makes use of withAuthenticationRequired (auth0's route protection)
    // if we are logged in/successfully authenticated then redirect them to the childComponent (first argument we pass in) 
    // if we are not, redirected to the login page 
    // ensures we can only access the page if we are logged in
    const ProtectedComponent = withAuthenticationRequired(childComponent, {onRedirecting: () => <>Loading...</>})

  return (
    <div>
      <ProtectedComponent />
    </div>
  )
}

export default AuthenticationGuard
