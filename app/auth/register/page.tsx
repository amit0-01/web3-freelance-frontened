import { Suspense } from "react"
import RegisterClientForm from "./RegisterClientForm"

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading registration form...</div>}>
      <RegisterClientForm />
    </Suspense>
  )
}
