import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { useState } from "react";

function Collapsible({
  alwaysOpen,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.Root> & {
  alwaysOpen?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => {
        if (!alwaysOpen) setOpen(true);
      }}
      onMouseLeave={() => {
        if (!alwaysOpen) setOpen(false);
      }}
    >
      <CollapsiblePrimitive.Root
        data-slot="collapsible"
        open={alwaysOpen ? true : open}
        onOpenChange={setOpen}
        {...props}
      />
    </div>
  );
}

function CollapsibleTrigger({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  );
}

function CollapsibleContent({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  );
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
