import RequestForm from "@/components/requestForm/requestForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RequestPage() {
  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Submit Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <RequestForm />
        </CardContent>
      </Card>
    </div>
  );
}
