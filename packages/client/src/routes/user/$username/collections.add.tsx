import { createFileRoute } from "@tanstack/react-router";

import { Link, Navigate, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Form,
} from "@/components/ui/form";

import useUser from "@/lib/hooks/use-user";
import { useCreateCollection } from "@/lib/hooks/use-collections";



export const Route = createFileRoute("/user/$username/collections/add")({
  component: RouteComponent,
});

const formSchema = z.object({
  name: z.string().min(1).max(32),
  description: z.string().max(255),
});

function RouteComponent() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", description: "" },
  });
  const create = useCreateCollection()

  const { user } = useUser();
  if (!user) {
    return <Navigate to=".." />;
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    create.mutate(values)
  }

  return (
    <Dialog open modal>
      <DialogContent
        className="sm:max-w-[425px] [&>button:last-child]:hidden bg-card"
        onInteractOutside={() => navigate({ to: ".." })}
      >
        <DialogHeader>
          <div className="flex flex-row justify-between">
            <DialogTitle>Create collection</DialogTitle>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter new username" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter new description" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" asChild>
                  <Link to="..">Cancel</Link>
                </Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
