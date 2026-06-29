import { TreeItem } from '@/types'
import React from 'react'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/components/ui/collapsible";
import {
Sidebar,
SidebarContent,
SidebarGroup,
SidebarGroupContent,
SidebarMenu,
SidebarMenuButton,
SidebarMenuItem,
SidebarMenuSub,
SidebarProvider,
} from "@/components/ui/sidebar";
import { ChevronRight, File, FolderIcon } from 'lucide-react';

interface TreeViewProps {
    data: TreeItem[],
    value?: string | null;
    onSelect?: (value: string) => void
}


const TreeView = ({
    data,
    value,
    onSelect
}: TreeViewProps) => {
    return (
        <SidebarProvider className="h-full w-full">
            <Sidebar collapsible="none" className="h-full w-full border-r-0 bg-sidebar">
                <SidebarContent className="h-full overflow-auto">
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {data.map((item,index)=>(
                                    <Tree
                                      key={index}
                                      item={item}
                                      selectedValue={value}
                                      onSelect={onSelect}
                                      parentPath=''
                                    />
                                ))}
                            </SidebarMenu>

                        </SidebarGroupContent>

                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </SidebarProvider>
    )
}

interface TreeProps {
    item:TreeItem;
    selectedValue?:string | null;
    onSelect?:(value:string)=>void;
    parentPath:string
}

const Tree = ({
  item,
  selectedValue,
  onSelect,
  parentPath,
}: TreeProps) => {
  const [name, ...items] = Array.isArray(item) ? item : [item];

  const currentPath = parentPath ? `${parentPath}/${name}` : name;

  if (!items.length) {
    const isSelected = selectedValue === currentPath;

    return (
      <SidebarMenuButton
        isActive={isSelected}
        className="data-[active=true]:bg-transparent"
        onClick={() => onSelect?.(currentPath)}
      >
        <File />
        <span className="truncate">{name}</span>
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        defaultOpen
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <ChevronRight className="transition-transform" />
            <FolderIcon />
            <span className="truncate">{name}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((subItem, index) => (
              <Tree
                key={index}
                item={subItem}
                selectedValue={selectedValue}
                onSelect={onSelect}
                parentPath={currentPath}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};

export default TreeView