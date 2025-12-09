import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { DollarSign, Download, CreditCard } from "lucide-react";

export function FeeAssessment() {
  const enrollmentData = {
    studentId: "PSU-2024-123456",
    studentName: "Maria Santos",
    course: "BS Computer Science",
    semester: "1st Semester 2024-2025",
    totalUnits: 21,
  };

  const fees = [
    { category: "Tuition Fee", description: "Per unit: ₱500.00 × 21 units", amount: 10500 },
    { category: "Miscellaneous Fees", items: [
      { name: "Library Fee", amount: 500 },
      { name: "Computer Lab Fee", amount: 1500 },
      { name: "ID Fee", amount: 150 },
      { name: "Registration Fee", amount: 300 },
      { name: "Athletic Fee", amount: 200 },
      { name: "Cultural Fee", amount: 150 },
    ]},
    { category: "Laboratory Fees", items: [
      { name: "CS Lab Fee", amount: 2000 },
      { name: "Physics Lab Fee", amount: 1000 },
    ]},
    { category: "Other Fees", items: [
      { name: "Student Handbook", amount: 100 },
      { name: "Insurance", amount: 50 },
    ]},
  ];

  const paymentHistory = [
    { date: "2024-08-15", description: "Partial Payment", amount: 5000, balance: 11550, status: "Paid" },
    { date: "2024-09-01", description: "Partial Payment", amount: 5000, balance: 6550, status: "Paid" },
    { date: "2024-09-15", description: "Partial Payment", amount: 3000, balance: 3550, status: "Paid" },
  ];

  const calculateMiscellaneous = () => {
    const misc = fees.find(f => f.category === "Miscellaneous Fees");
    return misc?.items?.reduce((sum, item) => sum + item.amount, 0) || 0;
  };

  const calculateLaboratory = () => {
    const lab = fees.find(f => f.category === "Laboratory Fees");
    return lab?.items?.reduce((sum, item) => sum + item.amount, 0) || 0;
  };

  const calculateOther = () => {
    const other = fees.find(f => f.category === "Other Fees");
    return other?.items?.reduce((sum, item) => sum + item.amount, 0) || 0;
  };

  const totalAssessment = 10500 + calculateMiscellaneous() + calculateLaboratory() + calculateOther();
  const totalPaid = paymentHistory.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingBalance = totalAssessment - totalPaid;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1>Fee Assessment & Payment</h1>
          <p className="text-muted-foreground">View your fees and payment records</p>
        </div>

        {/* Student Info */}
        <Card className="p-6 mb-6 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Student ID</p>
              <p className="text-sm mt-1">{enrollmentData.studentId}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Student Name</p>
              <p className="text-sm mt-1">{enrollmentData.studentName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Course</p>
              <p className="text-sm mt-1">{enrollmentData.course}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Semester</p>
              <p className="text-sm mt-1">{enrollmentData.semester}</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fee Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 shadow-sm">
              <h3 className="mb-4">Fee Breakdown</h3>
              
              {/* Tuition */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h4>Tuition Fee</h4>
                  <p className="text-primary">₱{(10500).toLocaleString()}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Per unit: ₱500.00 × {enrollmentData.totalUnits} units
                </p>
              </div>

              <Separator className="my-4" />

              {/* Miscellaneous */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4>Miscellaneous Fees</h4>
                  <p className="text-primary">₱{calculateMiscellaneous().toLocaleString()}</p>
                </div>
                <div className="space-y-2 ml-4">
                  {fees.find(f => f.category === "Miscellaneous Fees")?.items?.map((item) => (
                    <div key={item.name} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.name}</span>
                      <span>₱{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              {/* Laboratory */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4>Laboratory Fees</h4>
                  <p className="text-primary">₱{calculateLaboratory().toLocaleString()}</p>
                </div>
                <div className="space-y-2 ml-4">
                  {fees.find(f => f.category === "Laboratory Fees")?.items?.map((item) => (
                    <div key={item.name} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.name}</span>
                      <span>₱{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              {/* Other Fees */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4>Other Fees</h4>
                  <p className="text-primary">₱{calculateOther().toLocaleString()}</p>
                </div>
                <div className="space-y-2 ml-4">
                  {fees.find(f => f.category === "Other Fees")?.items?.map((item) => (
                    <div key={item.name} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{item.name}</span>
                      <span>₱{item.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center pt-2">
                <h3>Total Assessment</h3>
                <h3 className="text-primary">₱{totalAssessment.toLocaleString()}</h3>
              </div>
            </Card>

            {/* Payment History */}
            <Card className="p-6 shadow-sm">
              <h3 className="mb-4">Payment History</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-3 px-2">Date</th>
                      <th className="text-left py-3 px-2">Description</th>
                      <th className="text-right py-3 px-2">Amount</th>
                      <th className="text-right py-3 px-2">Balance</th>
                      <th className="text-center py-3 px-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentHistory.map((payment, index) => (
                      <tr key={index} className="border-b border-border last:border-0">
                        <td className="py-3 px-2 text-sm">{payment.date}</td>
                        <td className="py-3 px-2 text-sm">{payment.description}</td>
                        <td className="py-3 px-2 text-sm text-right">
                          ₱{payment.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-2 text-sm text-right">
                          ₱{payment.balance.toLocaleString()}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-200 text-xs">
                            {payment.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="space-y-4">
            <Card className="p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-primary" />
                <h3>Payment Summary</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Assessment</p>
                  <p className="mt-1">₱{totalAssessment.toLocaleString()}</p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                  <p className="text-green-600 mt-1">
                    ₱{totalPaid.toLocaleString()}
                  </p>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground">Remaining Balance</p>
                  <h3 className="text-primary mt-1">
                    ₱{remainingBalance.toLocaleString()}
                  </h3>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Button className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Make Payment
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Assessment
                </Button>
              </div>
            </Card>

            <Card className="p-4 shadow-sm bg-primary/5 border-primary/20">
              <p className="text-xs text-muted-foreground">
                <strong>Payment Deadline:</strong> September 30, 2024
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Please settle your balance on or before the deadline to avoid penalties.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
