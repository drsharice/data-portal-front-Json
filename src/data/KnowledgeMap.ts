// src/data/KnowledgeMap.ts
// Centralized knowledge reference for Dedge to understand available data sources

export const KnowledgeMap = {
  accessible: {
    Active_Directory_Computers: {
      path: "/mock/data/Active_Directory_Computers.json",
      description:
        "Inventory of computers and servers managed in Active Directory, including OS type and status.",
      keyFields: [
        "Computer_Name",
        "Operating_System",
        "Last_Logon_Date",
        "Enabled",
      ],
      insights: [
        "Identify inactive or disabled computers.",
        "Summarize operating system distribution across the network.",
        "Track password set and logon activity dates.",
      ],
    },
    Active_Directory_Groups: {
      path: "/mock/data/Active_Directory_Groups.json",
      description:
        "Contains all Active Directory groups, including category, scope, and organizational unit.",
      keyFields: [
        "group_name",
        "group_category",
        "group_scope",
        "organizational_unit",
      ],
      insights: [
        "Summarize groups by type (Security vs Distribution).",
        "Track group creation and modification activity.",
        "Identify OU-level group structures.",
      ],
    },
    Bloomberg_User_ReportTable: {
      path: "/mock/data/Bloomberg_User_ReportTable.json",
      description:
        "List of Bloomberg users, regions, and active status indicators.",
      keyFields: ["Name", "Region", "Active"],
      insights: [
        "Count active Bloomberg users by region.",
        "Identify inactive or deactivated Bloomberg users.",
      ],
    },
    Computer_Hardware: {
      path: "/mock/data/Computer_Hardware.json",
      description:
        "Hardware asset inventory including manufacturer, processor, and memory capacity.",
      keyFields: [
        "Hostname",
        "Device_Manufacturer",
        "Processor",
        "Memory_GB",
      ],
      insights: [
        "Summarize hardware distribution by manufacturer.",
        "Identify high-memory devices or outdated hardware.",
      ],
    },
    Finance_Budget: {
      path: "/mock/data/Finance_Budget.json",
      description:
        "Department-level financial budgets and spending data for internal tracking.",
      keyFields: ["department", "budget", "spent"],
      insights: [
        "Compare spending vs. budget allocation per department.",
        "Highlight departments exceeding 80% budget utilization.",
      ],
    },
    HR_Devices: {
      path: "/mock/data/HR_Devices.json",
      description:
        "Device assignment list for employees across departments and office locations.",
      keyFields: ["name", "department", "device", "location"],
      insights: [
        "Summarize devices by department or type.",
        "Identify location-based device distributions.",
      ],
    },
    HR_Employees: {
      path: "/mock/data/HR_Employees.json",
      description:
        "Human Resources dataset listing employees, job titles, and unique identifiers.",
      keyFields: ["EmpId", "FirstName", "LastName", "Title"],
      insights: [
        "List employees by title or role.",
        "Track employee count by department when correlated.",
      ],
    },
    IT_Software: {
      path: "/mock/data/IT_Software.json",
      description:
        "IT software inventory by department and license count.",
      keyFields: ["department", "software", "licenses"],
      insights: [
        "Summarize software usage across departments.",
        "Identify most widely licensed software applications.",
      ],
    },
    OCC_Unified_Patching_Report: {
      path: "/mock/data/OCC_Unified_Patching_Report.json",
      description:
        "Patch management and compliance dataset tracking software updates across devices.",
      keyFields: ["Core_Business_Line", "Patch_Name", "Rating", "Operating_System"],
      insights: [
        "Summarize patches by rating (Critical, Important, etc.).",
        "Identify overdue or unpatched systems.",
      ],
    },
    RightFax_Users: {
      path: "/mock/data/RightFax_Users.json",
      description:
        "Fax and document service user list by department and status.",
      keyFields: ["Login", "Dept", "Enabled"],
      insights: [
        "Count enabled vs disabled fax users.",
        "Show department-level usage of RightFax services.",
      ],
    },
    User_Entitlements: {
      path: "/mock/data/User_Entitlements.json",
      description:
        "Comprehensive user entitlement dataset tracking cloud access, WAVE status, and adoption metrics.",
      keyFields: [
        "Employee_ID",
        "AD_status",
        "OneDrive_Status",
        "Exchange_Online_Status",
        "Teams_Enabled",
        "Modern_Score",
      ],
      insights: [
        "Summarize adoption metrics for OneDrive and Teams.",
        "Identify users with restricted or inactive entitlements.",
        "Calculate average Modern Score across the organization.",
      ],
    },
  },

  restricted: {
    catalog: {
      path: "/mock/mockDatasets.json",
      description:
        "Datasets available in the global catalog for request and access approval.",
    },
    apis: {
      path: "/mock/mockApis.json",
      description:
        "API endpoints for Bloomberg, HR, and M365 with available Swagger documentation.",
    },
    reports: {
      path: "/mock/mockReports.json",
      description:
        "Mock Power BI and internal reporting data accessible upon approval.",
    },
  },
};

export type DatasetKey = keyof typeof KnowledgeMap.accessible;
