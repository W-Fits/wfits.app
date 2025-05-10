"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { toast } from "sonner"
import { createUser } from "@/lib/actions/create-user"
import { credentialsSignIn } from "@/lib/actions/credentials-sign-in"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useDebounce } from "@/lib/hooks/use-debounce"
import { useRouter } from "next/navigation"

// Helper function to check if a requirement is met
const RequirementCheck = ({ met, text }: { met: boolean; text: string }) => {
  return (
    <li className={`text-xs flex items-center gap-1.5 ${met ? "text-green-600" : "text-muted-foreground"}`}>
      {met ? <CheckCircle className="h-3 w-3" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />} {text}
    </li>
  )
}

export default function SignUp() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [checkingUsername, setCheckingUsername] = useState<boolean>(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const router = useRouter();
  const debouncedUsername = useDebounce(username, 500)

  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    passwordsMatch: false,
  })

  const [usernameRequirements, setUsernameRequirements] = useState({
    minLength: false,
    isValidChars: false,
    isAvailable: false,
  })

  useEffect(() => {
    setPasswordRequirements({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[^A-Za-z0-9]/.test(password),
      passwordsMatch: password === confirmPassword && password !== "",
    })
  }, [password, confirmPassword])

  useEffect(() => {
    setUsernameRequirements({
      minLength: username.length >= 3,
      isValidChars: /^[a-zA-Z0-9_]+$/.test(username),
      isAvailable: usernameAvailable === true,
    })
  }, [username, usernameAvailable])

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (!debouncedUsername || !usernameRequirements.minLength || !usernameRequirements.isValidChars) {
        setUsernameAvailable(null)
        return
      }

      try {
        setCheckingUsername(true)
        const response = await fetch(`/api/username?username=${debouncedUsername}`)
        const data = await response.json()
        setUsernameAvailable(data)
      } catch (error) {
        console.error("Error checking username availability:", error)
        setUsernameAvailable(null)
      } finally {
        setCheckingUsername(false)
      }
    }

    checkUsernameAvailability()
  }, [debouncedUsername, usernameRequirements.minLength, usernameRequirements.isValidChars])

  const allPasswordRequirementsMet = Object.values(passwordRequirements).every((req) => req === true)
  const allUsernameRequirementsMet =
    usernameRequirements.minLength && usernameRequirements.isValidChars && usernameAvailable === true

  const validateInputs = () => {
    let isValid = true
    if (!email || !password || !username || !confirmPassword) {
      toast.warning("Please fill out all fields.")
      isValid = false
    }
    if (!allPasswordRequirementsMet) {
      toast.warning("Password does not meet all requirements.")
      isValid = false
    }
    if (!allUsernameRequirementsMet) {
      toast.warning("Username does not meet all requirements or is not available.")
      isValid = false
    }
    if (password !== confirmPassword) {
      toast.warning("Passwords do not match.")
      isValid = false
    }
    return isValid
  }

  const submit = async () => {
    setLoading(true)
    if (!validateInputs()) {
      setLoading(false)
      return
    }

    try {
      const createUserPromise = createUser(username, password, email)

      toast.promise(createUserPromise, {
        loading: "Creating account...",
        success: "Account created successfully!",
        error: (err) => {
          return `Error creating account: ${err instanceof Error ? err.message : String(err)}`
        },
      })

      await createUserPromise // Wait for the user creation to complete before signing in
      await credentialsSignIn(email, password)
      router.push('/onboarding')
    } catch (error) {
      toast.warning(String(error))
    }
    setLoading(false)
  }

  const isButtonDisabled =
    loading ||
    !email ||
    !password ||
    !username ||
    !confirmPassword ||
    !allPasswordRequirementsMet ||
    !allUsernameRequirementsMet

  return (
    <section className="flex min-h-screen w-full items-center p-4 justify-center flex-col gap-4">
      <Card className="w-full max-w-md shadow-lg border-gray-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">Enter your details to sign up</CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 grid gap-4">
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              {checkingUsername && (
                <div className="flex items-center text-xs text-muted-foreground">
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Checking...
                </div>
              )}
              {!checkingUsername && usernameAvailable !== null && (
                <div className={`flex items-center text-xs ${usernameAvailable ? "text-green-600" : "text-red-500"}`}>
                  {usernameAvailable ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Available
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1" />
                      Taken
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="relative">
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                disabled={loading}
                autoFocus
                aria-describedby="username-requirements"
                className={`pr-8 ${username && !checkingUsername
                  ? usernameAvailable
                    ? "border-green-500 focus-visible:ring-green-500"
                    : usernameAvailable === false
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  : ""
                  }`}
                placeholder="johndoe"
              />
              {username && !checkingUsername && usernameAvailable !== null && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {usernameAvailable ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {username && (
              <div className="bg-muted/50 rounded-md p-2 border border-border/50 mt-1">
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Username requirements:</p>
                <ul id="username-requirements" className="space-y-1">
                  <RequirementCheck met={usernameRequirements.minLength} text="At least 3 characters long" />
                  <RequirementCheck
                    met={usernameRequirements.isValidChars}
                    text="Only letters, numbers, and underscores"
                  />
                  <RequirementCheck met={usernameRequirements.isAvailable} text="Username is available" />
                </ul>
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              placeholder="email@example.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              disabled={loading}
              aria-describedby="password-requirements"
            />
            {password && (
              <div className="bg-muted/50 rounded-md p-2 border border-border/50 mt-1">
                <p className="text-xs font-medium text-muted-foreground mb-1.5">Password requirements:</p>
                <ul id="password-requirements" className="space-y-1">
                  <RequirementCheck met={passwordRequirements.minLength} text="At least 8 characters long" />
                  <RequirementCheck met={passwordRequirements.hasUppercase} text="Contains uppercase letter" />
                  <RequirementCheck met={passwordRequirements.hasLowercase} text="Contains lowercase letter" />
                  <RequirementCheck met={passwordRequirements.hasNumber} text="Contains number" />
                  <RequirementCheck met={passwordRequirements.hasSpecialChar} text="Contains special character" />
                </ul>
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.currentTarget.value)}
              disabled={loading}
            />
            {confirmPassword && (
              <div
                className={`text-xs flex items-center gap-1.5 mt-1 ${passwordRequirements.passwordsMatch ? "text-green-600" : "text-red-500"}`}
              >
                {passwordRequirements.passwordsMatch ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <XCircle className="h-3 w-3" />
                )}
                {passwordRequirements.passwordsMatch ? "Passwords match" : "Passwords don't match"}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button onClick={submit} disabled={isButtonDisabled} className="w-full">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </div>
            ) : (
              "Create account"
            )}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link className="font-medium text-primary hover:underline" href="/sign-in">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </section>
  )
}