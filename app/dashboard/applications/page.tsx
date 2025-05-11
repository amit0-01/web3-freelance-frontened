"use client"
import { getUserRole } from "@/lib/utils"
import UserApplications from "@/components/userApplications"
import EmployerApplications from "@/components/employerApplications";


export default function ApplicationsPage() {

  const userRole = getUserRole();
  console.log('userrole', userRole);

  if (userRole === "FREELANCER") {
    return <UserApplications />
  } else if (userRole === "ADMIN") {
    return <EmployerApplications/>
  }

}
