import {useState} from "react";
import * as React from "react";

export function Login(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try{

            const response = await fetch('/api/Auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password})
            })

            if(response.ok){
                alert('Login succeeded')
                
                setEmail('')
                setPassword('')
            }else{
                alert('Login failed')
            }

        }catch (error){
            alert('Error:' + error)
            console.error('Error: ' + error)
        }finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="App">

            <h1>Login</h1>

            <form onSubmit={handleLogin}>

                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email} //very important to clear the field correctly
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="example@gmail.com"
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(p) => setPassword(p.target.value)}
                        required
                        placeholder="Enter your password here"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        id="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            </form>
        </div>
    )
}