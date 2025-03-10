import { Send, RefreshCw } from "lucide-react";
import { TypesEnum, RangesEnum } from "@shared/enums/requests.enums";
import { Card, CardContent, CardHeader, CardTitle } from "@client/components/ui/card";
import { Button } from "@client/components/ui/button";
import { Form } from "@client/components/ui/form";
import { useRequestForm } from "@client/hooks/use-request-form";
import { BasicSettings } from "@client/components/forms/basic-settings";
import { MultiSelectField } from "@client/components/forms/multi-select-field";

export default function HomePage() {
  const {
    form,
    selectedTypes,
    setSelectedTypes,
    selectedRanges,
    setSelectedRanges,
    handleSubmit,
    resetForm,
    isSubmitting,
  } = useRequestForm();

  const handleSelectType = (type: TypesEnum) => {
    setSelectedTypes([...selectedTypes, type]);
  };

  const handleDeselectType = (type: TypesEnum) => {
    setSelectedTypes(selectedTypes.filter((t) => t !== type));
  };

  const handleSelectAllTypes = () => {
    setSelectedTypes(Object.values(TypesEnum));
  };

  const handleDeselectAllTypes = () => {
    setSelectedTypes([]);
  };

  const handleSelectRange = (range: RangesEnum) => {
    setSelectedRanges([...selectedRanges, range]);
  };

  const handleDeselectRange = (range: RangesEnum) => {
    setSelectedRanges(selectedRanges.filter((r) => r !== range));
  };

  const handleSelectAllRanges = () => {
    setSelectedRanges(Object.values(RangesEnum));
  };

  const handleDeselectAllRanges = () => {
    setSelectedRanges([]);
  };

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
                  onSelectAll={(checkedAllTypes) =>
                    checkedAllTypes ? handleSelectAllTypes() : handleDeselectAllTypes()
                  }
                  onSelectItem={(valueSelectType, checkedType) =>
                    checkedType
                      ? handleSelectType(valueSelectType as TypesEnum)
                      : handleDeselectType(valueSelectType as TypesEnum)
                  }
                />

                <MultiSelectField
                  form={form}
                  name="ranges"
                  label="Ranges"
                  options={RangesEnum}
                  selectedItems={selectedRanges}
                  onSelectAll={(checkedAllRanges) =>
                    checkedAllRanges ? handleSelectAllRanges() : handleDeselectAllRanges()
                  }
                  onSelectItem={(valueSelectRange, checkedRange) => {
                    checkedRange
                      ? handleSelectRange(valueSelectRange as RangesEnum)
                      : handleDeselectRange(valueSelectRange as RangesEnum);
                  }}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Request
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} disabled={isSubmitting}>
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
