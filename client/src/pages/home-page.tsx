import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { User, Send, RefreshCw, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRequestSchema, VariableEnum, TypesEnum, RangesEnum, FormatEnum } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";

const DEFAULT_VALUES = {
  variable: undefined,
  pressureLevels: "",
  years: "",
  months: "",
  days: "",
  hours: "",
  area: "0,0,0,0",
  types: "",
  ranges: "",
  levels: "",
  instants: "",
  isAll: false,
  format: undefined,
  outDir: "",
  tracking: false,
  debug: false,
  noCompile: false,
  noExecute: false,
  noCompileExecute: false,
  noMaps: false,
  animation: false,
  omp: false,
  mpi: false,
  nThreads: "",
  nProces: "",
};

export default function HomePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();
  const [isFullArea, setIsFullArea] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedRanges, setSelectedRanges] = useState<string[]>([]);

  const form = useForm({
    resolver: zodResolver(insertRequestSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const watchIsAll = form.watch("isAll");

  // Effect for handling full area checkbox
  useEffect(() => {
    if (isFullArea) {
      form.setValue("area", "90,-180,-90,180");
    } else {
      form.setValue("area", "0,0,0,0");
    }
  }, [isFullArea, form]);

  // Clear instants when isAll is toggled
  useEffect(() => {
    if (watchIsAll) {
      form.setValue("instants", "");
    }
  }, [watchIsAll, form]);

  // Parse URL parameters for pre-filling form
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const variable = params.get('variable');
    const outDir = params.get('outDir');
    const debug = params.get('debug');

    if (variable || outDir || debug) {
      form.reset({
        ...DEFAULT_VALUES,
        variable: variable as keyof typeof VariableEnum || undefined,
        outDir: outDir || "",
        debug: debug === "true",
      });
    }
  }, [location, form]);

  const submitMutation = useMutation({
    mutationFn: async (data: typeof form.getValues) => {
      const res = await apiRequest("POST", "/api/requests", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Request submitted",
        description: "Your request has been saved and will be processed.",
      });
      form.reset(DEFAULT_VALUES);
      setSelectedTypes([]);
      setSelectedRanges([]);
      setIsFullArea(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    submitMutation.mutate(data);
  });

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
          <div className="flex items-center gap-3 text-muted-foreground mb-6">
            <User className="h-5 w-5" />
            <span>Welcome back, {user.username}!</span>
          </div>

          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Basic Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Settings</h3>

                <FormField
                  control={form.control}
                  name="variable"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variable</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a variable..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={VariableEnum.Geopotential}>Geopotential</SelectItem>
                          <SelectItem value={VariableEnum.Temperature}>Temperature</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Array Inputs */}
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="pressureLevels"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pressure Levels</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 1000,850,700" />
                        </FormControl>
                        <FormDescription>Enter comma-separated values</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="years"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 2020,2021,2022" />
                        </FormControl>
                        <FormDescription>Enter comma-separated values</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="months"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Months</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 1,2,3" />
                        </FormControl>
                        <FormDescription>Enter comma-separated values (1-12)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="days"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Days</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 1,15,30" />
                        </FormControl>
                        <FormDescription>Enter comma-separated values (1-31)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hours</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 0,6,12,18" />
                        </FormControl>
                        <FormDescription>Enter comma-separated values (0-23)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Area Settings */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fullArea"
                      checked={isFullArea}
                      onCheckedChange={(checked) => setIsFullArea(checked as boolean)}
                    />
                    <label
                      htmlFor="fullArea"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Use Full Area
                    </label>
                  </div>

                  <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Area (N,W,S,E)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isFullArea}
                            placeholder="e.g., 0,0,0,0"
                          />
                        </FormControl>
                        <FormDescription>Enter 4 comma-separated values (North,West,South,East)</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Types and Ranges with Multi-select */}
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="types"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Types</FormLabel>
                        <Select>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select types..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <div className="p-2 space-y-2">
                              <div className="flex items-center space-x-2 pb-2 border-b">
                                <Checkbox
                                  checked={selectedTypes.length === Object.keys(TypesEnum).length}
                                  onCheckedChange={handleSelectAllTypes}
                                />
                                <span className="text-sm">Select All</span>
                              </div>
                              {Object.entries(TypesEnum).map(([key, value]) => (
                                <div key={value} className="flex items-center space-x-2 py-1">
                                  <Checkbox
                                    checked={selectedTypes.includes(value)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        const newTypes = [...selectedTypes, value];
                                        setSelectedTypes(newTypes);
                                        field.onChange(newTypes.join(","));
                                      } else {
                                        const newTypes = selectedTypes.filter((t) => t !== value);
                                        setSelectedTypes(newTypes);
                                        field.onChange(newTypes.join(","));
                                      }
                                    }}
                                  />
                                  <span className="text-sm">{key}</span>
                                </div>
                              ))}
                            </div>
                          </SelectContent>
                        </Select>
                        {selectedTypes.length > 0 && (
                          <FormDescription>
                            Selected: {selectedTypes.join(", ")}
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ranges"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ranges</FormLabel>
                        <Select>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select ranges..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <div className="p-2 space-y-2">
                              <div className="flex items-center space-x-2 pb-2 border-b">
                                <Checkbox
                                  checked={selectedRanges.length === Object.keys(RangesEnum).length}
                                  onCheckedChange={handleSelectAllRanges}
                                />
                                <span className="text-sm">Select All</span>
                              </div>
                              {Object.entries(RangesEnum).map(([key, value]) => (
                                <div key={value} className="flex items-center space-x-2 py-1">
                                  <Checkbox
                                    checked={selectedRanges.includes(value)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        const newRanges = [...selectedRanges, value];
                                        setSelectedRanges(newRanges);
                                        field.onChange(newRanges.join(","));
                                      } else {
                                        const newRanges = selectedRanges.filter((r) => r !== value);
                                        setSelectedRanges(newRanges);
                                        field.onChange(newRanges.join(","));
                                      }
                                    }}
                                  />
                                  <span className="text-sm">{key}</span>
                                </div>
                              ))}
                            </div>
                          </SelectContent>
                        </Select>
                        {selectedRanges.length > 0 && (
                          <FormDescription>
                            Selected: {selectedRanges.join(", ")}
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Levels and Instants */}
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="levels"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Levels</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., 1,2,3" />
                        </FormControl>
                        <FormDescription>Enter comma-separated values</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isAll"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Use All Instants</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {!watchIsAll && (
                    <FormField
                      control={form.control}
                      name="instants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instants</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., 1,2,3" disabled={watchIsAll} />
                          </FormControl>
                          <FormDescription>Required when 'All' is not selected</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Format and Output Directory */}
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="format"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Format</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a format..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(FormatEnum).map(([key, value]) => (
                              <SelectItem key={value} value={value}>
                                {key}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="outDir"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Output Directory (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="/path/to/output" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Advanced Settings</h3>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="tracking"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Enable Tracking</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="debug"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Debug Mode</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="noCompile"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>No Compile</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="noExecute"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>No Execute</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="noCompileExecute"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>No Compile Execute</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="noMaps"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>No Maps</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="animation"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Animation</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="omp"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>OMP</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mpi"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>MPI</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Conditional rendering for nThreads and nProces */}
                <div className="grid gap-4 md:grid-cols-2">
                  {form.watch("omp") && (
                    <FormField
                      control={form.control}
                      name="nThreads"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Threads</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
                              placeholder="Optional"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {form.watch("mpi") && (
                    <FormField
                      control={form.control}
                      name="nProces"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Processes</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
                              placeholder="Optional"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={submitMutation.isPending}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Request
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset(DEFAULT_VALUES);
                    setSelectedTypes([]);
                    setSelectedRanges([]);
                    setIsFullArea(false);
                  }}
                  disabled={submitMutation.isPending}
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