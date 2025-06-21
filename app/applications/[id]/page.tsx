"use client"
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const ViewFullApplication = ({ application }: { application: any }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 p-6 md:p-10">
        <div className="grid gap-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <CardTitle className="text-xl">
                    <h2>{application.job.title}</h2>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Applied on {new Date(application.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={getStatusColor(application.status) as any}>
                  {application.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-medium mb-1">Your Proposal</h3>
                  <p className="text-sm">{application.coverLetter}</p>
                  <div className="mt-4">
                    <h4 className="font-medium">Portfolio Link</h4>
                    <a
                      href={application.portfolioLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {application.portfolioLink}
                    </a>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Your Bid:</span>
                    <span className="font-medium">{application.proposedRate} ETH</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estimated Duration:</span>
                    <span className="font-medium">{application.estimatedDuration.replace(/-/g, " ")}</span>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Link href={`/jobs/${application.jobId}`}>
                      <Button variant="outline" size="sm">
                        View Job
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

const ViewApplicationPage = () => {
    const params = useParams();
    const applicationId = params?.id;
  
    const application = mockApplicationData.find(
      (app) => app.id === parseInt(applicationId as string)
    );
  
    if (!application) return <p>Loading...</p>;
  
    return <ViewFullApplication application={application} />;
  };
  

export default ViewApplicationPage;

// Mock Data for testing
const mockApplicationData = [
  {
    id: 37,
    jobId: 56,
    userId: 36,
    coverLetter:
      "I'm excited to apply for the Smart Contract Developer position at [Company Name]...",
    proposedRate: 0.0001,
    estimatedDuration: "1-2-weeks",
    portfolioLink: "https://amit-portfoli0.netlify.app/",
    createdAt: "2025-05-04T18:26:30.311Z",
    status: "PENDING",
    job: {
      id: 56,
      title: "Smart Contract Developer",
      description:
        "We're looking for an experienced Solidity developer to build and audit our DeFi protocol smart contracts...",
      payment: "0.0001",
      isPaid: false,
      employer: {
        id: 1,
        name: "Amit",
      },
    },
  },
  {
    id: 38,
    jobId: 57,
    userId: 36,
    coverLetter:
      "Hello, I'm an experienced Solidity developer with over 3 years of hands-on expertise...",
    proposedRate: 0.0025,
    estimatedDuration: "1-2-weeks",
    portfolioLink: "https://www.google.com",
    createdAt: "2025-05-10T07:28:50.368Z",
    status: "PENDING",
    job: {
      id: 57,
      title: "Experienced Solidity Developer Needed",
      description:
        "We’re seeking a skilled Solidity developer to help us design, develop, and secure smart contracts for our next-gen DeFi platform...",
      payment: "0.0025",
      isPaid: false,
      employer: {
        id: 1,
        name: "Amit",
      },
    },
  },
];

// A helper function to get badge color based on the status
const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "yellow";
    case "ACCEPTED":
      return "green";
    case "REJECTED":
      return "red";
    default:
      return "gray";
  }
};
