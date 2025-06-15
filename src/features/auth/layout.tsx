import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/shared/ui/kit/card";

export function AuthLayout({
    title,
    description,
    form,
    footer,
}: {
    title: React.ReactNode,
    description: React.ReactNode,
    form: React.ReactNode,
    footer: React.ReactNode,
}) {
    return (
        <main className="grow flex flex-col items-center pt-[200px] justify-center">
            <Card className="w-full max-w-[400px] max-h-[400px]">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {form}
            </CardContent>
            <CardFooter>
                {footer}
            </CardFooter>
            </Card>
        </main>
    )
}
