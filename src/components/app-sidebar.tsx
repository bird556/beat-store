import * as React from 'react';
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconHelp,
  IconListDetails,
  IconSearch,
  IconSettings,
  IconMusicBolt,
  IconPackage,
  IconPackageImport,
  IconHome,
  IconUpload,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { NavDocuments } from '@/components/nav-documents';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import BirdieBandsAvatar from '@/Images/cropped.png';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const data = {
  user: {
    name: 'Birdie Bands',
    email: 'dev@birdiebands.com',
    avatar: `${BirdieBandsAvatar}`,
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: IconDashboard,
    },
    {
      title: 'Beats',
      url: '/admin/beats',
      icon: IconMusicBolt,
    },
    {
      title: 'Packs',
      url: '#',
      icon: IconPackage,
    },
    {
      title: 'Blog Posts',
      url: '#',
      icon: IconListDetails,
    },
    {
      title: 'Analytics',
      url: '#',
      icon: IconChartBar,
    },
    // {
    //   title: 'Projects',
    //   url: '#',
    //   icon: IconFolder,
    // },
    // {
    //   title: 'Team',
    //   url: '#',
    //   icon: IconUsers,
    // },
  ],
  navClouds: [
    {
      title: 'Capture',
      icon: IconCamera,
      isActive: true,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
    {
      title: 'Proposal',
      icon: IconFileDescription,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
    {
      title: 'Prompts',
      icon: IconFileAi,
      url: '#',
      items: [
        {
          title: 'Active Proposals',
          url: '#',
        },
        {
          title: 'Archived',
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Home',
      url: '/',
      icon: IconHome,
    },
    {
      title: 'Settings',
      url: '#',
      icon: IconSettings,
    },
    {
      title: 'Get Help',
      url: '#',
      icon: IconHelp,
    },
    {
      title: 'Search',
      url: '#',
      icon: IconSearch,
    },
  ],
  uploads: [
    {
      name: 'Upload Beat',
      url: '#',
      icon: IconUpload,
    },
    {
      name: 'Upload Pack',
      url: '#',
      icon: IconPackageImport,
    },
    {
      name: 'Upload Blog Post',
      url: '#',
      icon: IconListDetails,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="!text-foreground" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/">
                <Avatar className="h-5 w-5 rounded-lg">
                  <AvatarImage src={BirdieBandsAvatar} alt={`Birdie Bands`} />
                  <AvatarFallback className="rounded-lg">B</AvatarFallback>
                </Avatar>
                {/* <IconInnerShadowTop className="!size-5 dark:!text-foreground" /> */}
                <span className="text-base font-semibold !text-foreground dark:!text-foreground">
                  Birdie Bands
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="!text-foreground">
        <NavMain items={data.navMain} />
        <NavDocuments items={data.uploads} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
