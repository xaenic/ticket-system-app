import { Building2, ChartColumnBigIcon, Ticket, UsersRound } from "lucide-react";

export const adminData = [
  {
    title: "Dashboard",
    icon: <ChartColumnBigIcon size={24} />,
    url: "dashboard",
  },
  {
    title: "Departments",
    icon: <Building2 size={22} />,
    url: "departments",
  },

  {
    title: "Agents",
    icon: <UsersRound size={20} />,
    url: "agents",
  },

  {
    title: "Tickets",
    icon: <Ticket size={24} />,
    url: "tickets",
  },
];
export const agentData = [
    {
      title: "Dashboard",
      icon: <ChartColumnBigIcon size={24} />,
      url: "dashboard",
    },
    {
      title: "Opened Tickets",
      icon: <Ticket size={22} />,
      url: "tickets",
    },

    {
      title: "Assigned Tickets",
      icon: <Ticket size={22} />,
      url: "assigned",
    },
  ];

export const clientData = [
    {
      title: "Dashboard",
      icon: <ChartColumnBigIcon size={24} />,
      url: "dashboard",
    },
    {
      title: "My Tickets",
      icon: <Ticket size={22} />,
      url: "tickets",
    },
  ];