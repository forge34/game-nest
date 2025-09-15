import {
  createFileRoute,
  Link,
  Navigate,
  useNavigate,
} from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { useDebounce } from "use-debounce";
import { useState } from "react";
import SearchInput from "@/components/search-input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
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
import { searchGame } from "@/api/games";

import { useAddGameToCollection } from "@/lib/hooks/use-collections";
import { useQuery } from "@tanstack/react-query";
import { zodValidator } from "@tanstack/zod-adapter";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().max(32),
  description: z.string().max(255),
});

const SearchScema = z.object({
  term: z.string().default(""),
});
export const Route = createFileRoute("/collections/$collectionId/edit")({
  component: RouteComponent,

  validateSearch: zodValidator(SearchScema),
});

function RouteComponent() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", description: "" },
  });

  const { collectionId } = Route.useParams();
  const update = useUpdateCollection(collectionId);
  const { user } = useUser();
  const deleteMutation = useDeleteCollection(collectionId);
  const { term } = Route.useSearch();

  if (!user) {
    return <Navigate to=".." />;
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    if (values.description.trim() === "" && values.name.trim() === "") {
      toast.error("Can't update collection with empty fields");
      return;
    }
    update.mutate({ id: collectionId, ...values });
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="gap-4 flex flex-col w-full py-2 pr-8"
        >
          <h3 className="text-2xl font-semibold">Edit Collection data</h3>
          <p className="text-sm text-muted-foreground ">
            Update collection's info or add / remove a game
          </p>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Collection Name</FormLabel>
                <FormControl>
                  <Input
                    className="bg-input/30"
                    placeholder="Enter new collection name"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Collection Description</FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-input/30"
                    placeholder="Enter new collection description"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button className="self-start" type="submit">
            Save info
          </Button>
          <SearchGame searchValue={term} collectionId={collectionId} />
          <div className="flex flex-row gap-4 justify-end">
            <Button variant="outline" asChild>
              <Link to="..">Finish editing</Link>
            </Button>
            <Button
              onClick={() => {
                deleteMutation.mutate(collectionId);
              }}
              variant={"destructive"}
              className="hover:scale-105 transition-transform delay-50 duration-200"
            >
              <Trash />
              Delete collection
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

function SearchGame({
  collectionId,
  searchValue,
}: {
  collectionId: string;
  searchValue: string;
}) {
  const [debounced] = useDebounce(searchValue, 400);
  const { data } = useQuery(searchGame(debounced));
  const add = useAddGameToCollection(collectionId);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function clearSearch() {
    navigate({ to: ".", search: { term: "" } });
  }
  function handleOpenChange(open: boolean) {
    if (!open) clearSearch();
    setOpen(open);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button className="self-start bg-secondary/75 transition-colors">
          Add game
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="bg-card p-0 min-w-full"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SearchInput
          name="game-search"
          value={searchValue}
          className="bg-card focus:outline1 w-full"
          onChange={(e) =>
            navigate({ to: ".", search: { term: e.target.value } })
          }
        />

        {data?.map((g) => (
          <div
            key={g.id}
            onClick={() => {
              add.mutate({ id: collectionId, gameId: g.id });
              setOpen(false);
              clearSearch();
            }}
            className="
		    flex flex-row items-center gap-3
		    px-2 py-1.5 rounded-md cursor-pointer
		    transition-colors
		    hover:bg-accent hover:text-accent-foreground
		  "
          >
            <img src={g.coverUrl} className="w-9 h-full rounded-md" />
            <p className="text-sm font-light truncate">{g.title}</p>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
}
