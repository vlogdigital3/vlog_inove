"use client"

import * as React from "react"
import { ChevronLeft, Github, Twitter } from "lucide-react"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

const AuthForm: React.FC = () => {
    return (
        <div className="bg-white dark:bg-zinc-950 py-20 text-zinc-800 dark:text-zinc-200 selection:bg-zinc-300 dark:selection:bg-zinc-600">
            <BackButton />
            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.25, ease: "easeInOut" }}
                className="relative z-10 mx-auto w-full max-w-xl p-4"
            >
                <Logo />
                <Header />
                <SocialButtons />
                <Divider />
                <LoginForm />
                <TermsAndConditions />
            </motion.div>
            <BackgroundDecoration />
        </div>
    )
}

const BackButton: React.FC = () => (
    <SocialButton icon={<ChevronLeft size={16} />}>Voltar</SocialButton>
)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => (
    <button
        className={`rounded-md bg-gradient-to-br from-blue-400 to-blue-700 px-4 py-2 text-lg text-zinc-50 
    ring-2 ring-blue-500/50 ring-offset-2 ring-offset-white dark:ring-offset-zinc-950 
    transition-all hover:scale-[1.02] hover:ring-transparent active:scale-[0.98] active:ring-blue-500/70
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${className}`}
        {...props}
    >
        {children}
    </button>
)

const Logo: React.FC = () => (
    <div className="mb-6 flex justify-center items-center">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        </div>
        <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">VLOGO IA INOVE SELECT</span>
    </div>
)

const Header: React.FC = () => (
    <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold">Entre na sua conta</h1>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
            Não tem uma conta?{" "}
            <a href="/register" className="text-blue-600 dark:text-blue-400 hover:underline">
                Criar uma.
            </a>
        </p>
    </div>
)

const SocialButtons: React.FC = () => (
    <div className="mb-6 space-y-3">
        <div className="grid grid-cols-2 gap-3">
            <SocialButton icon={<Twitter size={20} />} />
            <SocialButton icon={<Github size={20} />} />
            <SocialButton fullWidth>Entrar com SSO</SocialButton>
        </div>
    </div>
)

const SocialButton: React.FC<{
    icon?: React.ReactNode
    fullWidth?: boolean
    children?: React.ReactNode
}> = ({ icon, fullWidth, children }) => (
    <button
        className={`relative z-0 flex items-center justify-center gap-2 overflow-hidden rounded-md 
    border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 
    px-4 py-2 font-semibold text-zinc-800 dark:text-zinc-200 transition-all duration-500
    before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5]
    before:rounded-[100%] before:bg-zinc-800 dark:before:bg-zinc-200 before:transition-transform before:duration-1000 before:content-[""]
    hover:scale-105 hover:text-zinc-100 dark:hover:text-zinc-900 hover:before:translate-x-[0%] hover:before:translate-y-[0%] active:scale-95
    ${fullWidth ? "col-span-2" : ""}`}
    >
        {icon}
        <span>{children}</span>
    </button>
)

const Divider: React.FC = () => (
    <div className="my-6 flex items-center gap-3">
        <div className="h-[1px] w-full bg-zinc-300 dark:bg-zinc-700" />
        <span className="text-zinc-500 dark:text-zinc-400">OU</span>
        <div className="h-[1px] w-full bg-zinc-300 dark:bg-zinc-700" />
    </div>
)

const LoginForm: React.FC = () => {
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState("")
    const { login } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            await login(email, password)
            router.push("/dashboard")
        } catch (err: any) {
            console.error("Login error:", err)
            setError(err.message || "Falha ao entrar. Verifique suas credenciais.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div className="mb-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2 text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}
            <div className="mb-3">
                <label
                    htmlFor="email-input"
                    className="mb-1.5 block text-zinc-500 dark:text-zinc-400"
                >
                    Email
                </label>
                <input
                    id="email-input"
                    type="email"
                    placeholder="seu.email@provedor.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 
          bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-800 dark:text-zinc-200
          placeholder-zinc-400 dark:placeholder-zinc-500 
          ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700
          disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </div>
            <div className="mb-6">
                <div className="mb-1.5 flex items-end justify-between">
                    <label
                        htmlFor="password-input"
                        className="block text-zinc-500 dark:text-zinc-400"
                    >
                        Senha
                    </label>
                    <a href="#" className="text-sm text-blue-600 dark:text-blue-400">
                        Esqueceu?
                    </a>
                </div>
                <input
                    id="password-input"
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 
          bg-white dark:bg-zinc-900 px-3 py-2 text-zinc-800 dark:text-zinc-200
          placeholder-zinc-400 dark:placeholder-zinc-500 
          ring-1 ring-transparent transition-shadow focus:outline-0 focus:ring-blue-700
          disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
            </Button>
        </form>
    )
}

const TermsAndConditions: React.FC = () => (
    <p className="mt-9 text-xs text-zinc-500 dark:text-zinc-400">
        Ao entrar, você concorda com nossos{" "}
        <a href="#" className="text-blue-600 dark:text-blue-400">
            Termos e Condições
        </a>{" "}
        e{" "}
        <a href="#" className="text-blue-600 dark:text-blue-400">
            Política de Privacidade.
        </a>
    </p>
)

const BackgroundDecoration: React.FC = () => {
    const { theme } = useTheme()
    const isDarkTheme = theme === "dark"

    return (
        <div
            className="absolute right-0 top-0 z-0 size-[50vw]"
            style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke-width='2' stroke='rgb(30 58 138 / 0.5)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
            }}
        >
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: isDarkTheme
                        ? "radial-gradient(100% 100% at 100% 0%, rgba(9,9,11,0), rgba(9,9,11,1))"
                        : "radial-gradient(100% 100% at 100% 0%, rgba(255,255,255,0), rgba(255,255,255,1))",
                }}
            />
        </div>
    )
}

export default AuthForm
