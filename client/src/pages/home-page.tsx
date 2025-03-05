import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
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
} from "@/components/ui/form";
import { User, Send, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRequestSchema, FormValues, Variable } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(insertRequestSchema),
    defaultValues: {
      variable: undefined,
      outDir: "",
      debug: false,
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await apiRequest("POST", "/api/requests", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Request submitted",
        description: "Your request has been saved and will be processed.",
      });
      form.reset({
        variable: undefined,
        outDir: "",
        debug: false,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = form.handleSubmit((data: FormValues) => submitMutation.mutate(data));

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Submit Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-3 text-muted-foreground mb-6">
            <User className="h-5 w-5" />
            {user ? (
              <span>Welcome back, {user.username}!</span>
            ) : (
              <span>Welcome, anonymous user!</span>
            )}
          </div>

          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-6">
              <FormField
                control={form.control}
                name="variable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variable</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a variable..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={Variable.Geopotential}>Geopotential</SelectItem>
                        <SelectItem value={Variable.Temperature}>Temperature</SelectItem>
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

              <FormField
                control={form.control}
                name="debug"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Enable Debug Mode</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button type="submit" className="flex-1" disabled={submitMutation.isPending}>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Request
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    form.reset({
                      variable: undefined,
                      outDir: "",
                      debug: false,
                    })
                  }
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
