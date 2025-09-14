import {
  createFileRoute,
  Link,
  Navigate,
  useNavigate,
} from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import {
  useDeleteCollection,
  useUpdateCollection,
} from "@/lib/hooks/use-collections";
import useUser from "@/lib/hooks/use-user";
import { Trash } from "lucide-react";

const formSchema = z.object({
  name: z.string().max(32),
  description: z.string().max(255),
});
export const Route = createFileRoute("/collections/$collectionId/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", description: "" },
  });

  const { collectionId } = Route.useParams();
  const update = useUpdateCollection(collectionId);
  const { user } = useUser();
  const deleteMutation = useDeleteCollection(collectionId);
  if (!user) {
    return <Navigate to=".." />;
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    update.mutate({ id: collectionId, ...values });
  }

  return (
    <Dialog open modal>
      <DialogContent
        className="sm:max-w-[425px] [&>button:last-child]:hidden bg-card"
        onInteractOutside={() => navigate({ to: ".." })}
      >
        <DialogHeader>
          <div className="flex flex-row justify-between">
            <DialogTitle>Edit collection</DialogTitle>
            <Button
              onClick={() => {
                deleteMutation.mutate(collectionId);
              }}
              variant={"destructive"}
              className="hover:scale-105 transition-transform delay-50 duration-200"
            >
              <Trash />
            </Button>
          </div>
          <DialogDescription>
            Make changes to your collection here. Click save when you&apos;re
            done.
          </DialogDescription>
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
