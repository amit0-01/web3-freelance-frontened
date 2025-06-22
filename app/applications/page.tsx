"use client"
import { getUserRole } from "@/lib/utils"
import UserApplications from "@/components/userApplications"
import EmployerApplications from "@/components/employerApplications";
import { useEffect } from "react";


export default function ApplicationsPage() {

  const userRole = getUserRole();

  if (userRole === "FREELANCER") {
    return <UserApplications />
  } else if (userRole === "CLIENT") {
    return <EmployerApplications/>
  }

}
