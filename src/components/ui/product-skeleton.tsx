import { Card, CardBody, CardHeader } from "@heroui/react";

interface ProductSkeletonProps {
  count?: number;
}

export function ProductSkeleton({ count = 8 }: ProductSkeletonProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="max-w-[400px]">
          <CardBody className="p-0">
            <div className="h-40 rounded-t-xl bg-default-200 animate-pulse" />
          </CardBody>
          <CardHeader className="flex-col items-start px-4 pb-4">
            <div className="flex items-center justify-between w-full">
              <div className="h-5 bg-default-200 rounded animate-pulse flex-1 mr-4" />
              <div className="h-4 w-12 bg-default-200 rounded animate-pulse" />
            </div>
            <div className="mt-2 space-y-2 w-full">
              <div className="h-4 bg-default-200 rounded animate-pulse w-full" />
              <div className="h-4 bg-default-200 rounded animate-pulse w-3/4" />
            </div>
            <div className="mt-4 flex gap-2 w-full">
              <div className="h-8 w-16 bg-default-200 rounded-full animate-pulse" />
              <div className="h-8 w-12 bg-default-200 rounded-full animate-pulse" />
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: ProductSkeletonProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <div className="h-8 bg-default-200 rounded animate-pulse mx-auto w-48 mb-4" />
        <div className="h-5 bg-default-200 rounded animate-pulse mx-auto w-64" />
      </div>
      <ProductSkeleton count={count} />
    </section>
  );
}