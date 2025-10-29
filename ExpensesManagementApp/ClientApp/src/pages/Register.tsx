import {useState} from "react";
import * as React from "react";

export function Register(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)


    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try{

            const response = await fetch('/api/Auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ email, password})
            })

            if(response.ok){
                alert('Registration succeeded')

                setEmail('')
                setPassword('')
            }else{
                alert('Registration failed')
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

            <h1>Registration</h1>

            <form onSubmit={handleRegister}>

                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
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
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </div>
            </form>
        </div>
    )
}