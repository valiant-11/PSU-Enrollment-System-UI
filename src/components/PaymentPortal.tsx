import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { DollarSign, Download, CreditCard, Calendar, CheckCircle2, Building2, Wallet, Smartphone } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Student } from "../App";

interface PaymentPortalProps {
  student: Student;
  onUpdateStudent: (student: Student) => void;
}

export function PaymentPortal({ student, onUpdateStudent }: PaymentPortalProps) {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");

  const enrolledSubjects = [
    { code: "CS201", description: "Data Structures", units: 3, type: "Major" },
    { code: "CS202", description: "OOP", units: 3, type: "Major" },
    { code: "MATH201", description: "Discrete Math", units: 3, type: "Core" },
    { code: "ENG201", description: "Technical Writing", units: 3, type: "GE" },
    { code: "CS203", description: "Database Systems", units: 3, type: "Major" },
    { code: "PE201", description: "Physical Education 2", units: 2, type: "GE" },
  ];

  const totalUnits = enrolledSubjects.reduce((sum, s) => sum + s.units, 0);
  const tuitionPerUnit = 500;
  const tuitionFee = totalUnits * tuitionPerUnit;

  const miscFees = [
    { name: "Library Fee", amount: 500 },
    { name: "Computer Lab Fee", amount: 1500 },
    { name: "ID Fee", amount: 150 },
    { name: "Registration Fee", amount: 300 },
    { name: "Athletic Fee", amount: 200 },
    { name: "Cultural Fee", amount: 150 },
  ];

  const labFees = [
    { name: "CS Lab Fee", amount: 2000 },
    { name: "Database Lab Fee", amount: 1000 },
  ];

  const totalMiscFees = miscFees.reduce((sum, fee) => sum + fee.amount, 0);
  const totalLabFees = labFees.reduce((sum, fee) => sum + fee.amount, 0);
  const totalAssessment = tuitionFee + totalMiscFees + totalLabFees;

  const payments = student.payments || [];
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const remainingBalance = totalAssessment - totalPaid;

  const handleMakePayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(paymentAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast.error("Invalid amount", {
        description: "Please enter a valid payment amount.",
      });
      return;
    }

    if (amount > remainingBalance) {
      toast.error("Amount exceeds balance", {
        description: `Your remaining balance is ₱${remainingBalance.toLocaleString()}.`,
      });
      return;
    }

    const newPayment = {
      date: new Date().toISOString().split('T')[0],
      amount: amount,
      description: "Partial Payment",
    };

    const updatedStudent = {
      ...student,
      payments: [...payments, newPayment],
    };

    onUpdateStudent(updatedStudent);
    setPaymentAmount("");
    setIsPaymentDialogOpen(false);

    toast.success("Payment successful!", {
      description: `₱${amount.toLocaleString()} has been paid. Remaining balance: ₱${(remainingBalance - amount).toLocaleString()}`,
    });
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1>Fee Assessment & Payments</h1>
          <p className="text-muted-foreground">View your fees and manage payments</p>
        </div>

        {/* Payment Status */}
        {remainingBalance === 0 && (
          <Card className="p-6 shadow-md border-2 border-green-200 bg-green-50">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="text-green-800">Account Fully Paid</h3>
                <p className="text-sm text-green-700">You have no outstanding balance. Thank you!</p>
              </div>
            </div>
          </Card>
        )}

        {/* Student Info */}
        <Card className="p-6 shadow-md">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Student Number</p>
              <p className="text-sm">{student.studentNumber}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Student Name</p>
              <p className="text-sm">{student.fullName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Academic Year</p>
              <p className="text-sm">2024-2025</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Semester</p>
              <p className="text-sm">1st Semester</p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fee Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 shadow-md">
              <h3 className="mb-4">Fee Breakdown</h3>
              
              {/* Tuition */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h4>Tuition Fee</h4>
                  <p className="text-primary">₱{tuitionFee.toLocaleString()}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  ₱{tuitionPerUnit} per unit × {totalUnits} units
                </p>
              </div>

              <Separator className="my-4" />

              {/* Miscellaneous */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4>Miscellaneous Fees</h4>
                  <p className="text-primary">₱{totalMiscFees.toLocaleString()}</p>
                </div>
                <div className="space-y-2 ml-4">
                  {miscFees.map((fee) => (
                    <div key={fee.name} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{fee.name}</span>
                      <span>₱{fee.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              {/* Laboratory */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h4>Laboratory Fees</h4>
                  <p className="text-primary">₱{totalLabFees.toLocaleString()}</p>
                </div>
                <div className="space-y-2 ml-4">
                  {labFees.map((fee) => (
                    <div key={fee.name} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{fee.name}</span>
                      <span>₱{fee.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center pt-2 bg-primary/5 p-4 rounded-lg">
                <h3>Total Assessment</h3>
                <h3 className="text-primary">₱{totalAssessment.toLocaleString()}</h3>
              </div>
            </Card>

            {/* Payment History */}
            <Card className="p-6 shadow-md">
              <h3 className="mb-4">Payment History</h3>
              {payments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">No payments made yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-border">
                      <tr>
                        <th className="text-left py-3 px-2">Date</th>
                        <th className="text-left py-3 px-2">Description</th>
                        <th className="text-right py-3 px-2">Amount</th>
                        <th className="text-center py-3 px-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((payment, index) => {
                        const runningTotal = payments
                          .slice(0, index + 1)
                          .reduce((sum, p) => sum + p.amount, 0);
                        const balance = totalAssessment - runningTotal;
                        
                        return (
                          <tr key={index} className="border-b border-border last:border-0">
                            <td className="py-3 px-2 text-sm">{payment.date}</td>
                            <td className="py-3 px-2 text-sm">{payment.description}</td>
                            <td className="py-3 px-2 text-sm text-right text-green-600">
                              ₱{payment.amount.toLocaleString()}
                            </td>
                            <td className="py-3 px-2 text-center">
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-200 text-xs">
                                Paid
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>

          {/* Payment Summary */}
          <div className="space-y-4">
            <Card className="p-6 shadow-md sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-primary" />
                <h3>Payment Summary</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-secondary/30">
                  <p className="text-xs text-muted-foreground mb-1">Total Assessment</p>
                  <p className="text-xl">₱{totalAssessment.toLocaleString()}</p>
                </div>

                <Separator />

                <div className="p-4 rounded-lg bg-green-50">
                  <p className="text-xs text-muted-foreground mb-1">Total Paid</p>
                  <p className="text-xl text-green-600">₱{totalPaid.toLocaleString()}</p>
                </div>

                <Separator />

                <div className="p-4 rounded-lg bg-primary/10">
                  <p className="text-xs text-muted-foreground mb-1">Remaining Balance</p>
                  <h2 className="text-primary">₱{remainingBalance.toLocaleString()}</h2>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full gap-2" disabled={remainingBalance === 0}>
                      <CreditCard className="h-4 w-4" />
                      Make Payment
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Make a Payment</DialogTitle>
                      <DialogDescription>
                        Enter the amount you wish to pay.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleMakePayment} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Payment Amount</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          min="0"
                          step="0.01"
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Remaining balance: ₱{remainingBalance.toLocaleString()}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <RadioGroup
                          value={paymentMethod}
                          onValueChange={setPaymentMethod}
                          className="grid gap-3"
                        >
                          <div className="flex items-center space-x-3 border rounded-lg p-3 cursor-pointer hover:bg-secondary/50 transition-colors">
                            <RadioGroupItem value="credit-card" id="credit-card" />
                            <Label htmlFor="credit-card" className="flex items-center gap-2 cursor-pointer flex-1">
                              <CreditCard className="h-4 w-4 text-primary" />
                              <span>Credit/Debit Card</span>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 border rounded-lg p-3 cursor-pointer hover:bg-secondary/50 transition-colors">
                            <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                            <Label htmlFor="bank-transfer" className="flex items-center gap-2 cursor-pointer flex-1">
                              <Building2 className="h-4 w-4 text-primary" />
                              <span>Bank Transfer</span>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 border rounded-lg p-3 cursor-pointer hover:bg-secondary/50 transition-colors">
                            <RadioGroupItem value="e-wallet" id="e-wallet" />
                            <Label htmlFor="e-wallet" className="flex items-center gap-2 cursor-pointer flex-1">
                              <Wallet className="h-4 w-4 text-primary" />
                              <span>E-Wallet (GCash, PayMaya)</span>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 border rounded-lg p-3 cursor-pointer hover:bg-secondary/50 transition-colors">
                            <RadioGroupItem value="mobile-payment" id="mobile-payment" />
                            <Label htmlFor="mobile-payment" className="flex items-center gap-2 cursor-pointer flex-1">
                              <Smartphone className="h-4 w-4 text-primary" />
                              <span>Mobile Banking</span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsPaymentDialogOpen(false)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="flex-1">
                          Confirm Payment
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Download Assessment
                </Button>
              </div>
            </Card>

            <Card className="p-4 shadow-md bg-yellow-50 border-yellow-200">
              <p className="text-xs mb-2">
                <strong className="text-yellow-800">Payment Deadline:</strong>
              </p>
              <p className="text-sm text-yellow-700">January 31, 2025</p>
              <p className="text-xs text-yellow-700 mt-2">
                Please settle your balance on or before the deadline to avoid penalties.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}