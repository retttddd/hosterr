import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Title} from "@/components/start-page";
import {Table} from "@/components/ui/table";
import {StorageTable} from "@/components/storageTable";


export default function storagePage() {
    return (
        <div className="flex flex-col gap-8 p-10 m-20">
            <Title>
                Avaliable storages
            </Title>
            <Card className="w-full max-w-2xl">
                <CardContent>
                <StorageTable storages={[{ name: "test", status: "Active", memory: "10GB", id: 1 }, { name: "Storage 2", status: "Inactive", memory: "5GB", id: 2 }]} />

                </CardContent>
            </Card>
        </div>
    );
}
