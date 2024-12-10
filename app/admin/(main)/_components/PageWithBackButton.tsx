import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

export function PageWithBackButton({
    backButtonHref,
    pageTitle,
    children,
}: {
    backButtonHref: string;
    pageTitle: string;
    children: ReactNode;
}) {
    return (
        <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-8">
            <Button size="icon" variant="outline" className="rounded-full" asChild>
                <Link href={backButtonHref}>
                    <div className="sr-only">Back</div>
                    <ChevronLeft className="w-6 h-6" />
                </Link>
            </Button>
            <h1 className="text-2xl font-semibold self-center">{pageTitle}</h1>
            <div className="col-start-2">{children}</div>
        </div>
    );
}
