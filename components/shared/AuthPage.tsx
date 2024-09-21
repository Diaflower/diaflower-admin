import React from 'react';
import { SignIn, SignUp } from "@clerk/nextjs";

const AuthPage = ({ type }:{type:string}) => {
  const isSignIn = type === 'sign-in';

  return (
    <div className="flex items-center justify-center my-16">
        <div>
        {isSignIn ? (
            <SignIn/>
          ) : (
            <SignUp/>
          )}
        </div>
    </div>
  );
};

export default AuthPage;