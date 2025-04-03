import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default function DashboardPage() {
    return (
        <><Tabs defaultValue="account" className="w-[400px]">
            <TabsList>
                <TabsTrigger value="account">All Published Pos</TabsTrigger>
                <TabsTrigger value="password">Drafts</TabsTrigger>
                <TabsTrigger value="password">All Performing Posts</TabsTrigger>
            </TabsList>
            <TabsContent value="account">Make changes to your account here.</TabsContent>
            <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
        </>
    )
}
