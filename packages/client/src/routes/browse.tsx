import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/browse')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/browse"!</div>
}
