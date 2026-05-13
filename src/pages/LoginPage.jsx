import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'

import { useAuth } from '../context/AuthContext'
import s from './LoginPage.module.css'

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function LoginPage() {
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const { signIn } = useAuth()

  const nav = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    setLoading(true)

    try {
      const { error } = await signIn(data.email, data.password)

      if (error) {
        toast.error(error.message || 'Invalid credentials')
        setLoading(false)
        return
      }

      toast.success('Welcome back!')

      // Wait for profile to load then redirect
      let attempts = 0

      const interval = setInterval(async () => {
        attempts++

        try {
          const m = await import('../lib/supabase')

          const {
            data: { user },
          } = await m.supabase.auth.getUser()

          if (!user) {
            if (attempts > 10) {
              clearInterval(interval)
              setLoading(false)
              nav('/')
            }
            return
          }

          const { data: profileData, error: profileError } =
            await m.supabase
              .from('profiles')
              .select('role')
              .eq('id', user.id)
              .single()

          if (profileData?.role || attempts > 10 || profileError) {
            clearInterval(interval)

            setLoading(false)

            if (profileData?.role === 'admin') {
              nav('/admin')
            } else if (profileData?.role === 'staff') {
              nav('/staff')
            } else {
              nav('/')
            }
          }
        } catch (err) {
          clearInterval(interval)
          setLoading(false)

          toast.error('Something went wrong loading your profile')
          nav('/')
        }
      }, 300)
    } catch (err) {
      toast.error('Login failed')
      setLoading(false)
    }
  }

  return (
    <div className={s.page}>
      <div className={s.left}>
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=85"
          alt="Real estate"
        />

        <div className={s.lOv} />

        <div className={s.lContent}>
          <Link to="/" className={s.lLogo}>
            <img src="/logo.jpg" alt="Amon Heights" />

            <div>
              <div className={s.lA}>Amon</div>
              <div className={s.lH}>Heights</div>
            </div>
          </Link>

          <h2 className={s.lTagline}>
            Premium Real Estate
            <br />
            in Abuja
          </h2>

          <p className={s.lSub}>
            Access your admin or staff portal to manage properties,
            bookings, and more.
          </p>
        </div>
      </div>

      <div className={s.right}>
        <div className={s.formBox}>
          <div className={s.logo2}>
            <img src="/logo.jpg" alt="Amon Heights" />
          </div>

          <h1 className={s.title}>Welcome Back</h1>

          <p className={s.sub}>
            Sign in to your Amon Heights portal
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="fg">
              <label className="fl">Email Address</label>

              <input
                {...register('email')}
                type="email"
                className={`fi ${errors.email ? 'err' : ''}`}
                placeholder="admin@amonheights.online"
                autoComplete="email"
              />

              {errors.email && (
                <span className="fe">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="fg">
              <label className="fl">Password</label>

              <div className={s.pwdWrap}>
                <input
                  {...register('password')}
                  type={showPwd ? 'text' : 'password'}
                  className={`fi ${errors.password ? 'err' : ''}`}
                  placeholder="Your password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className={s.eyeBtn}
                  onClick={() => setShowPwd(!showPwd)}
                >
                  {showPwd ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>

              {errors.password && (
                <span className="fe">
                  {errors.password.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{
                width: '100%',
                justifyContent: 'center',
                marginTop: '.5rem',
              }}
            >
              <LogIn size={17} />

              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className={s.foot}>
            <Link to="/" className={s.backHome}>
              ← Back to Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}