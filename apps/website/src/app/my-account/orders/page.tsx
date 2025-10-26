"use client";

import React from "react";
import { Card } from "@workspace/ui/components/card";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty";
import {
  createColumnHelper,
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  VisibilityState,
  flexRender,
  Table as ReactTable,
} from "@tanstack/react-table";
import { GetCustomerOrdersQuery } from "@/graphql";
import { formatAmount } from "@/helpers/currency.helper";
import { useCustomerOrdersQuery } from "@/hooks/api/shopify-order.hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import {
  ChevronDownIcon,
  Columns3Icon,
  SearchIcon,
  TruckIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

type ColumnItem = NonNullable<
  GetCustomerOrdersQuery["customer"]
>["orders"]["nodes"][number];

// const columnHelper = createColumnHelper<ColumnItem>();

const columns: ColumnDef<ColumnItem>[] = [
  {
    accessorKey: "orderNumber",
    header: "No",
    size: 10,
    cell: (props) => <p>{props.getValue<string>()}</p>,
  },
  {
    accessorKey: "name",
    header: "Order Number",
    cell: (props) => <p>{props.getValue<string>()}</p>,
  },
  {
    accessorKey: "lineItems",
    header: "Total Products",
    cell: (props) => {
      const lines = props.row.original.lineItems;
      const total = lines.edges.reduce(
        (acc, edge) => acc + edge.node.quantity,
        0
      );
      return <p>{total}</p>;
    },
  },
  {
    accessorKey: "processedAt",
    header: "Processed At",
    cell: (props) => <p>{props.getValue<string>()}</p>,
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
    cell: (props) => (
      <p>
        {formatAmount(
          props.row.original.totalPrice.amount,
          props.row.original.totalPrice.currencyCode as any
        )}
      </p>
    ),
  },
  {
    accessorKey: "fulfillmentStatus",
    header: "Fulfillment Status",
    enableResizing: true,
    cell: (props) => <p>{props.getValue<string>()}</p>,
  },
];

export default function CustomerOrdersPage() {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const { data, isLoading } = useCustomerOrdersQuery();
  //   console.log(data);
  const table = useReactTable({
    data: data?.orders.nodes || [],
    columns,

    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
    },
    enableColumnResizing: true,
    onColumnVisibilityChange: setColumnVisibility,
    columnResizeMode: "onChange",
    defaultColumn: {
      minSize: 40,
      maxSize: 800,
    },
  });

  /**
   * Instead of calling `column.getSize()` on every render for every header
   * and especially every data cell (very expensive),
   * we will calculate all column sizes at once at the root table level in a useMemo
   * and pass the column sizes down as CSS variables to the <table> element.
   */
  const columnSizeVars = React.useMemo(() => {
    const headers = table.getFlatHeaders();
    const colSizes: { [key: string]: number } = {};
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!;
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
  }, [table.getState().columnSizingInfo, table.getState().columnSizing]);

  return (
    <Card className="gap-0 p-0">
      <div className="border-b p-4 flex gap-4">
        <InputGroup className="sm:max-w-sm">
          <InputGroupInput placeholder="Search by order number" />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>

        <div className="flex gap-4 ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns3Icon />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
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
                      {column.columnDef.header as string}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* <pre style={{ minHeight: "10rem" }}>
        {JSON.stringify(
          {
            columnSizing: table.getState().columnSizing,
          },
          null,
          2
        )}
      </pre> */}
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div>
          <Table style={{ ...columnSizeVars }}>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      style={{
                        width: `calc(var(--header-${header?.id}-size) * 1px)`,
                      }}
                      key={header.id}
                      className="relative group active:bg-muted"
                    >
                      {header.column.columnDef.header as string}
                      <button
                        data-resizing={header.column.getIsResizing()}
                        onTouchStart={header.getResizeHandler()}
                        onMouseDown={header.getResizeHandler()}
                        className="group-hover:pointer-events-auto group-hover:opacity-100 opacity-0 pointer-events-none absolute right-0 h-full top-0 w-0.5 bg-primary hover:cursor-e-resize data-[resizing=true]:bg-green-600 z-[2]"
                      />
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            {data?.numberOfOrders === "0" && (
              <NoOrdersPlaceHolder table={table} />
            )}

            {table.getState().columnSizingInfo.isResizingColumn ? (
              <MemoizedTableBody table={table} />
            ) : (
              <UnMemoizedTableBody table={table} />
            )}
          </Table>
        </div>
      </ScrollArea>
    </Card>
  );
}

//un-memoized normal table body component - see memoized version below
function UnMemoizedTableBody({ table }: { table: ReactTable<ColumnItem> }) {
  return (
    <TableBody>
      {table.getRowModel().rows.map((row) => (
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <TableCell
              key={cell.id}
              style={{
                width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
              }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  );
}

//special memoized wrapper for our table body that we will use during column resizing
export const MemoizedTableBody = React.memo(
  UnMemoizedTableBody,
  (prev, next) => prev.table.options.data === next.table.options.data
) as typeof UnMemoizedTableBody;

const NoOrdersPlaceHolder = ({ table }: { table: ReactTable<ColumnItem> }) => {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={table.getVisibleFlatColumns().length}>
          <Empty className="border border-dashed min-h-[calc(100vh-15rem)]">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="size-12 rounded-full">
                <TruckIcon />
              </EmptyMedia>
              <EmptyTitle>Orders List is Empty</EmptyTitle>
              <EmptyDescription>
                You have not placed any orders yet.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" size="sm" asChild>
                <Link href="/products"> Go to Shop </Link>
              </Button>
            </EmptyContent>
          </Empty>
        </TableCell>
      </TableRow>
    </TableBody>
  );
};

const EmptySearchResult = ({ table }: { table: ReactTable<ColumnItem> }) => {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={table.getVisibleFlatColumns().length}>
          <Empty className="border border-dashed min-h-[calc(100vh-15rem)]">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="size-12 rounded-full">
                <TruckIcon />
              </EmptyMedia>
              <EmptyTitle>No matching orders found</EmptyTitle>
              <EmptyDescription>
                No orders found for the search criteria.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline" size="sm" asChild>
                <Link href="/products"> Reset Search </Link>
              </Button>
            </EmptyContent>
          </Empty>
        </TableCell>
      </TableRow>
    </TableBody>
  );
};
