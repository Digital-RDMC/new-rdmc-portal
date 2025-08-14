"use client";
// import * as XLSX from "xlsx";
import { useEffect, useState } from "react";
import {  useUser } from "@/contexts/UserContext";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Undo2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuLabel,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";



import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import { auth } from "firebase-admin";
// import { useRouter } from "next/navigation";



interface Item {
    PICSerial: string;
    company: string;
    name: string;
    phoneNumber: string;
    personalId: string;
    // status: string;
    accreditationEndDate: string;
    lastDate: string;
  }



const statusColors = {
  Active: "bg-green-800  text-white  rounded-sm px-2",
  Suspended: "bg-yellow-300 text-black  rounded-sm px-2",
  Blacklisted: "bg-gray-800 text-white rounded-sm px-2",
  Expired: "bg-red-800 text-white  rounded-sm px-2",
};



export default function DataTableDemo() {
  const [data, setData] = useState<Item[]>([]);
  const [filterSelect, setFilterSelect] = useState<string>("name");
  const { userData } = useUser();

  const columns: ColumnDef<Item>[] = [
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div
          className={`capitalize ${
            statusColors[row.getValue("status") as keyof typeof statusColors] ||
            ""
          }`}
        >
          {row.getValue("status")}
        </div>
      ),
    },
    {
      accessorKey: "company",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Company
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("company")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            PIC Name
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "PICSerial",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            PIC ID #
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("PICSerial")}</div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Mobile
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("phoneNumber")}</div>,
    },
    {
      accessorKey: "lastDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Qualification
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("lastDate")}</div>
      ),
    },
    {
      accessorKey: "accreditationEndDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Accreditation Date
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("accreditationEndDate")}</div>
      ),
    },
    {
      accessorKey: "personalId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID Number
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => <div className="lowercase">{row.getValue("personalId")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  window.open(`/pic/view/${row.getValue("personalId")}`, "_blank")
                }
              >
                View record
              </DropdownMenuItem>
              {userData?.[0]?.position === "Head of PTW" || userData?.[0]?.position === "Head of Digital" && (
                <DropdownMenuItem
                  onClick={() =>
                    window.open(`/edit/${row.getValue("id")}`, "_blank")
                  }
                >
                  Edit record
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [auth, setAuth] = useState<boolean>(false);
//   const [uid, setUID] = useState<string | null>(null);
  // const router = useRouter();
//   const now2 = new Date().toString().split("GMT")[0];

//   const exportToExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(data); // Convert JSON to worksheet
//     const workbook = XLSX.utils.book_new(); // Create a new workbook
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Data"); // Append the worksheet
//     XLSX.writeFile(workbook, `RDMC GL3 PIC List ${now2} .xlsx`); // Trigger the download
//   };

  useEffect(() => {
    const handler = async () => {
    //   const authss = await localStorage.getItem("uid");
    //   setUID(authss);
    //   const admins = ["RDMC0789", "RDMC-B0023", "RDMC-B0262"];
    //   if (authss && admins.includes(authss)) {
    //     setAuth(true);
    //   }
      const response = await fetch("https://n8n.srv869586.hstgr.cloud/webhook/pic", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const d = await response.json();
        console.log("timo timo", d);
        // const dd: Item[] = [
        //   {
        //     id: "m5gr84i9",
        //     amount: 316,
        //     status: "success",
        //     email: "ken99@example.com",
        //   },
        //   {
        //     id: "3u1reuv4",
        //     amount: 242,
        //     status: "success",
        //     email: "Abe45@example.com",
        //   },
        //   {
        //     id: "derv1ws0",
        //     amount: 837,
        //     status: "processing",
        //     email: "Monserrat44@example.com",
        //   },
        //   {
        //     id: "5kma53ae",
        //     amount: 874,
        //     status: "success",
        //     email: "Silas22@example.com",
        //   },
        //   {
        //     id: "bhqecj4p",
        //     amount: 721,
        //     status: "failed",
        //     email: "carmella@example.com",
        //   },
        // ]
        setData(d);
      }
    };
    handler();
  }, []);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
  });

  const clearAllFilters = () => {
    setColumnFilters([]);
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 items-center w-full max-w-[400px] md:max-w-7xl mx-auto py-4">
        <h3 className="mx-auto w-fit font-bold flex flex-col ">
          <span>GL3 | RDMC PIC List </span>
        </h3>
      </div>
      <div className="flex gap-2 items-center w-full max-w-[400px] md:max-w-7xl mx-auto py-4">
        <div className="grid grid-cols-3 gap-0">
          {/* <span className="absolute w-1/2 h-full p-1">
            <span className="rounded-lg bg-primary w-full relative leading-2 text-xs text-primary-foreground">
              ebwrbwbweb
            </span>
          </span> */}

          <Select
            value={filterSelect}
            onValueChange={(value) => setFilterSelect(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fliters</SelectLabel>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="PICSerial">
                  PIC Authorization Number
                </SelectItem>
                <SelectItem value="phoneNumber">PhoneNumber Number</SelectItem>
                <SelectItem value="id">National ID</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Input
            placeholder="Filter ..."
            value={
              (table.getColumn(filterSelect)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) => {
              table.getColumn(filterSelect)?.setFilterValue(event.target.value);
            }}
            className="max-w-sm"
          />
          <Button
            className="w-auto mx-2"
            onClick={() => {
              clearAllFilters();
            }}
          >
            <Undo2Icon /> Clear filters
          </Button>
        </div>

        <DropdownMenu>
          {/* <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto bg-white">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger> */}
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* <Button variant="outline" className="bg-slate-100" onClick={() => router.push("")}>
          Add
        </Button> */}
        {/* <Button
          variant="outline"
          className="bg-slate-100"
          onClick={exportToExcel}
        >
          Download
        </Button> */}
      </div>
      <div>
        <ScrollArea className=" w-full max-w-[400px] md:max-w-7xl  mx-auto py-8 pe-12">
          <Table className="border border-gray-900/10 p-3">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody className="">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4 w-full max-w-[400px] md:max-w-7xl mx-auto">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-white"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      {/* <pre>
           {JSON.stringify(data,null, 2)}
      </pre> */}
    </div>
  );
}
