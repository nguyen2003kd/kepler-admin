import { Button } from "@/components/ui/button";
import { PanelBottom, Plus } from "lucide-react";
import Link from "next/link";
import Can from "@/acl/Can";

export function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="mx-auto h-12 w-12 text-muted-foreground mb-4">
        <PanelBottom className="h-full w-full" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Chưa có footer nào</h3>
      <p className="text-muted-foreground mb-4">
        Bắt đầu bằng cách tạo footer đầu tiên
      </p>
      <Can I="create" a="footer">
        <Link href="/footer/create">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Tạo Footer
          </Button>
        </Link>
      </Can>
    </div>
  );
}
