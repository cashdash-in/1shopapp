
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BusinessPartnersPage from "./business-partners-content";
import IndividualPartnersPage from "../individual-partners/page";


export default function PartnersPage() {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-lg font-semibold md:text-2xl">Partners</h1>
            <Tabs defaultValue="business">
                <TabsList>
                    <TabsTrigger value="business">Business Partners</TabsTrigger>
                    <TabsTrigger value="individual">Individual Partners</TabsTrigger>
                </TabsList>
                <TabsContent value="business">
                   <BusinessPartnersPage />
                </TabsContent>
                <TabsContent value="individual">
                    <IndividualPartnersPage />
                </TabsContent>
            </Tabs>
        </div>
    )
}
