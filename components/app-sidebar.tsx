import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"

export function AppSidebar({className}:{className?:string}) {

  return (
    <Sidebar className={className}>
      <SidebarHeader >hey</SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter >
        
      </SidebarFooter>
    </Sidebar>
  )
}