import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { User, Loader2, UserX, Edit2, Send, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type Request } from "@shared/schema/schema";
import { insertRequestToRequestFormInput, RequestFormInput } from "@shared/types/RequestFormInput";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProfilePage() {
  const { user, updateProfileMutation, deleteProfileMutation } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [, setLocation] = useLocation();

  const { data: requests = [], refetch } = useQuery<(Request & { count: number })[]>({
    queryKey: ["/api/requests"],
  });

  const form = useForm({
    resolver: zodResolver(insertUserSchema.pick({ username: true })),
    defaultValues: {
      username: user?.username ?? "",
    },
  });

  const onSubmit = (data: { username: string }) => {
    updateProfileMutation.mutate(data, {
      onSuccess: () => setIsEditing(false),
    });
  };

  const onDelete = () => {
    deleteProfileMutation.mutate(undefined, {
      onSuccess: () => setLocation("/auth"),
    });
  };

  const handleRequestAgain = (request: RequestFormInput) => {
    setLocation("/", {
      state: {
        variableName: request.variableName,
        pressureLevels: request.pressureLevels,
        types: request.mapTypes,
        ranges: request.mapRanges,
        format: request.fileFormat,
        outDir: request.outDir,
        tracking: request.tracking,
        debug: request.debug,
        noCompile: request.noCompile,
        noExecute: request.noExecute,
        noMaps: request.noMaps,
        animation: request.animation,
        omp: request.omp,
        mpi: request.mpi,
        nThreads: request.nThreads,
        nProces: request.nProces,
      },
    });
  };

  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-2xl mx-auto mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <User className="h-6 w-6" />
              Profile
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                <Edit2 className="h-4 w-4 mr-2" />
                {isEditing ? "Cancel" : "Edit"}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <UserX className="h-4 w-4 mr-2" />
                    Delete Profile
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account and
                      remove all your data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={onDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deleteProfileMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Delete Account"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={updateProfileMutation.isPending}>
                  {updateProfileMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Save Changes
                </Button>
              </form>
            </Form>
          ) : (
            <div className="grid gap-4">
              <div>
                <label htmlFor="username" className="text-sm font-medium text-muted-foreground">
                  Username
                </label>
                <p id="username" className="text-lg">
                  {user?.username}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">Request History</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No requests yet.</p>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-card"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">Variable: {request.variableName}</p>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(request.createdAt), "PPpp")}
                      </span>
                      {request.count > 1 && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          Requested {request.count} times
                        </span>
                      )}
                    </div>
                    {request.outDir && (
                      <p className="text-sm">Output Directory: {request.outDir}</p>
                    )}
                    <p className="text-sm">Debug Mode: {request.debug ? "Enabled" : "Disabled"}</p>
                  </div>
                  <Button
                    onClick={() => handleRequestAgain(insertRequestToRequestFormInput(request))}
                    size="sm"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Request Again
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
