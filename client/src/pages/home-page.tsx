import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { LogIn, Send, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import { useRequestForm } from "@/hooks/use-request-form";
import { BasicSettings } from "@/components/forms/basic-settings";
import { MultiSelectField } from "@/components/forms/multi-select-field";
import { TypesEnum, RangesEnum } from "@shared/schema";

export default function HomePage() {
  const { user } = useAuth();
  const {
    form,
    isFullArea,
    setIsFullArea,
    selectedTypes,
    setSelectedTypes,
    selectedRanges,
    setSelectedRanges,
    handleSubmit,
    resetForm,
    isSubmitting,
  } = useRequestForm();

  const handleSelectAllTypes = (checked: boolean) => {
    if (checked) {
      setSelectedTypes(Object.values(TypesEnum));
    } else {
      setSelectedTypes([]);
    }
  };

  const handleSelectAllRanges = (checked: boolean) => {
    if (checked) {
      setSelectedRanges(Object.values(RangesEnum));
    } else {
      setSelectedRanges([]);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to Request System</h2>
            <p className="text-muted-foreground mb-6">
              Please log in to submit requests.
            </p>
            <Button asChild>
              <Link href="/auth">
                <LogIn className="h-4 w-4 mr-2" />
                Login to Continue
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Submit Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <BasicSettings form={form} />

              <div className="grid gap-4 md:grid-cols-2">
                <MultiSelectField
                  form={form}
                  name="types"
                  label="Types"
                  options={TypesEnum}
                  selectedItems={selectedTypes}
                  onSelectAll={handleSelectAllTypes}
                  onSelectItem={(value, checked) => {
                    if (checked) {
                      setSelectedTypes([...selectedTypes, value]);
                    } else {
                      setSelectedTypes(selectedTypes.filter((t) => t !== value));
                    }
                  }}
                />

                <MultiSelectField
                  form={form}
                  name="ranges"
                  label="Ranges"
                  options={RangesEnum}
                  selectedItems={selectedRanges}
                  onSelectAll={handleSelectAllRanges}
                  onSelectItem={(value, checked) => {
                    if (checked) {
                      setSelectedRanges([...selectedRanges, value]);
                    } else {
                      setSelectedRanges(selectedRanges.filter((r) => r !== value));
                    }
                  }}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Request
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear Form
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}