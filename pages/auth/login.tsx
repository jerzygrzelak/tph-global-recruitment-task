import { FormEvent, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Card } from 'primereact/card';

export default function LoginPage() {
    const [error, setError] = useState('')
    const router = useRouter()

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
        const email = formData.get('email')
        const password = formData.get('password')

        // Use NextAuth's signIn method
        const result = await signIn('credentials', {
            redirect: false, // Prevent redirect, so we can handle it manually
            email,
            password
        })
        console.log(result)
        if (result?.ok) {
            // Redirect to the home page (or wherever you want after login)
            await router.push('/')
        } else {
            // Handle the error (e.g., invalid credentials)
            setError('Invalid credentials.')
        }
    }

    return (
        <div className="flex justify-content-center align-items-center" style={{height: '100vh'}}>
            <Card title="Welcome back!" subTitle='login: quicktrader@crypto.com, password: 123' style={{width: '350px'}}>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-column gap-4">
                        <div className="flex flex-column gap-2">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" name="email" value="quicktrader@crypto.com" type="email" required className="p-inputtext-sm w-full"/>
                        </div>

                        <div className="flex flex-column gap-2 w-full">
                            <label htmlFor="password">Password</label>
                            <Password id="password" name="password" feedback={false} className="p-inputtext-sm w-full"
                            inputClassName='w-full'/>
                        </div>

                        {error && <p className='m-0 text-red-500'>{error}</p>}

                        <Button type="submit" label="Login" icon="pi pi-sign-in" className="p-button-sm p-mt-2"
                                style={{width: '100px', alignSelf: 'center'}}/>
                    </div>
                </form>
            </Card>
        </div>
    )
}